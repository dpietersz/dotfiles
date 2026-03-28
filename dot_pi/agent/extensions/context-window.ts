/**
 * /ctx - Beautiful context window usage overlay
 *
 * Shows context window usage in a visually rich two-column layout
 * inspired by the pi-powerline-footer welcome screen, with:
 * - Gradient usage gauge
 * - Breakdown by category (system, tools, conversation)
 * - Session totals (tokens/cost)
 * - Loaded extensions, skills, and AGENTS files
 */

import type { ExtensionAPI, ExtensionCommandContext, ExtensionContext, ToolResultEvent } from "@mariozechner/pi-coding-agent";
import { DynamicBorder } from "@mariozechner/pi-coding-agent";
import { Container, Key, Text, matchesKey, visibleWidth, truncateToWidth, type Component, type TUI } from "@mariozechner/pi-tui";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync, readFileSync, readdirSync } from "node:fs";

// ═══════════════════════════════════════════════════════════════════════════
// Utility helpers
// ═══════════════════════════════════════════════════════════════════════════

function formatUsd(cost: number): string {
	if (!Number.isFinite(cost) || cost <= 0) return "$0.00";
	if (cost >= 1) return `$${cost.toFixed(2)}`;
	if (cost >= 0.1) return `$${cost.toFixed(3)}`;
	return `$${cost.toFixed(4)}`;
}

function estimateTokens(text: string): number {
	return Math.max(0, Math.ceil(text.length / 4));
}

function normalizeReadPath(inputPath: string, cwd: string): string {
	let p = inputPath;
	if (p.startsWith("@")) p = p.slice(1);
	if (p === "~") p = os.homedir();
	else if (p.startsWith("~/")) p = path.join(os.homedir(), p.slice(2));
	if (!path.isAbsolute(p)) p = path.resolve(cwd, p);
	return path.resolve(p);
}

function getAgentDir(): string {
	const envCandidates = ["PI_CODING_AGENT_DIR", "TAU_CODING_AGENT_DIR"];
	let envDir: string | undefined;
	for (const k of envCandidates) {
		if (process.env[k]) { envDir = process.env[k]; break; }
	}
	if (!envDir) {
		for (const [k, v] of Object.entries(process.env)) {
			if (k.endsWith("_CODING_AGENT_DIR") && v) { envDir = v; break; }
		}
	}
	if (envDir) {
		if (envDir === "~") return os.homedir();
		if (envDir.startsWith("~/")) return path.join(os.homedir(), envDir.slice(2));
		return envDir;
	}
	return path.join(os.homedir(), ".pi", "agent");
}

async function readFileIfExists(filePath: string): Promise<{ path: string; content: string; bytes: number } | null> {
	if (!existsSync(filePath)) return null;
	try {
		const buf = await fs.readFile(filePath);
		return { path: filePath, content: buf.toString("utf8"), bytes: buf.byteLength };
	} catch { return null; }
}

async function loadProjectContextFiles(cwd: string): Promise<Array<{ path: string; tokens: number; bytes: number }>> {
	const out: Array<{ path: string; tokens: number; bytes: number }> = [];
	const seen = new Set<string>();
	const loadFromDir = async (dir: string) => {
		for (const name of ["AGENTS.md", "CLAUDE.md"]) {
			const p = path.join(dir, name);
			const f = await readFileIfExists(p);
			if (f && !seen.has(f.path)) {
				seen.add(f.path);
				out.push({ path: f.path, tokens: estimateTokens(f.content), bytes: f.bytes });
				return;
			}
		}
	};
	await loadFromDir(getAgentDir());
	const stack: string[] = [];
	let current = path.resolve(cwd);
	while (true) {
		stack.push(current);
		const parent = path.resolve(current, "..");
		if (parent === current) break;
		current = parent;
	}
	stack.reverse();
	for (const dir of stack) await loadFromDir(dir);
	return out;
}

function shortenPath(p: string, cwd: string): string {
	const rp = path.resolve(p);
	const rc = path.resolve(cwd);
	if (rp === rc) return ".";
	if (rp.startsWith(rc + path.sep)) return "./" + rp.slice(rc.length + 1);
	const home = os.homedir();
	if (rp.startsWith(home + path.sep)) return "~/" + rp.slice(home.length + 1);
	return rp;
}

function normalizeSkillName(name: string): string {
	return name.startsWith("skill:") ? name.slice("skill:".length) : name;
}

type SkillIndexEntry = { name: string; skillFilePath: string; skillDir: string };

function buildSkillIndex(pi: ExtensionAPI, cwd: string): SkillIndexEntry[] {
	return pi.getCommands()
		.filter((c) => c.source === "skill")
		.map((c) => {
			const p = c.path ? normalizeReadPath(c.path, cwd) : "";
			return { name: normalizeSkillName(c.name), skillFilePath: p, skillDir: p ? path.dirname(p) : "" };
		})
		.filter((x) => x.name && x.skillDir);
}

const SKILL_LOADED_ENTRY = "ctx:skill_loaded";
type SkillLoadedEntryData = { name: string; path: string };

function getLoadedSkillsFromSession(ctx: ExtensionContext): Set<string> {
	const out = new Set<string>();
	for (const e of ctx.sessionManager.getEntries()) {
		if ((e as any)?.type !== "custom") continue;
		if ((e as any)?.customType !== SKILL_LOADED_ENTRY) continue;
		const data = (e as any)?.data as SkillLoadedEntryData | undefined;
		if (data?.name) out.add(data.name);
	}
	return out;
}

function extractCostTotal(usage: any): number {
	if (!usage) return 0;
	const c = usage?.cost;
	if (typeof c === "number") return Number.isFinite(c) ? c : 0;
	if (typeof c === "string") { const n = Number(c); return Number.isFinite(n) ? n : 0; }
	const t = c?.total;
	if (typeof t === "number") return Number.isFinite(t) ? t : 0;
	if (typeof t === "string") { const n = Number(t); return Number.isFinite(n) ? n : 0; }
	return 0;
}

function sumSessionUsage(ctx: ExtensionCommandContext): {
	input: number; output: number; cacheRead: number; cacheWrite: number; totalTokens: number; totalCost: number;
} {
	let input = 0, output = 0, cacheRead = 0, cacheWrite = 0, totalCost = 0;
	for (const entry of ctx.sessionManager.getEntries()) {
		if ((entry as any)?.type !== "message") continue;
		const msg = (entry as any)?.message;
		if (!msg || msg.role !== "assistant") continue;
		const usage = msg.usage;
		if (!usage) continue;
		input += Number(usage.inputTokens ?? 0) || 0;
		output += Number(usage.outputTokens ?? 0) || 0;
		cacheRead += Number(usage.cacheRead ?? 0) || 0;
		cacheWrite += Number(usage.cacheWrite ?? 0) || 0;
		totalCost += extractCostTotal(usage);
	}
	return { input, output, cacheRead, cacheWrite, totalTokens: input + output + cacheRead + cacheWrite, totalCost };
}

// ═══════════════════════════════════════════════════════════════════════════
// Visual rendering helpers (welcome-overlay style)
// ═══════════════════════════════════════════════════════════════════════════

const GRADIENT_COLORS = [
	"\x1b[38;5;51m",   // cyan
	"\x1b[38;5;75m",   // light blue
	"\x1b[38;5;99m",   // purple
	"\x1b[38;5;135m",  // violet
	"\x1b[38;5;171m",  // magenta
	"\x1b[38;5;199m",  // hot pink
];

const GAUGE_GRADIENT = [
	"\x1b[38;5;46m",   // green
	"\x1b[38;5;82m",   // yellow-green
	"\x1b[38;5;226m",  // yellow
	"\x1b[38;5;214m",  // orange
	"\x1b[38;5;202m",  // red-orange
	"\x1b[38;5;196m",  // red
];

const RESET = "\x1b[0m";

function bold(text: string): string {
	return `\x1b[1m${text}\x1b[22m`;
}

function gradientText(line: string, colors: string[] = GRADIENT_COLORS): string {
	let result = "";
	let colorIdx = 0;
	const step = Math.max(1, Math.floor(line.length / colors.length));
	for (let i = 0; i < line.length; i++) {
		if (i > 0 && i % step === 0 && colorIdx < colors.length - 1) colorIdx++;
		if (line[i] !== " ") {
			result += colors[colorIdx] + line[i] + RESET;
		} else {
			result += line[i];
		}
	}
	return result;
}

function centerText(text: string, width: number): string {
	const visLen = visibleWidth(text);
	if (visLen >= width) return truncateToWidth(text, width);
	const leftPad = Math.floor((width - visLen) / 2);
	return " ".repeat(leftPad) + text + " ".repeat(width - visLen - leftPad);
}

function fitToWidth(str: string, width: number): string {
	const visLen = visibleWidth(str);
	if (visLen > width) return truncateToWidth(str, width);
	return str + " ".repeat(width - visLen);
}

function renderGaugeBar(percent: number, width: number): string {
	const filled = Math.round((percent / 100) * width);
	const empty = width - filled;

	let bar = "";
	for (let i = 0; i < filled; i++) {
		const colorIdx = Math.min(GAUGE_GRADIENT.length - 1, Math.floor((i / width) * GAUGE_GRADIENT.length));
		bar += GAUGE_GRADIENT[colorIdx] + "█" + RESET;
	}
	bar += "\x1b[38;5;238m" + "░".repeat(empty) + RESET;
	return bar;
}

function formatNumber(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return n.toLocaleString();
}

// ═══════════════════════════════════════════════════════════════════════════
// Ref-docs scanning (mirrors ref-docs.ts logic)
// ═══════════════════════════════════════════════════════════════════════════

interface RefDocSite {
	domain: string;
	pageCount: number;
	tokens: number;
	scope: "project" | "global";
}

function findRefDocIndexDirs(dir: string): string[] {
	const results: string[] = [];
	if (!existsSync(dir)) return results;
	if (existsSync(path.join(dir, "_index.md"))) results.push(dir);
	try {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (entry.isDirectory()) results.push(...findRefDocIndexDirs(path.join(dir, entry.name)));
		}
	} catch {}
	return results;
}

function countRefDocPages(content: string): number {
	const re = /^- \[([^\]]+)\]\(\.\/([^)]+)\)/gm;
	let count = 0;
	while (re.exec(content) !== null) count++;
	return count;
}

/** Estimate how many tokens the ref-docs extension injects into the system prompt for a given site */
function estimateRefDocInjectionTokens(indexContent: string, domain: string, loc: string): number {
	// The ref-docs extension builds: header + location + index path + per-page lines
	// We estimate by rebuilding roughly the same text
	let text = `### ${domain}\n`;
	text += `Location: ${loc}\nIndex: ${loc}_index.md\n\nPages:\n`;
	const re = /^- \[([^\]]+)\]\(\.\/([^)]+)\)(?:\s*-\s*(.*))?$/gm;
	let match;
	while ((match = re.exec(indexContent)) !== null) {
		const title = match[1];
		const file = match[2];
		text += `- ${file}: ${title}\n`;
	}
	return estimateTokens(text);
}

function scanRefDocSites(cwd: string): RefDocSite[] {
	const sites: RefDocSite[] = [];
	const scan = (baseDir: string, scope: "project" | "global") => {
		const refDocsDir = path.join(baseDir, ".ai", "ref-docs");
		for (const domainDir of findRefDocIndexDirs(refDocsDir)) {
			const indexPath = path.join(domainDir, "_index.md");
			try {
				const content = readFileSync(indexPath, "utf8");
				const relativePath = path.relative(refDocsDir, domainDir);
				const domain = relativePath;
				const loc = scope === "project"
					? `.ai/ref-docs/${domain}/`
					: `~/.pi/.ai/ref-docs/${domain}/`;
				const tokens = estimateRefDocInjectionTokens(content, domain, loc);
				const pageCount = countRefDocPages(content);
				sites.push({ domain, pageCount, tokens, scope });
			} catch {}
		}
	};
	scan(cwd, "project");
	scan(path.join(os.homedir(), ".pi"), "global");

	// Dedupe by domain (keep first = project wins)
	const seen = new Map<string, RefDocSite>();
	for (const s of sites) {
		if (!seen.has(s.domain)) seen.set(s.domain, s);
	}
	return Array.from(seen.values());
}

// ═══════════════════════════════════════════════════════════════════════════
// Gauge art (ASCII usage meter)
// ═══════════════════════════════════════════════════════════════════════════

const GAUGE_ART = [
	"  ╭─────────────╮  ",
	"  │  ◉ CONTEXT  │  ",
	"  ╰─────────────╯  ",
];

// ═══════════════════════════════════════════════════════════════════════════
// Data types
// ═══════════════════════════════════════════════════════════════════════════

type ContextData = {
	usage: {
		messageTokens: number;
		contextWindow: number;
		effectiveTokens: number;
		percent: number;
		remainingTokens: number;
		systemPromptTokens: number;
		agentTokens: number;
		toolsTokens: number;
		activeTools: number;
	} | null;
	agentFiles: { path: string; tokens: number }[];
	refDocs: RefDocSite[];
	refDocsTokens: number;
	extensions: string[];
	skills: string[];
	loadedSkills: string[];
	session: { input: number; output: number; cacheRead: number; totalTokens: number; totalCost: number };
	modelId: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// Two-column box renderer (matching welcome overlay style)
// ═══════════════════════════════════════════════════════════════════════════

function buildLeftColumn(data: ContextData, theme: any, colWidth: number): string[] {
	const muted = (s: string) => theme.fg("dim", s);
	const accent = (s: string) => theme.fg("accent", s);
	const lines: string[] = [];

	// Title
	lines.push("");
	lines.push(centerText(bold(accent("Context Window")), colWidth));
	lines.push("");

	// Gauge art with gradient
	for (const line of GAUGE_ART) {
		lines.push(centerText(gradientText(line), colWidth));
	}
	lines.push("");

	// Percent usage - big number
	if (data.usage) {
		const pct = data.usage.percent;
		let pctColor: string;
		if (pct < 50) pctColor = "\x1b[38;5;46m";        // green
		else if (pct < 75) pctColor = "\x1b[38;5;226m";   // yellow
		else if (pct < 90) pctColor = "\x1b[38;5;214m";   // orange
		else pctColor = "\x1b[38;5;196m";                  // red

		lines.push(centerText(`${pctColor}${bold(pct.toFixed(1) + "%")}${RESET} ${muted("used")}`, colWidth));
		lines.push(centerText(muted(`${formatNumber(data.usage.effectiveTokens)} / ${formatNumber(data.usage.contextWindow)}`), colWidth));
	} else {
		lines.push(centerText(muted("(unknown)"), colWidth));
	}

	lines.push("");

	// Model
	lines.push(centerText(theme.fg("accent", data.modelId || "unknown"), colWidth));

	return lines;
}

function buildRightColumn(data: ContextData, theme: any, colWidth: number): string[] {
	const muted = (s: string) => theme.fg("dim", s);
	const accent = (s: string) => theme.fg("accent", s);
	const success = (s: string) => theme.fg("success", s);
	const warning = (s: string) => theme.fg("warning", s);
	const text = (s: string) => theme.fg("text", s);
	const hChar = "─";
	const separator = ` ${muted(hChar.repeat(colWidth - 2))}`;

	const lines: string[] = [];

	// ── Usage breakdown ──
	lines.push(` ${bold(accent("Breakdown"))}`);
	if (data.usage) {
		const u = data.usage;

		// Gauge bar
		const barWidth = Math.max(10, Math.min(colWidth - 4, 32));
		lines.push(` ${renderGaugeBar(u.percent, barWidth)}`);
		lines.push("");

		// Category breakdown
		const sysPercent = u.contextWindow > 0 ? ((u.systemPromptTokens / u.contextWindow) * 100).toFixed(1) : "0";
		const toolsPercent = u.contextWindow > 0 ? ((u.toolsTokens / u.contextWindow) * 100).toFixed(1) : "0";
		const convoTokens = Math.max(0, u.messageTokens - u.systemPromptTokens);
		const convoPercent = u.contextWindow > 0 ? ((convoTokens / u.contextWindow) * 100).toFixed(1) : "0";
		const freePercent = (100 - u.percent).toFixed(1);

		const refDocsPercent = u.contextWindow > 0 ? ((data.refDocsTokens / u.contextWindow) * 100).toFixed(1) : "0";
		const totalPages = data.refDocs.reduce((a, s) => a + s.pageCount, 0);

		lines.push(` ${"\x1b[38;5;135m"}■${RESET} ${muted("System")}   ${text(formatNumber(u.systemPromptTokens))} ${muted(`(${sysPercent}%)`)}`);
		lines.push(` ${"\x1b[38;5;176m"}■${RESET} ${muted("Ref-docs")} ${text(formatNumber(data.refDocsTokens))} ${muted(`(${refDocsPercent}%)`)} ${muted(`· ${data.refDocs.length} sites`)}`);
		lines.push(` ${"\x1b[38;5;214m"}■${RESET} ${muted("Tools")}    ${text(formatNumber(u.toolsTokens))} ${muted(`(${toolsPercent}%)`)} ${muted(`· ${u.activeTools} active`)}`);
		lines.push(` ${"\x1b[38;5;75m"}■${RESET} ${muted("Convo")}    ${text(formatNumber(convoTokens))} ${muted(`(${convoPercent}%)`)}`);
		lines.push(` ${"\x1b[38;5;238m"}░${RESET} ${muted("Free")}     ${text(formatNumber(u.remainingTokens))} ${muted(`(${freePercent}%)`)}`);
	} else {
		lines.push(` ${muted("No usage data available")}`);
	}

	lines.push(separator);

	// ── Session totals ──
	lines.push(` ${bold(accent("Session"))}`);
	lines.push(` ${success("↓")} ${muted("In")}    ${text(formatNumber(data.session.input))}`);
	lines.push(` ${warning("↑")} ${muted("Out")}   ${text(formatNumber(data.session.output))}`);
	lines.push(` ${muted("⟳")} ${muted("Cache")} ${text(formatNumber(data.session.cacheRead))}`);
	lines.push(` ${muted("$")} ${muted("Cost")}  ${text(formatUsd(data.session.totalCost))}`);

	lines.push(separator);

	// ── Loaded ──
	lines.push(` ${bold(accent("Loaded"))}`);

	// AGENTS files
	if (data.agentFiles.length > 0) {
		for (const f of data.agentFiles.slice(0, 3)) {
			const label = truncateToWidth(f.path, colWidth - 8);
			lines.push(` ${success("✓")} ${label}`);
		}
		if (data.agentFiles.length > 3) {
			lines.push(`   ${muted(`+${data.agentFiles.length - 3} more`)}`);
		}
	} else {
		lines.push(` ${muted("  No context files")}`);
	}

	// Extensions count
	if (data.extensions.length > 0) {
		lines.push(` ${success("✓")} ${success(String(data.extensions.length))} extension${data.extensions.length !== 1 ? "s" : ""}`);
	}

	// Skills
	if (data.skills.length > 0) {
		const loadedSet = new Set(data.loadedSkills);
		const loadedCount = data.skills.filter((s) => loadedSet.has(s)).length;
		lines.push(` ${success("✓")} ${success(String(data.skills.length))} skill${data.skills.length !== 1 ? "s" : ""} ${muted(`(${loadedCount} loaded)`)}`);
	}

	// Ref-docs
	if (data.refDocs.length > 0) {
		const totalPages = data.refDocs.reduce((a, s) => a + s.pageCount, 0);
		lines.push(` ${success("✓")} ${success(String(data.refDocs.length))} ref-doc site${data.refDocs.length !== 1 ? "s" : ""} ${muted(`(${totalPages} pages, ~${formatNumber(data.refDocsTokens)} tok)`)}`);
	}

	lines.push("");

	return lines;
}

function renderContextBox(
	data: ContextData,
	theme: any,
	termWidth: number,
): string[] {
	const muted = (s: string) => theme.fg("dim", s);
	const accent = (s: string) => theme.fg("accent", s);
	const minLayoutWidth = 44;
	if (termWidth < minLayoutWidth) return [];

	const minWidth = 76;
	const maxWidth = 96;
	const boxWidth = Math.min(termWidth, Math.max(minWidth, Math.min(termWidth - 2, maxWidth)));
	const leftCol = 26;
	const rightCol = Math.max(1, boxWidth - leftCol - 3);

	const hChar = "─";
	const v = muted("│");
	const tl = muted("╭");
	const tr = muted("╮");
	const bl = muted("╰");
	const br = muted("╯");

	const leftLines = buildLeftColumn(data, theme, leftCol);
	const rightLines = buildRightColumn(data, theme, rightCol);

	const lines: string[] = [];

	// Top border with title
	const title = " Context Window ";
	const titlePrefix = muted(hChar.repeat(3));
	const titleStyled = titlePrefix + accent(title);
	const titleVisLen = 3 + visibleWidth(title);
	const afterTitle = boxWidth - 2 - titleVisLen;
	lines.push(tl + titleStyled + (afterTitle > 0 ? muted(hChar.repeat(afterTitle)) : "") + tr);

	// Content rows
	const maxRows = Math.max(leftLines.length, rightLines.length);
	for (let i = 0; i < maxRows; i++) {
		const left = fitToWidth(leftLines[i] ?? "", leftCol);
		const right = fitToWidth(rightLines[i] ?? "", rightCol);
		lines.push(v + left + v + right + v);
	}

	// Bottom border with hint
	const hint = " Esc/q/Enter to close ";
	const hintStyled = muted(hint);
	const hintVisLen = visibleWidth(hint);
	const bottomContentWidth = boxWidth - 2;
	const leftPad = Math.floor((bottomContentWidth - hintVisLen) / 2);
	const rightPad = bottomContentWidth - hintVisLen - leftPad;
	const bottomLine = muted(hChar.repeat(Math.max(0, leftPad))) + hintStyled + muted(hChar.repeat(Math.max(0, rightPad)));
	lines.push(bl + bottomLine + br);

	return lines;
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

class ContextWindowView implements Component {
	private theme: any;
	private onDone: () => void;
	private data: ContextData;
	private cachedWidth?: number;
	private cachedLines?: string[];

	constructor(theme: any, data: ContextData, onDone: () => void) {
		this.theme = theme;
		this.data = data;
		this.onDone = onDone;
	}

	handleInput(data: string): void {
		if (
			matchesKey(data, Key.escape) ||
			matchesKey(data, Key.ctrl("c")) ||
			data.toLowerCase() === "q" ||
			data === "\r"
		) {
			this.onDone();
		}
	}

	invalidate(): void {
		this.cachedWidth = undefined;
		this.cachedLines = undefined;
	}

	render(width: number): string[] {
		if (this.cachedLines && this.cachedWidth === width) return this.cachedLines;
		this.cachedLines = renderContextBox(this.data, this.theme, width);
		this.cachedWidth = width;
		return this.cachedLines;
	}
}

// ═══════════════════════════════════════════════════════════════════════════
// Extension entry point
// ═══════════════════════════════════════════════════════════════════════════

export default function contextWindowExtension(pi: ExtensionAPI) {
	let lastSessionId: string | null = null;
	let cachedLoadedSkills = new Set<string>();
	let cachedSkillIndex: SkillIndexEntry[] = [];

	const ensureCaches = (ctx: ExtensionContext) => {
		const sid = ctx.sessionManager.getSessionId();
		if (sid !== lastSessionId) {
			lastSessionId = sid;
			cachedLoadedSkills = getLoadedSkillsFromSession(ctx);
			cachedSkillIndex = buildSkillIndex(pi, ctx.cwd);
		}
		if (cachedSkillIndex.length === 0) {
			cachedSkillIndex = buildSkillIndex(pi, ctx.cwd);
		}
	};

	const matchSkillForPath = (absPath: string): string | null => {
		let best: SkillIndexEntry | null = null;
		for (const s of cachedSkillIndex) {
			if (!s.skillDir) continue;
			if (absPath === s.skillFilePath || absPath.startsWith(s.skillDir + path.sep)) {
				if (!best || s.skillDir.length > best.skillDir.length) best = s;
			}
		}
		return best?.name ?? null;
	};

	pi.on("tool_result", (event: ToolResultEvent, ctx: ExtensionContext) => {
		if ((event as any).toolName !== "read") return;
		if ((event as any).isError) return;
		const input = (event as any).input as { path?: unknown } | undefined;
		const p = typeof input?.path === "string" ? input.path : "";
		if (!p) return;
		ensureCaches(ctx);
		const abs = normalizeReadPath(p, ctx.cwd);
		const skillName = matchSkillForPath(abs);
		if (!skillName) return;
		if (!cachedLoadedSkills.has(skillName)) {
			cachedLoadedSkills.add(skillName);
			pi.appendEntry<SkillLoadedEntryData>(SKILL_LOADED_ENTRY, { name: skillName, path: abs });
		}
	});

	pi.registerCommand("context", {
		description: "Show context window usage (beautiful overlay)",
		handler: async (_args, ctx: ExtensionCommandContext) => {
			const commands = pi.getCommands();
			const extensionCmds = commands.filter((c) => c.source === "extension");
			const skillCmds = commands.filter((c) => c.source === "skill");

			const extensionsByPath = new Map<string, string[]>();
			for (const c of extensionCmds) {
				const p = c.path ?? "<unknown>";
				const arr = extensionsByPath.get(p) ?? [];
				arr.push(c.name);
				extensionsByPath.set(p, arr);
			}
			const extensionFiles = [...extensionsByPath.keys()]
				.map((p) => (p === "<unknown>" ? p : path.basename(p)))
				.sort((a, b) => a.localeCompare(b));

			const skills = skillCmds
				.map((c) => normalizeSkillName(c.name))
				.sort((a, b) => a.localeCompare(b));

			const agentFiles = await loadProjectContextFiles(ctx.cwd);
			const agentFilePaths = agentFiles.map((f) => ({ path: shortenPath(f.path, ctx.cwd), tokens: f.tokens }));
			const agentTokens = agentFiles.reduce((a, f) => a + f.tokens, 0);

			// Scan ref-docs (injected by ref-docs.ts extension into system prompt)
			const refDocs = scanRefDocSites(ctx.cwd);
			const refDocsTokens = refDocs.reduce((a, s) => a + s.tokens, 0);

			const systemPrompt = ctx.getSystemPrompt();
			const systemPromptTokens = systemPrompt ? estimateTokens(systemPrompt) : 0;

			const usage = ctx.getContextUsage();
			const messageTokens = usage?.tokens ?? 0;
			const ctxWindow = usage?.contextWindow ?? 0;

			const TOOL_FUDGE = 1.5;
			const activeToolNames = pi.getActiveTools();
			const toolInfoByName = new Map(pi.getAllTools().map((t) => [t.name, t] as const));
			let toolsTokens = 0;
			for (const name of activeToolNames) {
				const info = toolInfoByName.get(name);
				const blob = `${name}\n${info?.description ?? ""}`;
				toolsTokens += estimateTokens(blob);
			}
			toolsTokens = Math.round(toolsTokens * TOOL_FUDGE);

			const effectiveTokens = messageTokens + toolsTokens;
			const percent = ctxWindow > 0 ? (effectiveTokens / ctxWindow) * 100 : 0;
			const remainingTokens = ctxWindow > 0 ? Math.max(0, ctxWindow - effectiveTokens) : 0;

			const sessionUsage = sumSessionUsage(ctx);
			const loadedSkills = Array.from(getLoadedSkillsFromSession(ctx)).sort((a, b) => a.localeCompare(b));

			const modelId = ctx.model?.id ?? "unknown";

			const viewData: ContextData = {
				usage: usage
					? {
						messageTokens,
						contextWindow: ctxWindow,
						effectiveTokens,
						percent,
						remainingTokens,
						systemPromptTokens,
						agentTokens,
						toolsTokens,
						activeTools: activeToolNames.length,
					}
					: null,
				agentFiles: agentFilePaths,
				refDocs,
				refDocsTokens,
				extensions: extensionFiles,
				skills,
				loadedSkills,
				session: {
					input: sessionUsage.input,
					output: sessionUsage.output,
					cacheRead: sessionUsage.cacheRead,
					totalTokens: sessionUsage.totalTokens,
					totalCost: sessionUsage.totalCost,
				},
				modelId,
			};

			if (!ctx.hasUI) {
				// Fallback for non-TUI mode
				const lines: string[] = [];
				lines.push("Context Window");
				if (viewData.usage) {
					lines.push(`Window: ~${viewData.usage.effectiveTokens.toLocaleString()} / ${viewData.usage.contextWindow.toLocaleString()} (${viewData.usage.percent.toFixed(1)}% used)`);
					lines.push(`System: ~${viewData.usage.systemPromptTokens.toLocaleString()} tok`);
					lines.push(`Tools: ~${viewData.usage.toolsTokens.toLocaleString()} tok (${viewData.usage.activeTools} active)`);
				}
				lines.push(`Session: ${sessionUsage.totalTokens.toLocaleString()} tokens · ${formatUsd(sessionUsage.totalCost)}`);
				pi.sendMessage({ customType: "context-window", content: lines.join("\n"), display: true }, { triggerTurn: false });
				return;
			}

			await ctx.ui.custom<void>((tui, theme, _kb, done) => {
				return new ContextWindowView(theme, viewData, done);
			});
		},
	});
}
