/**
 * auth-sync — Centralized OAuth token sync via minion-daemon
 *
 * Wraps the built-in OAuth providers (anthropic, openai-codex, google-gemini-cli)
 * to intercept token refresh and login events. When tokens change, POSTs them to
 * the local daemon which syncs to Postgres. Other daemons receive the change via
 * LISTEN/NOTIFY and update their auth.json.
 *
 * On session_start, fetches the latest tokens from the daemon in case another
 * machine refreshed while this pi instance wasn't running.
 *
 * Fail-safe: if daemon is unreachable, pi works normally (built-in refresh).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { getOAuthProvider } from "@mariozechner/pi-ai/oauth";

const DAEMON_URL = "http://127.0.0.1:8484";
const AUTH_PATH = path.join(os.homedir(), ".pi", "agent", "auth.json");

// Providers to wrap. These must match the provider IDs in pi's OAuth registry.
const OAUTH_PROVIDERS = ["anthropic", "openai-codex", "google-gemini-cli"] as const;

type OAuthCredentials = {
	access: string;
	refresh: string;
	expires: number;
	[key: string]: unknown; // accountId, projectId, email, etc.
};

// ── Daemon communication ────────────────────────────────────────────────────

async function postTokens(provider: string, credentials: OAuthCredentials): Promise<boolean> {
	try {
		const res = await fetch(`${DAEMON_URL}/api/v1/auth/tokens`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ provider, credentials: { type: "oauth", ...credentials } }),
			signal: AbortSignal.timeout(5000),
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			console.error(`[auth-sync] POST tokens failed: ${res.status} ${body}`);
			return false;
		}
		return true;
	} catch (err) {
		// Daemon not running — silently continue.
		console.error(`[auth-sync] daemon unreachable for POST: ${(err as Error).message}`);
		return false;
	}
}

async function getTokens(): Promise<Record<string, unknown> | null> {
	try {
		const res = await fetch(`${DAEMON_URL}/api/v1/auth/tokens`, {
			signal: AbortSignal.timeout(5000),
		});
		if (!res.ok) return null;
		return (await res.json()) as Record<string, unknown>;
	} catch {
		// Daemon not running — silently continue.
		return null;
	}
}

// ── auth.json helpers ───────────────────────────────────────────────────────

function readAuthJSON(): Record<string, unknown> {
	try {
		return JSON.parse(fs.readFileSync(AUTH_PATH, "utf-8"));
	} catch {
		return {};
	}
}

function writeAuthJSON(data: Record<string, unknown>): void {
	const dir = path.dirname(AUTH_PATH);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
	}
	const tmp = AUTH_PATH + ".tmp";
	fs.writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
	fs.renameSync(tmp, AUTH_PATH);
}

function getExpires(cred: unknown): number {
	if (typeof cred === "object" && cred !== null && "expires" in cred) {
		return (cred as { expires: number }).expires;
	}
	return 0;
}

// ── Extension entry point ───────────────────────────────────────────────────

export default function register(pi: ExtensionAPI): void {
	// CRITICAL: Capture original providers BEFORE registerProvider replaces them.
	// registerProvider is queued during load, but getOAuthProvider still returns
	// the built-in at this point. We store references to call in our wrappers.
	const originals = new Map<string, { login: Function; refreshToken: Function; getApiKey: Function }>();

	for (const providerId of OAUTH_PROVIDERS) {
		const original = getOAuthProvider(providerId);
		if (!original) {
			console.error(`[auth-sync] Original OAuth provider ${providerId} not found, skipping`);
			continue;
		}
		originals.set(providerId, {
			login: original.login.bind(original),
			refreshToken: original.refreshToken.bind(original),
			getApiKey: original.getApiKey.bind(original),
		});
	}

	// Now register wrapped providers. These replace the built-in OAuth handlers
	// but use the captured originals for actual OAuth flows.
	for (const providerId of OAUTH_PROVIDERS) {
		const original = originals.get(providerId);
		if (!original) continue;

		pi.registerProvider(providerId, {
			oauth: {
				name: `${providerId} (auth-sync)`,

				async login(callbacks) {
					const credentials = await original.login(callbacks);

					// Sync to daemon (best-effort, non-blocking).
					postTokens(providerId, credentials).catch(() => {});

					return credentials;
				},

				async refreshToken(credentials) {
					// Before hitting the provider's API, check if the daemon already
					// has a fresher token (another machine may have just refreshed).
					// This prevents redundant refresh calls that can trigger rate limits
					// when multiple pi instances detect expiry at the same time.
					try {
						const dbTokens = await getTokens();
						if (dbTokens) {
							const dbCred = dbTokens[providerId] as Record<string, unknown> | undefined;
							if (dbCred && getExpires(dbCred) > Date.now()) {
								// DB has a valid (non-expired) token — use it instead of refreshing.
								return dbCred as unknown as typeof credentials;
							}
						}
					} catch {
						// Daemon unreachable — fall through to normal refresh.
					}

					const newCredentials = await original.refreshToken(credentials);

					// Sync to daemon (best-effort, non-blocking).
					postTokens(providerId, newCredentials).catch(() => {});

					return newCredentials;
				},

				getApiKey(credentials) {
					return original.getApiKey(credentials);
				},
			},
		});
	}

	// On session start, fetch latest tokens from daemon and update auth.json
	// if the daemon has fresher tokens (another machine may have refreshed).
	pi.on("session_start", async (_event, ctx) => {
		const dbTokens = await getTokens();
		if (!dbTokens) return; // Daemon unreachable, no-op.

		const local = readAuthJSON();
		let updated = false;

		for (const [provider, dbCred] of Object.entries(dbTokens)) {
			const localCred = local[provider];
			const dbExpires = getExpires(dbCred);
			const localExpires = getExpires(localCred);

			if (dbExpires > localExpires) {
				local[provider] = dbCred;
				updated = true;
			}
		}

		if (updated) {
			writeAuthJSON(local);
			// Reload the model registry so pi picks up the fresh tokens.
			ctx.modelRegistry.refresh();
		}
	});
}
