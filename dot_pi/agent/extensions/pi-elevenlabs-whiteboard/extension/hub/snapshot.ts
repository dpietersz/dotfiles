import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { WhiteboardContextPacket } from "../../shared/protocol.ts";
import type { Hub } from "./server.ts";

export type SnapshotScope = "selected" | "viewport" | "all";

export interface SnapshotResult {
  available: boolean;
  /** Absolute path of the saved PNG, if written. */
  path?: string;
  /** data URL (data:image/png;base64,...) when captured. */
  dataUrl?: string;
  reason?: string;
  /** Which mechanism produced it. */
  via?: "dashboard" | "playwright" | "none";
  error?: string;
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; ext: string } | null {
  const m = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!m) return null;
  const ext = m[1] === "image/jpeg" ? "jpg" : "png";
  return { buffer: Buffer.from(m[2]!, "base64"), ext };
}

/**
 * Render the whiteboard to a PNG. Fallback ladder:
 *  1. Ask a connected dashboard to export the live Excalidraw canvas (exact).
 *  2. Playwright headless render of the /render route (when no dashboard / CI).
 *  3. Give up with a clear, actionable reason.
 */
export async function renderSnapshot(
  hub: Hub,
  args: { sessionId: string; scope: SnapshotScope; reason?: string },
): Promise<SnapshotResult> {
  const reason = args.reason ?? "layout_or_ambiguous_scene";

  // 1. Connected dashboard export.
  if (hub.connectedClients > 0) {
    try {
      const dataUrl = await hub.requestExport(args.sessionId, args.scope);
      return persist(hub, args.sessionId, dataUrl, reason, "dashboard");
    } catch (err) {
      hub.log.debug("dashboard export failed, trying playwright", { err: String(err) });
    }
  }

  // 2. Playwright headless render.
  try {
    const dataUrl = await playwrightRender(hub, args.sessionId, args.scope);
    if (dataUrl) return persist(hub, args.sessionId, dataUrl, reason, "playwright");
  } catch (err) {
    hub.log.debug("playwright render unavailable", { err: String(err) });
  }

  return {
    available: false,
    reason,
    via: "none",
    error:
      "No snapshot mechanism available. Open the dashboard to render the live canvas, or install the optional `playwright` dependency for headless rendering.",
  };
}

function persist(
  hub: Hub,
  sessionId: string,
  dataUrl: string,
  reason: string,
  via: "dashboard" | "playwright",
): SnapshotResult {
  const decoded = dataUrlToBuffer(dataUrl);
  const revision = hub.store.getRevisionId(sessionId);
  if (!decoded) {
    return { available: true, dataUrl, reason, via };
  }
  const dir = hub.store.snapshotsDir(sessionId);
  const path = join(dir, `${revision}.${decoded.ext}`);
  try {
    writeFileSync(path, decoded.buffer);
  } catch (err) {
    hub.log.warn("snapshot persist failed", { err: String(err) });
    return { available: true, dataUrl, reason, via };
  }
  return { available: true, path, dataUrl, reason, via };
}

/**
 * Headless render via the optional `playwright` package. Navigates to the SPA
 * /render route which auto-loads the scene and exposes window.__piwbExportPNG().
 */
async function playwrightRender(hub: Hub, sessionId: string, scope: SnapshotScope): Promise<string | null> {
  let chromium: typeof import("playwright").chromium;
  try {
    ({ chromium } = (await import("playwright")) as typeof import("playwright"));
  } catch {
    return null; // optional dependency not installed
  }
  const base = `http://${hub.config.host}:${hub.config.port}`;
  const target = `${base}/render?session=${encodeURIComponent(sessionId)}&scope=${scope}`;
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(target, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForFunction("typeof window.__piwbExportPNG === 'function'", undefined, {
      timeout: 10000,
    });
    const dataUrl = (await page.evaluate("window.__piwbExportPNG()")) as string;
    return typeof dataUrl === "string" && dataUrl.startsWith("data:image/") ? dataUrl : null;
  } finally {
    await browser.close();
  }
}

/** Attach a freshly rendered snapshot to a context packet (best effort). */
export async function withSnapshot(
  hub: Hub,
  sessionId: string,
  scope: SnapshotScope,
  reason: string,
): Promise<WhiteboardContextPacket["snapshot"]> {
  const result = await renderSnapshot(hub, { sessionId, scope, reason });
  if (!result.available) return { available: false, reason };
  return {
    available: true,
    ...(result.path ? { path: result.path } : {}),
    ...(result.dataUrl ? { dataUrl: result.dataUrl } : {}),
    reason,
  };
}
