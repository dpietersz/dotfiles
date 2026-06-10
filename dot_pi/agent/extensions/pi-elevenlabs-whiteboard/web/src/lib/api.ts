import type { SessionInfo } from "@shared/protocol";

export interface PublicConfig {
  protocol: number;
  voiceId: string;
  ttsVoiceId?: string;
  ttsConfigured?: boolean;
  authMode: "signed_url" | "public";
  elevenLabsConfigured: boolean;
  gatewayConfigured: boolean;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export const api = {
  async config(): Promise<PublicConfig> {
    return json<PublicConfig>(await fetch("/api/config"));
  },
  async sessions(): Promise<SessionInfo[]> {
    const r = await json<{ sessions: SessionInfo[] }>(await fetch("/api/sessions"));
    return r.sessions;
  },
  async setActiveSession(sessionId: string): Promise<void> {
    await json(
      await fetch("/api/active-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }),
    );
  },
  async whiteboard(sessionId: string): Promise<{ revisionId: string; scene: unknown; revisions?: unknown[] }> {
    return json(await fetch(`/api/session/${encodeURIComponent(sessionId)}/whiteboard`));
  },
  async importWhiteboard(sessionId: string, scene: unknown): Promise<{ revision: unknown }> {
    return json(
      await fetch(`/api/session/${encodeURIComponent(sessionId)}/whiteboard`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scene, summary: "imported Excalidraw scene" }),
      }),
    );
  },
  async cleanupWhiteboard(sessionId: string, baseRevisionId?: string): Promise<{ revision: unknown; removed: number }> {
    return json(
      await fetch(`/api/session/${encodeURIComponent(sessionId)}/whiteboard/cleanup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ baseRevisionId, preserveExports: true }),
      }),
    );
  },
  async snapshot(sessionId: string, scope: "selected" | "viewport" | "all" = "all"): Promise<{ available: boolean; via?: string; path?: string; hasImage?: boolean; error?: string }> {
    return json(await fetch(`/api/session/${encodeURIComponent(sessionId)}/snapshot?scope=${scope}`, { method: "POST" }));
  },
  async prompt(sessionId: string, text: string): Promise<{ text: string }> {
    return json(
      await fetch(`/api/session/${encodeURIComponent(sessionId)}/prompt`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      }),
    );
  },
  async signedUrl(sessionId: string): Promise<{ signedUrl?: string; agentId?: string; conversationId?: string; voiceId: string }> {
    return json(await fetch(`/api/session/${encodeURIComponent(sessionId)}/signed-url`));
  },
  async conversationToken(sessionId: string): Promise<{ conversationToken: string; voiceId: string }> {
    return json(await fetch(`/api/session/${encodeURIComponent(sessionId)}/conversation-token`));
  },
  async scribeToken(): Promise<{ token: string }> {
    return json(await fetch("/api/elevenlabs/scribe-token"));
  },
  /** Synthesize speech via the hub's server-side ElevenLabs TTS proxy. */
  async tts(text: string, signal?: AbortSignal): Promise<Blob> {
    const res = await fetch("/api/elevenlabs/tts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
      signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`TTS ${res.status}: ${body.slice(0, 160)}`);
    }
    return res.blob();
  },
};
