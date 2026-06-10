#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { loadDotEnv } from "../extension/hub/env.ts";

loadDotEnv(new URL("../.env", import.meta.url).pathname);
loadDotEnv(new URL("../.piwb.local.env", import.meta.url).pathname);

type AgentResponse = { agent_id?: string; detail?: unknown; error?: unknown };

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function elevenLabsApiKey(): string {
  const value = process.env.ELEVENLABS_API_KEY?.trim();
  if (value) return value;
  try {
    return execFileSync("pass", ["show", "Sites/elevenlabs.com/api-key/pi"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    throw new Error("ELEVENLABS_API_KEY is required (or pass entry Sites/elevenlabs.com/api-key/pi must exist)");
  }
}

function gatewayUrl(): string {
  const explicit = process.env.PIWB_CUSTOM_LLM_URL?.trim();
  if (explicit) return explicit;
  const base = requiredEnv("PIWB_PUBLIC_URL").replace(/\/+$/, "");
  return `${base}/v1/chat/completions`;
}

function agentPayload(args: { endpoint: string; token: string; voiceId: string }) {
  const publicAgent = process.env.ELEVENLABS_AUTH_MODE === "public";
  return {
    name: process.env.ELEVENLABS_AGENT_NAME || "Pi Voice Whiteboard",
    tags: ["pi", "whiteboard", "custom-llm"],
    conversation_config: {
      asr: {
        quality: "high",
        provider: "scribe_realtime",
        keywords: ["Pi", "Excalidraw", "whiteboard", "ElevenLabs", "TUI", "codebase"],
      },
      turn: {
        turn_model: "turn_v3",
        turn_eagerness: "eager",
        spelling_patience: "off",
        initial_wait_time: 1,
        turn_timeout: 4,
        soft_timeout_config: {
          timeout_seconds: 2.5,
          message: "One moment.",
          additional_soft_timeout_messages: ["Still working."],
          use_llm_generated_message: false,
          max_soft_timeouts_per_generation: 2,
        },
      },
      tts: {
        model_id: "eleven_flash_v2",
        voice_id: args.voiceId,
        agent_output_audio_format: "pcm_16000",
        optimize_streaming_latency: 3,
        stability: 0.5,
        speed: 1,
        similarity_boost: 0.8,
        text_normalisation_type: "elevenlabs",
      },
      conversation: {
        max_duration_seconds: 1800,
        client_events: [
          "conversation_initiation_metadata",
          "asr_initiation_metadata",
          "ping",
          "audio",
          "interruption",
          "user_transcript",
          "tentative_user_transcript",
          "agent_response",
          "agent_response_correction",
          "agent_response_metadata",
          "agent_chat_response_part",
          "agent_response_complete",
          "vad_score",
          "client_error",
        ],
      },
      agent: {
        first_message: "",
        language: "en",
        max_conversation_duration_message: "I need to stop this voice session now.",
        prompt: {
          prompt:
            "You are a thin voice transport for Pi. Do not solve tasks yourself. Forward user turns to the configured Custom LLM and speak only its streamed response. Pi owns reasoning, code work, tools, prompts, and whiteboard changes.",
          llm: "custom-llm",
          custom_llm: {
            url: args.endpoint,
            model_id: "pi",
            api_type: "chat_completions",
            request_headers: {
              Authorization: `Bearer ${args.token}`,
            },
          },
          temperature: null,
          max_tokens: -1,
          ignore_default_personality: true,
        },
      },
    },
    platform_settings: {
      auth: {
        enable_auth: !publicAgent,
      },
      call_limits: {
        agent_concurrency_limit: 1,
        daily_limit: 100,
        bursting_enabled: false,
      },
      privacy: {
        record_voice: false,
      },
    },
  };
}

async function main(): Promise<void> {
  const apiKey = elevenLabsApiKey();
  const token = requiredEnv("PIWB_GATEWAY_TOKEN");
  const endpoint = gatewayUrl();
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || "cjVigY5qzO86Huf0OWal";

  if (!endpoint.startsWith("https://")) {
    throw new Error("PIWB_PUBLIC_URL/PIWB_CUSTOM_LLM_URL must be https:// for ElevenLabs to call it");
  }

  const body = agentPayload({ endpoint, token, voiceId });
  const existingAgentId = process.env.ELEVENLABS_AGENT_ID?.trim();
  const creating = !existingAgentId;
  const url = creating
    ? "https://api.elevenlabs.io/v1/convai/agents/create"
    : `https://api.elevenlabs.io/v1/convai/agents/${encodeURIComponent(existingAgentId)}`;
  const res = await fetch(url, {
    method: creating ? "POST" : "PATCH",
    headers: {
      "content-type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      ...body,
      ...(creating ? {} : { version_description: `Point Pi whiteboard agent at ${new URL(endpoint).host}` }),
    }),
  });
  const data = (await res.json().catch(() => ({}))) as AgentResponse;
  const agentId = creating ? data.agent_id : existingAgentId;
  if (!res.ok || !agentId) {
    console.error(
      creating ? "ElevenLabs create-agent failed:" : "ElevenLabs update-agent failed:",
      JSON.stringify({ status: res.status, body: redact(data, [apiKey, token]) }, null, 2),
    );
    process.exit(1);
  }

  console.log(creating ? "Created ElevenLabs Pi Voice Whiteboard agent." : "Updated ElevenLabs Pi Voice Whiteboard agent.");
  console.log(`ELEVENLABS_AGENT_ID=${agentId}`);
  console.log("Start the dashboard and press Start in the Mic card.");
}

function redact(value: unknown, secrets: string[]): unknown {
  const text = JSON.stringify(value);
  let redacted = text;
  for (const secret of secrets) {
    if (secret) redacted = redacted.replaceAll(secret, "[REDACTED]");
  }
  return JSON.parse(redacted);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
