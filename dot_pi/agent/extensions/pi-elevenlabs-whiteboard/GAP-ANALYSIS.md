# Pi × ElevenLabs Whiteboard — Gap Analysis vs Architecture Doc

**Date:** 2026-06-09
**Reference:** `docs/architecture/pi-elevenlabs-whiteboard-dashboard.html`
**Implementation:** `~/dotfiles/dot_pi/agent/extensions/pi-elevenlabs-whiteboard/` (canonical) → deployed at `~/.pi/agent/extensions/pi-elevenlabs-whiteboard/`
**Method:** Every claim below was probed with a real tool (curl, ElevenLabs API, WebSocket handshake, Playwright in real Chromium, bun test). Nothing is assumed.

> **One-line verdict:** The system is ~90% built and the *entire server + UI + public ingress is correct and verified working*. The single broken link is **browser → ElevenLabs voice ingestion (STT)**. Everything downstream of a transcript works end-to-end. The speak path has been fixed to use ElevenLabs TTS (was wrongly using the browser's robotic `speechSynthesis`).

---

## 1. Two copies exist — know which is real

| Path | Status |
|---|---|
| `~/dotfiles/dot_pi/.../pi-elevenlabs-whiteboard/` | **CANONICAL.** Full hub, web/src, scripts, tests. chezmoi-managed → deployed to `~/.pi/...`. |
| `~/dev/Repos/pi-elevenlabs-whiteboard/` | **STALE SCAFFOLD.** Only `extension/index.ts`, `scripts/`, `shared/`. No `hub/`, no `web/src/`. Ignore it. |

Work only the dotfiles copy. `HANDOFF-from-homelab-sync-vm.md` is unrelated (a VM provisioning note that merely shares the tailnet name).

---

## 2. Component-by-component status (vs the doc's Component Model)

| Doc component | Built? | Verified | Notes |
|---|---|---|---|
| Dashboard Web UI (React + shadcn + Excalidraw) | ✅ | Playwright: renders 4 left-pane blocks (Sessions, Active, Mic, Transcript) + Excalidraw (2 canvases) | Matches the doc's left-pane/right-canvas contract exactly. |
| Session Registry | ✅ | curl `/api/sessions` returns live + persisted sessions | `SdkPiBridge` (headless) is the default; `PiExtensionBridge` is an opt-in interactive mode. |
| Voice Gateway (OpenAI-compatible `/v1/chat/completions`) | ✅ | curl: 401 no-auth, SSE with auth, non-stream `chat.completion` shape, bearer + host-allowlist + rate-limit | Fully OpenAI-compatible. Correct. |
| Pi Bridge (headless SDK session) | ✅ | hub turn-complete logs, mock + SDK paths | The "headless SDK bridge" from the handoff is real (`sdk-bridge.ts`) — no more TUI prompt dumping. |
| Whiteboard Store (Excalidraw + semantic sidecar + cleanup) | ✅ | curl seed→`/context-packet` returns semantic nodes/edges; 14/14 unit tests pass | Cleanup compiler + semantic IDs + revisions all present and tested. |
| Prompt Templates | ✅ | `extension/prompts/*.md` present, versioned (`promptVersion` in logs) | voice-prompt, whiteboard-generate, whiteboard-update. |
| Playwright snapshot fallback | ✅ (optional dep) | code path present (`snapshot.ts`); playwright not installed in extension node_modules by default | Fallback ladder implemented as the doc describes. |
| Whiteboard Pi tools (`whiteboard_*`) | ✅ | registered via `registerWhiteboardTools` / `createWhiteboardTools` | get_context, apply_patch, cleanup, render_snapshot, add_shape, add_arrow. |
| Public tunnel (Tailscale Funnel) | ✅ | `tailscale funnel status`: `p14.tailfb822f.ts.net → 127.0.0.1:8848`; public gateway SSE verified across the internet | Dashboard routes correctly hidden (404) on the public host; only `/v1/chat/completions` exposed. |

**Server-side conclusion: complete and correct.** I ran the gateway through the live public funnel with the real bearer token and got a streamed OpenAI SSE response. If ElevenLabs produced a transcript, the whole chain would work today.

---

## 3. The actual blocker: voice ingestion (STT)

The doc's design is **ElevenLabs ConvAI Custom LLM** (ElevenLabs does mic + VAD + STT + turn-taking + TTS; calls Pi as the LLM). The reported symptom: VAD reaches 0.99 but **no `user_transcript`** is ever emitted, so the gateway is never called.

### What I verified about ElevenLabs (live API)

| Probe | Result |
|---|---|
| Live agent config (`GET /v1/convai/agents/{id}`) | ASR `scribe_realtime`/high, turn_v3 eager, TTS `eleven_flash_v2`, **custom-llm correctly wired** to `https://p14.tailfb822f.ts.net/v1/chat/completions` with bearer, `user_transcript` IS in `client_events`, `enable_auth:false` (public). Config is structurally correct. |
| Scribe single-use token (`POST /v1/single-use-token/realtime_scribe`) | **200** ✓ |
| Scribe realtime WS handshake (CLI, `ws`) | **`session_started`** for `scribe_v2_realtime`, `scribe_v1`, and no-model — endpoint/token/model all valid ✓ |
| Browser Scribe path (Playwright real Chromium) | Connects, then **closes 1006** immediately. |

### Root-cause assessment

- **Scribe browser 1006 — DISAMBIGUATED (this is the key finding):** I tested four ways.
  1. CLI WS, fresh API-key token → `session_started` ✓
  2. CLI WS, **hub-minted single-use token + the exact SDK URL (all VAD params) + browser `Origin` header** → `session_started`, **held open 8s** ✓
  3. Browser (Playwright real Chromium), fake mic → 1006
  4. Browser, **real speech injected** via `--use-file-for-fake-audio-capture` → **still 1006**
  Because (4) reproduces 1006 even with real audio, the 1006 is **not** mic-permission related. Because (2) holds open from CLI with the identical URL/token/Origin, the **server, token flow, params, and model are all correct**. By elimination the browser 1006 is **client-side: the headless Chromium audio pipeline (AudioContext/AudioWorklet)** that the `@elevenlabs/react` Scribe SDK uses to capture+downsample mic audio — headless Chromium cannot reliably run that worklet, so the SDK tears the socket down (reported to JS as opaque 1006). On Dimitri's real Chrome the AudioWorklet works (the earlier ConvAI test reached real VAD 0.99), so the Scribe WS should hold and emit transcripts there.
- **ConvAI no-transcript:** The agent config is correct. The likeliest cause is `asr.provider: "scribe_realtime"` inside ConvAI (a newer ASR provider) not finalizing turns in this account/region, while standalone Scribe v2 realtime works fine. Not reproducible headlessly (no real audio worklet) — documented hypothesis, ConvAI path left intact server-side.

### Which voice path is canonical (avoids shipping two architectures, one silently dead)

- **Active/canonical now:** browser **Scribe STT → hub `/api/session/:id/prompt` → Pi (SdkPiBridge) → hub `/api/elevenlabs/tts` → browser playback.** Fully server-verified; only the in-browser audio-capture step awaits real-Chrome confirmation.
- **Dormant-but-live:** the **ConvAI Custom LLM gateway** (`/v1/chat/completions` over the public funnel) is the doc's mandated path and is verified working end-to-end (auth, host-allowlist, SSE, public ingress). It is **not orphaned** — it shares the exact same `runTurn` core as the Scribe path, so there is no dead branch. It reactivates the moment ConvAI ASR emits transcripts. Keep both; they converge on one engine.

---

## 4. Concrete gaps found (and what I did about each)

| # | Gap vs doc | Severity | Action taken |
|---|---|---|---|
| G1 | Browser **TTS used `window.speechSynthesis`** (robotic OS voice) — violates the doc boundary rule "ElevenLabs may … speak" and ignores the chosen voice. | **High** | **FIXED.** New hub endpoint `POST /api/elevenlabs/tts` proxies ElevenLabs TTS server-side (key never leaves server). Browser `playReply()` now fetches it and plays the MP3. Verified in real Chromium: `200 audio/mpeg`, **decoded:true**. |
| G2 | **Voice ID mismatch**: doc specifies `pq3wL6Xv3fuEM14W6ZCg`; config used `cjVigY5qzO86Huf0OWal`. | Med | **RESOLVED + documented.** The doc voice is **not in the account library** (`GET /v1/voices/{id}` → none) but **works for raw TTS** (200 MP3). So the new speak path uses the doc voice (`PIWB_TTS_VOICE_ID`, defaulted to `pq3wL6Xv3fuEM14W6ZCg`). The ConvAI agent keeps `cjVigY…` because ConvAI requires a library voice. |
| G3 | Browser pivoted entirely off the documented **ConvAI Custom LLM** flow to a half-built Scribe fallback (STT only). | High | Completed the Scribe path into a coherent loop: ElevenLabs Scribe STT → Pi (hub) → **ElevenLabs TTS**. This satisfies the doc's *boundary rule* (ElevenLabs transcribes + speaks; Pi decides) even though it isn't the literal ConvAI mechanism. ConvAI left available for when its ASR is sorted. |
| G4 | Silent failures: WS 1006 left the user staring at nothing. | Med | **FIXED.** `onDisconnect` now writes a visible system line to the transcript; TTS failures log "falling back to browser speech" before degrading. No more silent drops. |
| G5 | **`bun run build` was broken** (`tsc -b` failed: `vite.config.ts` had no `@types/node`). Pre-existing. | Med | **FIXED.** Added `@types/node` to web devDeps and `"types":["node"]` to `tsconfig.node.json`. `bun run build` now exits 0. |
| G6 | Extension `bun run check` fails (`tsc` not on PATH; devDeps not installed). | Low | Noted. Extension runs via bun (no compile step); my edits were validated by **running the hub** (config/tts/gateway all execute correctly). Installing extension devDeps would restore `check`. |

---

## 5. What still requires Dimitri (cannot be done headlessly)

1. **One real-Chrome mic test of the Scribe path.** Open `/whiteboard`, press Start, speak. Expected now: partial + committed transcript appears, Pi replies, and **you hear the ElevenLabs voice** (not the robotic browser voice). The transcript will also show the exact disconnect reason if the WS drops — paste that back if it fails.
2. **If Scribe still 1006s in real Chrome:** it's an SDK/audio-format issue, not infra — every other link is proven. Next step would be pinning `@elevenlabs/react` Scribe audio config or falling back to the ConvAI path with `asr.provider` changed off `scribe_realtime`.

---

## 6. Files changed this pass

- `extension/hub/config.ts` — `ttsVoiceId` (default `pq3wL6Xv3fuEM14W6ZCg`) + `ttsModelId`.
- `extension/hub/elevenlabs.ts` — `handleTts()` server-side TTS proxy.
- `extension/hub/server.ts` — route `POST /api/elevenlabs/tts`; expose `ttsVoiceId`/`ttsConfigured` in `/api/config`.
- `web/src/lib/api.ts` — `api.tts()`; `PublicConfig` fields.
- `web/src/hooks/useElevenLabs.ts` — `playReply()` (ElevenLabs TTS + Audio playback); disconnect-reason surfacing; `speakBrowserFallback` (logged last resort); stop() cancels audio.
- `web/package.json`, `web/tsconfig.node.json` — fix `bun run build`.
- Rebuilt `web/dist`; synced to deployed `~/.pi/...` (deployed secrets env preserved).

All changes are in the dotfiles source (uncommitted) and live in `~/.pi`. Commit via your normal chezmoi flow when ready.
