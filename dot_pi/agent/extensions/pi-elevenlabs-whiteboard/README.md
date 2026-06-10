# Pi × ElevenLabs Voice Whiteboard

Pi-native voice whiteboard dashboard. ElevenLabs Conversational AI owns microphone capture, turn detection, STT, and TTS. Pi owns all reasoning, prompts, tools, session execution, transcript, and Excalidraw whiteboard state.

## Architecture

- Browser dashboard: React + Vite + shadcn-style UI + Excalidraw.
- Voice: `@elevenlabs/react` starts an ElevenLabs ConvAI session using a server-minted signed URL.
- Custom LLM gateway: `POST /v1/chat/completions` streams OpenAI-compatible SSE chunks back to ElevenLabs.
- Pi bridge: real Pi extension uses `pi.sendUserMessage`; standalone mock bridge supports local tests.
- Whiteboard store: persists Excalidraw scene JSON, semantic sidecar/context packets, revisions, snapshots, and transcript.

## Install

```bash
bun install
cd web && bun install && cd ..
bun run build:web
```

## Configure

```bash
cp .env.template .env
```

Required for voice:

```env
ELEVENLABS_API_KEY=...
ELEVENLABS_AGENT_ID=...
ELEVENLABS_AUTH_MODE=signed_url
ELEVENLABS_VOICE_ID=cjVigY5qzO86Huf0OWal
PIWB_GATEWAY_TOKEN=<strong random token>
PIWB_PUBLIC_URL=https://<your-public-endpoint>
```

For a public tunnel, also set:

```env
PIWB_GATEWAY_ALLOWED_HOSTS=<your-tunnel-hostname>
PIWB_GATEWAY_RATE_LIMIT_PER_MINUTE=30
```

## ElevenLabs agent setup

Portable automated path with Tailscale Funnel (recommended for your Bluefin fleet):

```bash
bun run setup:public-voice --tunnel=tailscale
```

This starts/updates Tailscale Funnel for the hub port, generates a local gateway token if missing, writes `.piwb.local.env` (ignored), and creates or patches the ElevenLabs agent. When `PIWB_GATEWAY_ALLOWED_HOSTS` is set, the public tunnel host exposes only `/v1/chat/completions`; dashboard/API routes stay local-only.

Automated path with any other stable HTTPS endpoint:

```bash
PIWB_PUBLIC_URL=https://<your-public-endpoint> \
PIWB_GATEWAY_TOKEN=<strong random token> \
bun run setup:elevenlabs-agent
```

The script uses `ELEVENLABS_API_KEY` or the pass entry `Sites/elevenlabs.com/api-key/pi`. If `ELEVENLABS_AGENT_ID` is unset it creates a signed-auth Conversational AI agent; if set it patches that existing agent to the current endpoint. It configures STT/TTS, sets `custom-llm`, points it at `/v1/chat/completions`, and prints `ELEVENLABS_AGENT_ID=...`. Add that line to `.env` after first creation.

Manual path:

1. Create or edit an ElevenLabs Conversational AI agent.
2. Set the agent's LLM/provider to **Custom LLM**.
3. Endpoint: `https://<your-public-tunnel>/v1/chat/completions`.
4. Authentication/header: `Authorization: Bearer <PIWB_GATEWAY_TOKEN>`.
5. Voice: use `cjVigY5qzO86Huf0OWal` or your desired default.
6. Enable signed URL authentication for the agent.
7. Keep the ElevenLabs prompt minimal: it should not reason or plan. Pi's bundled prompt templates govern behavior.
8. Expose only the gateway route publicly. This implementation blocks non-gateway routes on configured public tunnel hosts.

## Run

Standalone mock hub for local verification:

```bash
PIWB_BRIDGE=mock PIWB_GATEWAY_TOKEN=test-token bun run hub:mock
```

Real Pi extension mode:

1. Ensure `package.json` has `pi.extensions: ["./extension/index.ts"]`.
2. Start Pi from this repo or install the package where Pi can load it.
3. Run `/whiteboard` in Pi to open the dashboard.

## Key routes

- `GET /api/health` — hub status.
- `GET /api/config` — public voice/dashboard config.
- `POST /api/active-session` — select target Pi session.
- `GET /api/session/:id/whiteboard` — scene/revisions.
- `GET /api/session/:id/context-packet` — compact semantic context.
- `GET /api/session/:id/transcript` — persisted transcript.
- `POST /api/session/:id/prompt` — dashboard text prompt.
- `GET /api/session/:id/conversation-token` — server-side ElevenLabs WebRTC conversation token minting.
- `GET /api/session/:id/signed-url` — server-side ElevenLabs WebSocket signed URL minting fallback.
- `POST /api/session/:id/snapshot` — dashboard/Playwright PNG export.
- `POST /v1/chat/completions` — ElevenLabs Custom LLM SSE gateway.

## Pi whiteboard tools

- `whiteboard_get_context`
- `whiteboard_apply_excalidraw_patch`
- `whiteboard_cleanup_scene`
- `whiteboard_render_snapshot`
- `whiteboard_add_shape`
- `whiteboard_add_arrow`
- `whiteboard_explain_selection`

## Verify

```bash
bun run check
bun test
bun run build:web
```

Mock SSE smoke:

```bash
curl -N -H 'Authorization: Bearer test-token' \
  -H 'Content-Type: application/json' \
  -d '{"model":"pi","stream":true,"messages":[{"role":"user","content":"hello"}]}' \
  http://127.0.0.1:8848/v1/chat/completions
```

Dashboard smoke:

```bash
curl -X POST http://127.0.0.1:8848/api/session/current/seed-demo
open http://127.0.0.1:8848/
```
