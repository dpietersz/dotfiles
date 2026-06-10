#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadDotEnv } from "../extension/hub/env.ts";

const root = resolve(new URL("..", import.meta.url).pathname);
const localEnv = resolve(root, ".piwb.local.env");

loadDotEnv(resolve(root, ".env"));
loadDotEnv(localEnv);

type EnvMap = Record<string, string>;

function readLocalEnv(): EnvMap {
  const out: EnvMap = {};
  if (!existsSync(localEnv)) return out;
  for (const raw of readFileSync(localEnv, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    out[line.slice(0, eq)] = line.slice(eq + 1);
  }
  return out;
}

function writeLocalEnv(values: EnvMap): void {
  const existing = readLocalEnv();
  const merged = { ...existing, ...values };
  const body =
    "# Local Pi voice whiteboard runtime config. Generated; do not commit.\n" +
    Object.entries(merged)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n") +
    "\n";
  writeFileSync(localEnv, body, { mode: 0o600 });
}

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function gatewayToken(): string {
  const existing = env("PIWB_GATEWAY_TOKEN");
  if (existing) return existing;
  const token = execFileSync("openssl", ["rand", "-hex", "32"], { encoding: "utf8" }).trim();
  process.env.PIWB_GATEWAY_TOKEN = token;
  writeLocalEnv({ PIWB_GATEWAY_TOKEN: token });
  return token;
}

function run(cmd: string, args: string[]): string {
  return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function tailscaleUrl(port: number): string {
  run("tailscale", ["funnel", "--bg", "--yes", String(port)]);
  const status = JSON.parse(run("tailscale", ["status", "--json"])) as {
    Self?: { DNSName?: string; HostName?: string; Online?: boolean };
    BackendState?: string;
  };
  if (status.BackendState !== "Running" || !status.Self?.Online) {
    throw new Error("Tailscale is not running/online");
  }
  const dns = status.Self.DNSName?.replace(/\.$/, "");
  if (!dns) throw new Error("Could not determine Tailscale DNSName");
  return `https://${dns}`;
}

async function main(): Promise<void> {
  const port = Number.parseInt(env("PIWB_PORT") || "8848", 10);
  if (!Number.isFinite(port)) throw new Error("PIWB_PORT must be a number");

  let publicUrl = env("PIWB_PUBLIC_URL").replace(/\/+$/, "");
  const tunnel = env("PIWB_TUNNEL") || process.argv.find((a) => a.startsWith("--tunnel="))?.split("=")[1] || "";
  if (!publicUrl) {
    if (tunnel !== "tailscale") {
      throw new Error("Set PIWB_PUBLIC_URL, or run with PIWB_TUNNEL=tailscale / --tunnel=tailscale");
    }
    publicUrl = tailscaleUrl(port);
    process.env.PIWB_PUBLIC_URL = publicUrl;
  }

  const token = gatewayToken();
  writeLocalEnv({
    PIWB_GATEWAY_TOKEN: token,
    PIWB_PUBLIC_URL: publicUrl,
    PIWB_GATEWAY_ALLOWED_HOSTS: new URL(publicUrl).host,
  });

  console.log(`Public Pi whiteboard URL: ${publicUrl}`);
  console.log("Gateway token stored in .piwb.local.env (not printed).");
  console.log("Creating/updating ElevenLabs agent...");
  const output = run("bun", ["run", "setup:elevenlabs-agent"]);
  const match = output.match(/ELEVENLABS_AGENT_ID=(agent_[A-Za-z0-9_-]+)/);
  if (match?.[1]) {
    writeLocalEnv({ ELEVENLABS_AGENT_ID: match[1] });
  }
  console.log(output);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
