import type { IncomingMessage, ServerResponse } from "node:http";
import type { Hub } from "./server.ts";
import { readJsonBody, sendJson } from "./http-util.ts";

/**
 * Mint an ephemeral connection credential for the browser to start an
 * ElevenLabs Conversational AI session.
 *
 * SECURITY: the ElevenLabs API key never leaves the server. In "public" mode we
 * only return the agent id; in "signed_url" mode we exchange the agent id for a
 * short-lived signed URL using the server-side key.
 */
export async function handleSignedUrl(
  hub: Hub,
  _sessionId: string,
  url: URL,
  res: ServerResponse,
): Promise<void> {
  const { elevenLabs } = hub.config;
  const agentId = url.searchParams.get("agent_id") || elevenLabs.agentId;

  if (!agentId) {
    return sendJson(res, 400, { error: "ELEVENLABS_AGENT_ID not configured" });
  }

  if (elevenLabs.authMode === "public") {
    return sendJson(res, 200, { agentId, voiceId: elevenLabs.voiceId });
  }

  if (!elevenLabs.apiKey) {
    return sendJson(res, 500, { error: "ELEVENLABS_API_KEY not configured" });
  }

  try {
    const signedUrlEndpoint =
      "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=" +
      encodeURIComponent(agentId);
    const resp = await fetch(signedUrlEndpoint, { headers: { "xi-api-key": elevenLabs.apiKey } });
    if (!resp.ok) {
      hub.log.warn("elevenlabs signed-url error", { status: resp.status });
      return sendJson(res, 502, { error: "ElevenLabs API error", status: resp.status });
    }
    const data = (await resp.json()) as { signed_url?: string; conversation_id?: string };
    if (!data.signed_url) {
      return sendJson(res, 502, { error: "invalid response from ElevenLabs" });
    }
    return sendJson(res, 200, {
      signedUrl: data.signed_url,
      conversationId: data.conversation_id,
      voiceId: elevenLabs.voiceId,
    });
  } catch (err) {
    hub.log.warn("elevenlabs fetch failed", { err: String(err) });
    return sendJson(res, 502, { error: "failed to reach ElevenLabs" });
  }
}

/**
 * Mint a conversation token for authenticated WebRTC voice sessions. The React
 * SDK docs recommend conversationToken for authorized WebRTC, while signedUrl
 * is the WebSocket-auth path.
 */
export async function handleScribeToken(hub: Hub, _req: IncomingMessage, res: ServerResponse): Promise<void> {
  const { apiKey } = hub.config.elevenLabs;
  if (!apiKey) return sendJson(res, 500, { error: "ELEVENLABS_API_KEY not configured" });

  try {
    const resp = await fetch("https://api.elevenlabs.io/v1/single-use-token/realtime_scribe", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
    });
    if (!resp.ok) {
      hub.log.warn("elevenlabs scribe-token error", { status: resp.status });
      return sendJson(res, 502, { error: "ElevenLabs API error", status: resp.status });
    }
    const data = (await resp.json()) as { token?: string };
    if (!data.token) return sendJson(res, 502, { error: "invalid response from ElevenLabs" });
    return sendJson(res, 200, { token: data.token });
  } catch (err) {
    hub.log.warn("elevenlabs scribe-token fetch failed", { err: String(err) });
    return sendJson(res, 502, { error: "failed to reach ElevenLabs" });
  }
}

/**
 * Server-side ElevenLabs TTS proxy. The Scribe voice path uses this so that
 * ElevenLabs (not browser speechSynthesis) produces the spoken reply — honoring
 * the architecture boundary rule ("ElevenLabs may transcribe and speak"). The
 * API key never reaches the browser. Returns audio/mpeg bytes.
 */
export async function handleTts(hub: Hub, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const { apiKey, ttsVoiceId, ttsModelId } = hub.config.elevenLabs;
  if (!apiKey) return sendJson(res, 500, { error: "ELEVENLABS_API_KEY not configured" });

  let body: { text?: string; voiceId?: string; modelId?: string } | null = null;
  try {
    body = await readJsonBody<{ text?: string; voiceId?: string; modelId?: string }>(req);
  } catch {
    return sendJson(res, 400, { error: "invalid JSON body" });
  }
  const text = (body?.text ?? "").trim();
  if (!text) return sendJson(res, 400, { error: "text required" });

  const voiceId = body?.voiceId?.trim() || ttsVoiceId;
  const modelId = body?.modelId?.trim() || ttsModelId;
  const endpoint =
    "https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voiceId) + "?output_format=mp3_44100_128";

  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: modelId }),
    });
    if (!resp.ok || !resp.body) {
      const detail = await resp.text().catch(() => "");
      hub.log.warn("elevenlabs tts error", { status: resp.status, detail: detail.slice(0, 200) });
      return sendJson(res, 502, { error: "ElevenLabs TTS error", status: resp.status });
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(buf.length),
      "Cache-Control": "no-store",
    });
    res.end(buf);
  } catch (err) {
    hub.log.warn("elevenlabs tts fetch failed", { err: String(err) });
    return sendJson(res, 502, { error: "failed to reach ElevenLabs TTS" });
  }
}

export async function handleConversationToken(
  hub: Hub,
  _sessionId: string,
  url: URL,
  res: ServerResponse,
): Promise<void> {
  const { elevenLabs } = hub.config;
  const agentId = url.searchParams.get("agent_id") || elevenLabs.agentId;

  if (!agentId) return sendJson(res, 400, { error: "ELEVENLABS_AGENT_ID not configured" });
  if (!elevenLabs.apiKey) return sendJson(res, 500, { error: "ELEVENLABS_API_KEY not configured" });

  try {
    const tokenEndpoint =
      "https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=" + encodeURIComponent(agentId);
    const resp = await fetch(tokenEndpoint, { headers: { "xi-api-key": elevenLabs.apiKey } });
    if (!resp.ok) {
      hub.log.warn("elevenlabs conversation-token error", { status: resp.status });
      return sendJson(res, 502, { error: "ElevenLabs API error", status: resp.status });
    }
    const data = (await resp.json()) as { token?: string; conversation_token?: string };
    const token = data.token ?? data.conversation_token;
    hub.log.info("elevenlabs conversation-token minted", { agentId });
    if (!token) return sendJson(res, 502, { error: "invalid response from ElevenLabs" });
    return sendJson(res, 200, { conversationToken: token, voiceId: elevenLabs.voiceId });
  } catch (err) {
    hub.log.warn("elevenlabs token fetch failed", { err: String(err) });
    return sendJson(res, 502, { error: "failed to reach ElevenLabs" });
  }
}
