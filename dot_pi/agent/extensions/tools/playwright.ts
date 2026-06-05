/**
 * playwright - Compact browser automation for frontend verification
 *
 * Uses the managed Playwright distrobox on Linux/Bluefin and a host Playwright
 * install on macOS. Returns compact summaries and artifact paths instead of
 * dumping large DOM/MCP context into the model.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Text } from "@mariozechner/pi-tui";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir, homedir, platform } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESCRIPTION = readFileSync(join(__dirname, "playwright.txt"), "utf8").trim();

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_TIMEOUT_MS = 120_000;
const MAX_TEXT_CHARS = 2_000;
const MAX_ELEMENTS = 40;
const MAX_LOGS = 20;

const ViewportPreset = ["desktop", "tablet", "mobile", "mobile-landscape", "custom"] as const;
const BrowserName = ["chromium", "firefox", "webkit"] as const;
const ColorScheme = ["light", "dark", "no-preference"] as const;
const ReducedMotion = ["reduce", "no-preference"] as const;
const MediaType = ["screen", "print"] as const;
const ActionType = [
  "goto", "click", "fill", "select", "check", "uncheck", "press", "waitForSelector",
  "waitForText", "assertText", "screenshot",
] as const;

const StepSchema = Type.Object({
  type: StringEnum(ActionType, { description: "Action to execute" }),
  url: Type.Optional(Type.String({ description: "URL for goto" })),
  selector: Type.Optional(Type.String({ description: "CSS/text selector for click/fill/select/check/wait" })),
  text: Type.Optional(Type.String({ description: "Text/value for fill, select, press, waitForText, assertText" })),
  timeoutMs: Type.Optional(Type.Number({ description: "Step timeout in milliseconds" })),
  screenshotName: Type.Optional(Type.String({ description: "Optional screenshot filename stem for screenshot step" })),
});

const ParameterSchema = Type.Object({
  action: StringEnum(["inspect", "screenshot", "run"] as const, {
    description: "inspect page state, capture screenshot, or run action flow",
  }),
  url: Type.Optional(Type.String({ description: "URL to visit for inspect/screenshot or initial URL for run" })),
  browser: Type.Optional(StringEnum(BrowserName, { description: "Browser engine: chromium, firefox, or webkit. Default chromium." })),
  device: Type.Optional(Type.String({ description: "Playwright device profile name, e.g. iPhone 13, Pixel 5, iPad Pro 11, Desktop Chrome. Overrides viewport/userAgent/touch defaults." })),
  viewport: Type.Optional(StringEnum(ViewportPreset, { description: "Viewport preset. Default desktop. Ignored by device unless explicitly set to override device viewport." })),
  width: Type.Optional(Type.Number({ description: "Custom viewport width when viewport=custom, or viewport override when device is set" })),
  height: Type.Optional(Type.Number({ description: "Custom viewport height when viewport=custom, or viewport override when device is set" })),
  deviceScaleFactor: Type.Optional(Type.Number({ description: "Device scale factor / DPR override" })),
  isMobile: Type.Optional(Type.Boolean({ description: "Whether meta viewport is honored. Usually provided by device." })),
  hasTouch: Type.Optional(Type.Boolean({ description: "Enable touch event support. Usually provided by device." })),
  fullPage: Type.Optional(Type.Boolean({ description: "Capture full page screenshots. Default false." })),
  waitForSelector: Type.Optional(Type.String({ description: "Wait for selector before inspection/screenshot" })),
  waitForText: Type.Optional(Type.String({ description: "Wait until visible body text contains this string" })),
  waitMs: Type.Optional(Type.Number({ description: "Extra wait in milliseconds before collecting result" })),
  colorScheme: Type.Optional(StringEnum(ColorScheme, { description: "Emulate prefers-color-scheme: light, dark, or no-preference" })),
  reducedMotion: Type.Optional(StringEnum(ReducedMotion, { description: "Emulate prefers-reduced-motion: reduce or no-preference" })),
  media: Type.Optional(StringEnum(MediaType, { description: "Emulate CSS media: screen or print" })),
  locale: Type.Optional(Type.String({ description: "Browser locale, e.g. en-GB or nl-NL" })),
  timezoneId: Type.Optional(Type.String({ description: "Browser timezone, e.g. Europe/Amsterdam" })),
  javaScriptEnabled: Type.Optional(Type.Boolean({ description: "Enable JavaScript. Default true." })),
  offline: Type.Optional(Type.Boolean({ description: "Emulate network offline. Default false." })),
  timeoutSec: Type.Optional(Type.Number({ description: "Overall timeout seconds, max 120, default 30" })),
  steps: Type.Optional(Type.Array(StepSchema, { description: "Action steps for action=run" })),
  screenshot: Type.Optional(Type.Boolean({ description: "For inspect/run, also save final screenshot" })),
});

type PlaywrightParams = Static<typeof ParameterSchema>;

type RunnerResult = {
  ok: boolean;
  action: string;
  url?: string;
  finalUrl?: string;
  title?: string;
  browser?: string;
  device?: string;
  viewport?: { width: number; height: number };
  emulation?: Record<string, unknown>;
  screenshotPath?: string;
  summary?: any;
  steps?: Array<{ index: number; type: string; ok: boolean; note?: string; error?: string }>;
  logs?: { console: string[]; pageErrors: string[]; requestFailures: string[] };
  error?: string;
};

function artifactDir(): string {
  const dir = join(homedir(), ".cache", "pi-playwright");
  mkdirSync(dir, { recursive: true });
  return dir;
}

function writeRunner(): string {
  const runnerPath = join(artifactDir(), "runner.cjs");
  writeFileSync(runnerPath, RUNNER_JS, "utf8");
  return runnerPath;
}

function writeInput(params: PlaywrightParams, cwd: string): string {
  const inputPath = join(artifactDir(), `input-${Date.now()}.json`);
  writeFileSync(inputPath, JSON.stringify({ params, cwd, artifactDir: artifactDir() }), "utf8");
  return inputPath;
}

function clampTimeout(params: PlaywrightParams): number {
  const requested = Math.round((params.timeoutSec ?? DEFAULT_TIMEOUT_MS / 1000) * 1000);
  return Math.max(1_000, Math.min(requested, MAX_TIMEOUT_MS));
}

function execFilePromise(command: string, args: string[], timeout: number): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolvePromise) => {
    execFile(command, args, { timeout, maxBuffer: 1024 * 1024 * 4 }, (error: any, stdout, stderr) => {
      resolvePromise({ stdout: String(stdout ?? ""), stderr: String(stderr ?? ""), code: error?.code ?? null });
    });
  });
}

async function runPlaywright(params: PlaywrightParams, cwd: string): Promise<{ result?: RunnerResult; raw?: string; stderr?: string; error?: string }> {
  const runnerPath = writeRunner();
  const inputPath = writeInput(params, cwd);
  const timeout = clampTimeout(params) + 5_000;

  let command: string;
  let args: string[];

  if (platform() === "linux") {
    command = "distrobox";
    const script = `NODE_PATH=$(npm root -g) node ${JSON.stringify(runnerPath)} ${JSON.stringify(inputPath)}`;
    args = ["enter", "playwright", "--no-tty", "--", "bash", "-lc", script];
  } else {
    command = "node";
    args = [runnerPath, inputPath];
  }

  const { stdout, stderr, code } = await execFilePromise(command, args, timeout);
  const trimmed = stdout.trim();
  const lastJsonLine = trimmed.split(/\r?\n/).reverse().find((line) => line.trim().startsWith("{"));
  if (!lastJsonLine) {
    return { stderr, raw: stdout, error: `Playwright runner produced no JSON (exit ${code ?? "unknown"})` };
  }
  try {
    return { result: JSON.parse(lastJsonLine), stderr };
  } catch (e: any) {
    return { stderr, raw: stdout, error: `Failed to parse runner JSON: ${e?.message ?? String(e)}` };
  }
}

function formatResult(r: RunnerResult): string {
  const lines: string[] = [];
  lines.push(`# Playwright ${r.action}: ${r.ok ? "PASS" : "FAIL"}`);
  if (r.title) lines.push(`Title: ${r.title}`);
  if (r.finalUrl || r.url) lines.push(`URL: ${r.finalUrl ?? r.url}`);
  if (r.browser) lines.push(`Browser: ${r.browser}`);
  if (r.device) lines.push(`Device: ${r.device}`);
  if (r.viewport) lines.push(`Viewport: ${r.viewport.width}x${r.viewport.height}`);
  if (r.emulation && Object.keys(r.emulation).length) lines.push(`Emulation: ${Object.entries(r.emulation).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  if (r.screenshotPath) lines.push(`Screenshot: ${r.screenshotPath}`);
  if (r.error) lines.push(`Error: ${r.error}`);

  if (r.steps?.length) {
    lines.push("\n## Steps");
    for (const s of r.steps) lines.push(`- ${s.ok ? "✓" : "✗"} ${s.index}. ${s.type}${s.note ? ` — ${s.note}` : ""}${s.error ? ` — ${s.error}` : ""}`);
  }

  if (r.summary) {
    lines.push("\n## Page Summary");
    if (r.summary.headings?.length) lines.push(`Headings: ${r.summary.headings.slice(0, 12).join(" | ")}`);
    if (r.summary.controls?.length) {
      lines.push("Controls:");
      for (const c of r.summary.controls.slice(0, MAX_ELEMENTS)) lines.push(`- ${c}`);
    }
    if (r.summary.textExcerpt) lines.push(`Text excerpt: ${r.summary.textExcerpt}`);
  }

  const logs = r.logs;
  if (logs) {
    const problems = [...(logs.pageErrors ?? []), ...(logs.requestFailures ?? [])];
    if (problems.length) {
      lines.push("\n## Problems");
      for (const p of problems.slice(0, MAX_LOGS)) lines.push(`- ${p}`);
    }
    if (logs.console?.length) {
      lines.push("\n## Console");
      for (const c of logs.console.slice(0, MAX_LOGS)) lines.push(`- ${c}`);
    }
  }
  return lines.join("\n");
}

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "playwright",
    label: "Playwright",
    description: DESCRIPTION,
    parameters: ParameterSchema,

    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      if ((params.action === "inspect" || params.action === "screenshot") && !params.url) {
        return { content: [{ type: "text", text: "Error: url is required for inspect/screenshot" }], details: { error: true }, isError: true };
      }
      if (params.action === "run" && !params.url && (!params.steps || params.steps.length === 0)) {
        return { content: [{ type: "text", text: "Error: url or steps are required for run" }], details: { error: true }, isError: true };
      }

      const out = await runPlaywright(params, ctx.cwd);
      if (!out.result) {
        const msg = `${out.error ?? "Playwright failed"}\n${out.stderr ? `stderr:\n${out.stderr}` : ""}\n${out.raw ? `stdout:\n${out.raw.slice(0, 4000)}` : ""}`.trim();
        return { content: [{ type: "text", text: msg }], details: { error: true }, isError: true };
      }

      return {
        content: [{ type: "text", text: formatResult(out.result) }],
        details: out.result,
        isError: !out.result.ok,
      };
    },

    renderCall(args, theme) {
      const url = args.url ? ` ${args.url}` : "";
      return new Text(theme.fg("toolTitle", theme.bold("playwright ")) + theme.fg("muted", `${args.action}${url}`), 0, 0);
    },

    renderResult(result, _opts, theme) {
      const d = result.details as RunnerResult | undefined;
      if (!d) return new Text(theme.fg("muted", "Playwright result"), 0, 0);
      const status = d.ok ? theme.fg("success", "✓") : theme.fg("error", "✗");
      const shot = d.screenshotPath ? theme.fg("muted", ` screenshot: ${d.screenshotPath}`) : "";
      return new Text(`${status} ${theme.fg("toolTitle", `Playwright ${d.action}`)}${shot}`, 0, 0);
    },
  });
}

const RUNNER_JS = String.raw`
const fs = require('fs');
const path = require('path');
const playwright = require('playwright');
const { devices } = playwright;

const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const { params, artifactDir } = input;
const maxTextChars = ${MAX_TEXT_CHARS};
const maxElements = ${MAX_ELEMENTS};
const maxLogs = ${MAX_LOGS};

function viewportFor(p) {
  const preset = p.viewport || 'desktop';
  if (preset === 'mobile') return { width: 390, height: 844 };
  if (preset === 'mobile-landscape') return { width: 844, height: 390 };
  if (preset === 'tablet') return { width: 768, height: 1024 };
  if (preset === 'custom') return { width: p.width || 1280, height: p.height || 720 };
  return { width: 1440, height: 900 };
}
function contextOptionsFor(p) {
  const opts = {};
  if (p.device) {
    if (!devices[p.device]) {
      const close = Object.keys(devices).filter((d) => d.toLowerCase().includes(String(p.device).toLowerCase())).slice(0, 12);
      throw new Error('Unknown Playwright device: ' + p.device + (close.length ? '. Close matches: ' + close.join(', ') : ''));
    }
    Object.assign(opts, devices[p.device]);
  }
  if (!p.device || p.viewport || p.width || p.height) opts.viewport = viewportFor(p);
  if (p.deviceScaleFactor !== undefined) opts.deviceScaleFactor = p.deviceScaleFactor;
  if (p.isMobile !== undefined) opts.isMobile = p.isMobile;
  if (p.hasTouch !== undefined) opts.hasTouch = p.hasTouch;
  if (p.colorScheme) opts.colorScheme = p.colorScheme;
  if (p.reducedMotion) opts.reducedMotion = p.reducedMotion;
  if (p.locale) opts.locale = p.locale;
  if (p.timezoneId) opts.timezoneId = p.timezoneId;
  if (p.javaScriptEnabled !== undefined) opts.javaScriptEnabled = p.javaScriptEnabled;
  if (p.offline !== undefined) opts.offline = p.offline;
  opts.ignoreHTTPSErrors = true;
  return opts;
}
function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
function screenshotPath(name) {
  const safe = clean(name || 'screenshot').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'screenshot';
  return path.join(artifactDir, safe + '-' + Date.now() + '.png');
}
async function waitOptions(page, p) {
  const timeout = Math.min((p.timeoutSec || 30) * 1000, ${MAX_TIMEOUT_MS});
  if (p.waitForSelector) await page.waitForSelector(p.waitForSelector, { timeout });
  if (p.waitForText) await page.waitForFunction((text) => document.body?.innerText?.includes(text), p.waitForText, { timeout });
  if (p.waitMs) await page.waitForTimeout(Math.min(p.waitMs, 10000));
}
async function collectSummary(page) {
  return await page.evaluate(({ maxTextChars, maxElements }) => {
    const isVisible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
    };
    const textOf = (el) => (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim();
    const headings = Array.from(document.querySelectorAll('h1,h2,h3')).filter(isVisible).map(textOf).filter(Boolean).slice(0, 20);
    const controls = Array.from(document.querySelectorAll('a,button,input,textarea,select,[role="button"],[role="link"]'))
      .filter(isVisible).slice(0, maxElements).map((el) => {
        const tag = el.tagName.toLowerCase();
        const label = textOf(el) || el.getAttribute('name') || el.getAttribute('id') || el.getAttribute('href') || '';
        const type = el.getAttribute('type') || el.getAttribute('role') || '';
        return (tag + (type ? ':' + type : '') + ' ' + label).trim();
      });
    const forms = document.querySelectorAll('form').length;
    const textExcerpt = (document.body?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, maxTextChars);
    return { headings, controls, forms, textExcerpt };
  }, { maxTextChars, maxElements });
}
async function performStep(page, step, index) {
  const timeout = step.timeoutMs || 10000;
  try {
    switch (step.type) {
      case 'goto': await page.goto(step.url, { waitUntil: 'domcontentloaded', timeout }); return { index, type: step.type, ok: true, note: step.url };
      case 'click': await page.locator(step.selector).first().click({ timeout }); return { index, type: step.type, ok: true, note: step.selector };
      case 'fill': await page.locator(step.selector).first().fill(step.text || '', { timeout }); return { index, type: step.type, ok: true, note: step.selector };
      case 'select': await page.locator(step.selector).first().selectOption(step.text || '', { timeout }); return { index, type: step.type, ok: true, note: step.selector };
      case 'check': await page.locator(step.selector).first().check({ timeout }); return { index, type: step.type, ok: true, note: step.selector };
      case 'uncheck': await page.locator(step.selector).first().uncheck({ timeout }); return { index, type: step.type, ok: true, note: step.selector };
      case 'press': await page.keyboard.press(step.text || 'Enter'); return { index, type: step.type, ok: true, note: step.text || 'Enter' };
      case 'waitForSelector': await page.waitForSelector(step.selector, { timeout }); return { index, type: step.type, ok: true, note: step.selector };
      case 'waitForText': await page.waitForFunction((text) => document.body?.innerText?.includes(text), step.text || '', { timeout }); return { index, type: step.type, ok: true, note: step.text };
      case 'assertText': {
        const body = await page.locator('body').innerText({ timeout });
        const ok = body.includes(step.text || '');
        return { index, type: step.type, ok, note: step.text, error: ok ? undefined : 'text not found' };
      }
      case 'screenshot': {
        const p = screenshotPath(step.screenshotName || ('step-' + index));
        await page.screenshot({ path: p, fullPage: !!params.fullPage });
        return { index, type: step.type, ok: true, note: p };
      }
      default: return { index, type: step.type, ok: false, error: 'unknown action' };
    }
  } catch (e) {
    return { index, type: step.type, ok: false, error: e.message || String(e) };
  }
}
(async () => {
  const contextOptions = contextOptionsFor(params);
  const viewport = contextOptions.viewport || null;
  const browserName = params.browser || 'chromium';
  const browserType = playwright[browserName];
  if (!browserType) throw new Error('Unknown browser: ' + browserName);
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const logs = { console: [], pageErrors: [], requestFailures: [] };
  page.on('console', (m) => { if (['error','warning'].includes(m.type()) && logs.console.length < maxLogs) logs.console.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => { if (logs.pageErrors.length < maxLogs) logs.pageErrors.push(e.message || String(e)); });
  page.on('requestfailed', (r) => { if (logs.requestFailures.length < maxLogs) logs.requestFailures.push(r.method() + ' ' + r.url() + ' — ' + ((r.failure() && r.failure().errorText) || 'failed')); });

  const emulation = {};
  for (const k of ['colorScheme','reducedMotion','media','locale','timezoneId','deviceScaleFactor','isMobile','hasTouch','javaScriptEnabled','offline']) if (params[k] !== undefined) emulation[k] = params[k];
  const result = { ok: true, action: params.action, url: params.url, browser: browserName, device: params.device, viewport, emulation, logs };
  try {
    if (params.url) await page.goto(params.url, { waitUntil: 'domcontentloaded', timeout: Math.min((params.timeoutSec || 30) * 1000, ${MAX_TIMEOUT_MS}) });
    if (params.media) await page.emulateMedia({ media: params.media });
    await waitOptions(page, params);

    if (params.action === 'run') {
      result.steps = [];
      for (let i = 0; i < (params.steps || []).length; i++) {
        const stepResult = await performStep(page, params.steps[i], i + 1);
        result.steps.push(stepResult);
        if (!stepResult.ok) result.ok = false;
      }
    }

    result.title = await page.title();
    result.finalUrl = page.url();
    result.summary = await collectSummary(page);

    if (params.action === 'screenshot' || params.screenshot) {
      result.screenshotPath = screenshotPath(params.action);
      await page.screenshot({ path: result.screenshotPath, fullPage: !!params.fullPage });
    }
  } catch (e) {
    result.ok = false;
    result.error = e.message || String(e);
  } finally {
    await browser.close().catch(() => {});
  }
  console.log(JSON.stringify(result));
})().catch((e) => {
  console.log(JSON.stringify({ ok: false, action: params.action, error: e.message || String(e) }));
});
`;
