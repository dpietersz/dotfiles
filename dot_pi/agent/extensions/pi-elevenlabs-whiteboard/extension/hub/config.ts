/** Hub configuration resolved from environment variables. */

export interface HubConfig {
  host: string;
  port: number;
  /** Bearer token required by the public Custom LLM gateway. */
  gatewayToken: string;
  /** Allowed Host header values for the gateway (empty = allow any, dev only). */
  gatewayAllowedHosts: string[];
  /** Per-IP Custom LLM requests per minute (0 disables; useful behind public tunnels). */
  gatewayRateLimitPerMinute: number;
  elevenLabs: {
    apiKey: string;
    agentId: string;
    authMode: "signed_url" | "public";
    /** ConvAI agent voice (must be a library voice). */
    voiceId: string;
    /** Voice used by the hub TTS proxy (the Scribe speak path). Defaults to the
     * architecture doc voice; may be any voice usable for raw TTS synthesis. */
    ttsVoiceId: string;
    /** TTS model for the hub TTS proxy. */
    ttsModelId: string;
  };
  /** Which bridge the standalone hub uses: real pi or scripted mock. */
  bridge: "pi" | "mock";
  /** Directory where whiteboard scenes/snapshots/logs are persisted. */
  dataDir: string;
  /** Absolute path to built web assets (web/dist). */
  webDir: string;
}

function envStr(name: string, fallback = ""): string {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

function envInt(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function loadConfig(overrides: Partial<HubConfig> = {}): HubConfig {
  const authModeRaw = envStr("ELEVENLABS_AUTH_MODE", "signed_url");
  const authMode = authModeRaw === "public" ? "public" : "signed_url";
  const bridgeRaw = envStr("PIWB_BRIDGE", "pi");
  const bridge = bridgeRaw === "mock" ? "mock" : "pi";

  return {
    host: envStr("PIWB_HOST", "127.0.0.1"),
    port: envInt("PIWB_PORT", 8848),
    gatewayToken: envStr("PIWB_GATEWAY_TOKEN"),
    gatewayAllowedHosts: envStr("PIWB_GATEWAY_ALLOWED_HOSTS")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    gatewayRateLimitPerMinute: envInt("PIWB_GATEWAY_RATE_LIMIT_PER_MINUTE", 30),
    elevenLabs: {
      apiKey: envStr("ELEVENLABS_API_KEY"),
      agentId: envStr("ELEVENLABS_AGENT_ID"),
      authMode,
      voiceId: envStr("ELEVENLABS_VOICE_ID", "cjVigY5qzO86Huf0OWal"),
      ttsVoiceId: envStr("PIWB_TTS_VOICE_ID", "pq3wL6Xv3fuEM14W6ZCg"),
      ttsModelId: envStr("PIWB_TTS_MODEL_ID", "eleven_flash_v2"),
    },
    bridge,
    dataDir: envStr("PIWB_DATA_DIR", ""),
    webDir: envStr("PIWB_WEB_DIR", ""),
    ...overrides,
  };
}

/** Values that must never be logged or sent to the browser. */
export function secretValues(cfg: HubConfig): string[] {
  return [cfg.gatewayToken, cfg.elevenLabs.apiKey].filter((s) => s.length > 0);
}
