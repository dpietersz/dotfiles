/**
 * auth-sync — Centralized OAuth token sync via minion-daemon
 *
 * Syncs ~/.pi/agent/auth.json with the local daemon, which persists to Postgres.
 * Other daemons receive changes via LISTEN/NOTIFY and update their own auth.json.
 *
 * Pull: on session_start, fetch tokens from the daemon and adopt any that are
 * fresher than the local copy (another machine may have refreshed while this
 * pi instance was down).
 *
 * Push: watch auth.json and POST any credential whose `expires` advances past
 * what we last exchanged with the daemon. Pi's built-in OAuth refresh writes
 * auth.json, so watching the file catches every refresh and login without
 * hooking into pi's provider internals.
 *
 * Fail-safe: if the daemon is unreachable, pi works normally (built-in refresh).
 *
 * Do NOT reintroduce provider wrapping via `getOAuthProvider`. That runtime
 * export was removed upstream — `@earendil-works/pi-ai/oauth` is a type-only
 * entry point as of pi 0.80.8 (`dist/oauth.js` is literally `export {}`), and
 * the built-in OAuth flows under `pi-ai/dist/auth/oauth/` are deliberately
 * absent from the package's `exports` map. Syncing at the auth.json layer is
 * provider-agnostic and version-agnostic: the on-disk credential shape is
 * identical on 0.78.0 and 0.80.10, so this file works unchanged on both and
 * survives upstream churn.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const DAEMON_URL = "http://127.0.0.1:8484";
const AUTH_PATH = path.join(os.homedir(), ".pi", "agent", "auth.json");
const AUTH_DIR = path.dirname(AUTH_PATH);
const WATCH_DEBOUNCE_MS = 250;

type StoredCredential = {
	type?: string;
	access?: string;
	refresh?: string;
	expires?: number;
	[key: string]: unknown;
};

/** Last `expires` per provider that we know the daemon has. Prevents push/pull echo. */
const lastSynced = new Map<string, number>();

// ── Daemon communication ────────────────────────────────────────────────────

async function postTokens(provider: string, credentials: StoredCredential): Promise<boolean> {
	try {
		const res = await fetch(`${DAEMON_URL}/api/v1/auth/tokens`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ provider, credentials: { ...credentials, type: "oauth" } }),
			signal: AbortSignal.timeout(5000),
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			console.error(`[auth-sync] POST tokens failed: ${res.status} ${body}`);
			return false;
		}
		return true;
	} catch {
		// Daemon not running — silently continue.
		return false;
	}
}

async function getTokens(): Promise<Record<string, StoredCredential> | null> {
	try {
		const res = await fetch(`${DAEMON_URL}/api/v1/auth/tokens`, {
			signal: AbortSignal.timeout(5000),
		});
		if (!res.ok) return null;
		return (await res.json()) as Record<string, StoredCredential>;
	} catch {
		// Daemon not running — silently continue.
		return null;
	}
}

// ── auth.json helpers ───────────────────────────────────────────────────────

function readAuthJSON(): Record<string, StoredCredential> {
	try {
		return JSON.parse(fs.readFileSync(AUTH_PATH, "utf-8"));
	} catch {
		return {};
	}
}

function writeAuthJSON(data: Record<string, StoredCredential>): void {
	if (!fs.existsSync(AUTH_DIR)) {
		fs.mkdirSync(AUTH_DIR, { recursive: true, mode: 0o700 });
	}
	const tmp = AUTH_PATH + ".tmp";
	fs.writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
	fs.renameSync(tmp, AUTH_PATH);
}

function getExpires(cred: unknown): number {
	if (typeof cred === "object" && cred !== null && "expires" in cred) {
		const expires = (cred as { expires: unknown }).expires;
		return typeof expires === "number" ? expires : 0;
	}
	return 0;
}

function isOAuth(cred: unknown): cred is StoredCredential {
	return typeof cred === "object" && cred !== null && (cred as StoredCredential).type === "oauth";
}

// ── Sync passes ─────────────────────────────────────────────────────────────

/** Adopt daemon credentials that are fresher than local. Returns true if auth.json changed. */
async function pullPass(): Promise<boolean> {
	const dbTokens = await getTokens();
	if (!dbTokens) return false;

	const local = readAuthJSON();
	let updated = false;

	for (const [provider, dbCred] of Object.entries(dbTokens)) {
		if (!isOAuth(dbCred)) continue;
		const dbExpires = getExpires(dbCred);

		// Record what the daemon holds so pushPass doesn't echo it straight back.
		lastSynced.set(provider, Math.max(dbExpires, lastSynced.get(provider) ?? 0));

		if (dbExpires > getExpires(local[provider])) {
			local[provider] = dbCred;
			updated = true;
		}
	}

	if (updated) writeAuthJSON(local);
	return updated;
}

/** POST local credentials that are fresher than what the daemon last showed us. */
async function pushPass(): Promise<void> {
	const local = readAuthJSON();

	for (const [provider, cred] of Object.entries(local)) {
		if (!isOAuth(cred)) continue;
		const expires = getExpires(cred);
		if (expires <= (lastSynced.get(provider) ?? 0)) continue;

		if (await postTokens(provider, cred)) {
			lastSynced.set(provider, expires);
		}
	}
}

// ── Extension entry point ───────────────────────────────────────────────────

export default function register(pi: ExtensionAPI): void {
	let watcher: fs.FSWatcher | undefined;
	let debounce: ReturnType<typeof setTimeout> | undefined;
	let pushing = false;

	const schedulePush = () => {
		if (debounce) clearTimeout(debounce);
		debounce = setTimeout(() => {
			if (pushing) return;
			pushing = true;
			pushPass()
				.catch(() => {})
				.finally(() => {
					pushing = false;
				});
		}, WATCH_DEBOUNCE_MS);
		// Never let a pending push keep a headless `pi -p` process alive.
		debounce.unref?.();
	};

	pi.on("session_start", async (_event, ctx) => {
		// Pull first so lastSynced reflects the daemon's state before we push.
		const updated = await pullPass();
		if (updated) {
			// Registry reads are synchronous but refresh is async as of pi 0.80.8.
			await ctx.modelRegistry.refresh();
		}

		// Upload anything local that is fresher than the daemon (e.g. a refresh
		// that happened while the daemon was down).
		await pushPass();

		if (watcher) return;
		try {
			if (!fs.existsSync(AUTH_DIR)) return;
			// Watch the directory, not the file: writeAuthJSON and pi's own writes
			// replace auth.json via rename, which breaks a file-scoped watch.
			watcher = fs.watch(AUTH_DIR, (_type, filename) => {
				if (filename === "auth.json") schedulePush();
			});
			watcher.unref?.();
		} catch (err) {
			console.error(`[auth-sync] auth.json watch unavailable: ${(err as Error).message}`);
		}
	});

	// Note: the event is `session_shutdown` — there is no `session_end`. Getting
	// this wrong leaks the file watcher silently.
	pi.on("session_shutdown", () => {
		if (debounce) clearTimeout(debounce);
		watcher?.close();
		watcher = undefined;
	});
}
