/**
 * Standalone hub entry point. Runs the hub HTTP/WS server without a live Pi
 * process, using the scripted MockBridge by default. Used for tests, Playwright
 * dashboard verification, and offline frontend development.
 *
 *   PIWB_BRIDGE=mock bun extension/hub/standalone.ts
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { loadConfig } from "./config.ts";
import { MockBridge } from "./bridge.ts";
import { Hub } from "./server.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

async function main(): Promise<void> {
  const dataDir = process.env.PIWB_DATA_DIR || join(repoRoot, ".pi-data");
  const webDir = process.env.PIWB_WEB_DIR || join(repoRoot, "web", "dist");
  mkdirSync(dataDir, { recursive: true });

  const config = loadConfig({ dataDir, webDir, bridge: "mock" });
  const bridge = new MockBridge();
  const hub = new Hub({ config, bridge });
  const { url } = await hub.start();
  // eslint-disable-next-line no-console
  console.log(`[piwb] standalone hub on ${url} (bridge=${config.bridge}, web=${webDir})`);

  const shutdown = async () => {
    await hub.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[piwb] failed to start:", err);
  process.exit(1);
});
