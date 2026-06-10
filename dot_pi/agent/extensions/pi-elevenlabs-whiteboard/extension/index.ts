import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { mkdirSync } from "node:fs";
import { loadConfig } from "./hub/config.ts";
import { loadDotEnv } from "./hub/env.ts";
import { Hub } from "./hub/server.ts";
import { PiExtensionBridge } from "./hub/pi-bridge.ts";
import { SdkPiBridge } from "./hub/sdk-bridge.ts";
import { registerWhiteboardTools } from "./tools/whiteboard-tools.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");

export default function (pi: ExtensionAPI): void {
  loadDotEnv(join(REPO_ROOT, ".env"));
  loadDotEnv(join(REPO_ROOT, ".piwb.local.env"));

  const dataDir = process.env.PIWB_DATA_DIR || join(homedir(), ".pi", "piwb");
  const webDir = process.env.PIWB_WEB_DIR || join(REPO_ROOT, "web", "dist");
  mkdirSync(dataDir, { recursive: true });

  const config = loadConfig({ dataDir, webDir, bridge: "pi" });
  const bridge = process.env.PIWB_REASONING_MODE === "interactive" ? new PiExtensionBridge(pi) : new SdkPiBridge();
  const hub = new Hub({ config, bridge });
  if (bridge instanceof SdkPiBridge) bridge.setHub(hub);

  let hubUrl = `http://${config.host}:${config.port}`;
  let started = false;

  hub
    .start()
    .then(({ url }) => {
      hubUrl = url;
      started = true;
      hub.log.info("whiteboard dashboard ready", { url });
    })
    .catch((err) => {
      hub.log.error("failed to start whiteboard hub", { err: String(err) });
    });

  registerWhiteboardTools(pi, hub);

  pi.registerCommand("whiteboard", {
    description: "Open the Pi × ElevenLabs voice whiteboard dashboard",
    async handler(_args, ctx) {
      if (!started) {
        ctx.ui.notify(
          `Whiteboard hub is not running (check ${join(dataDir, "hub.log")}). Port ${config.port} may be in use.`,
          "error",
        );
        return;
      }
      ctx.ui.notify(`Whiteboard dashboard: ${hubUrl}`, "info");
      openBrowser(hubUrl);
    },
  });

  pi.registerCommand("whiteboard-url", {
    description: "Print the whiteboard dashboard URL",
    async handler(_args, ctx) {
      ctx.ui.notify(hubUrl, "info");
    },
  });

  pi.on("session_shutdown", async () => {
    await hub.stop().catch(() => undefined);
  });
}

function openBrowser(url: string): void {
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
  execFile(cmd, [url], () => {
    /* best effort */
  });
}
