import { useCallback, useEffect, useRef, useState } from "react";
import { CommitStrategy, useScribe } from "@elevenlabs/react";
import { api } from "@/lib/api";
import type { TranscriptTurn } from "@shared/protocol";

export type VoiceStatus = "disconnected" | "connecting" | "connected" | "error";

export interface VoiceApi {
  status: VoiceStatus;
  mode: "speaking" | "listening";
  conversationId: string | null;
  isSpeaking: boolean;
  isListening: boolean;
  isMuted: boolean;
  error: string | null;
  localTurns: TranscriptTurn[];
  start: (sessionId: string) => Promise<void>;
  stop: () => void;
  toggleMute: () => void;
  clearLocalTurns: () => void;
  getInputLevel: () => number;
}

function voiceTurn(partial: Omit<TranscriptTurn, "id" | "ts"> & { id?: string }): TranscriptTurn {
  return { id: partial.id ?? crypto.randomUUID(), ts: Date.now(), ...partial };
}

/** Last-resort fallback only — browser TTS is NOT the ElevenLabs voice. */
function speakBrowserFallback(text: string): void {
  try {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* ignore browser TTS failures */
  }
}

/**
 * Voice transport fallback: ElevenLabs Scribe realtime STT -> Pi hub prompt ->
 * browser speech synthesis. ConvAI agent mode had VAD but no user_transcript on
 * this machine; Scribe keeps ElevenLabs as STT while avoiding ConvAI turn bugs.
 */
export function useElevenLabs(onError?: (msg: string) => void): VoiceApi {
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localTurns, setLocalTurns] = useState<TranscriptTurn[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const sessionRef = useRef<string>("current");
  const processingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addLocalTurn = useCallback((turn: TranscriptTurn) => {
    setLocalTurns((prev) => {
      const idx = prev.findIndex((t) => t.id === turn.id);
      const next = idx >= 0 ? prev.map((t, i) => (i === idx ? turn : t)) : [...prev, turn];
      return next.slice(-100);
    });
  }, []);

  /** Speak Pi's reply through ElevenLabs TTS (hub proxy). Browser TTS only as a
   * logged last resort so the user is never left in silence. */
  const playReply = useCallback(
    async (text: string) => {
      const utterance = text.trim();
      if (!utterance) return;
      try {
        const blob = await api.tts(utterance);
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => URL.revokeObjectURL(url);
        await audio.play();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        addLocalTurn(
          voiceTurn({
            sessionId: sessionRef.current,
            role: "system",
            text: `ElevenLabs TTS failed (${msg}); falling back to browser speech.`,
            source: "system",
          }),
        );
        speakBrowserFallback(utterance);
      }
    },
    [addLocalTurn],
  );

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: CommitStrategy.VAD,
    vadSilenceThresholdSecs: 0.8,
    vadThreshold: 0.35,
    minSpeechDurationMs: 120,
    minSilenceDurationMs: 450,
    languageCode: "en",
    keyterms: ["Pi", "Excalidraw", "whiteboard", "ElevenLabs"],
    microphone: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
    },
    onSessionStarted: () => {
      setConversationId("scribe-realtime");
      addLocalTurn(voiceTurn({ sessionId: sessionRef.current, role: "system", text: "ElevenLabs Scribe STT connected.", source: "system" }));
    },
    onPartialTranscript: ({ text }) => {
      if (!text.trim()) return;
      addLocalTurn(
        voiceTurn({
          id: "scribe-partial",
          sessionId: sessionRef.current,
          role: "user",
          text: `${text.trim()} …`,
          streaming: true,
          source: "voice",
        }),
      );
    },
    onCommittedTranscript: ({ text }) => {
      const utterance = text.trim();
      if (!utterance || processingRef.current) return;
      addLocalTurn(voiceTurn({ id: "scribe-partial", sessionId: sessionRef.current, role: "user", text: utterance, streaming: false, source: "voice" }));
      void (async () => {
        processingRef.current = true;
        try {
          const result = await api.prompt(sessionRef.current, utterance);
          if (result.text) await playReply(result.text);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(msg);
          addLocalTurn(voiceTurn({ sessionId: sessionRef.current, role: "system", text: `Voice prompt failed: ${msg}`, source: "system" }));
          onError?.(msg);
        } finally {
          processingRef.current = false;
        }
      })();
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      addLocalTurn(voiceTurn({ sessionId: sessionRef.current, role: "system", text: `Scribe error: ${msg}`, source: "system" }));
      onError?.(msg);
    },
    onDisconnect: (details?: unknown) => {
      setConversationId(null);
      // Surface the close so a silent abnormal drop (e.g. WS 1006) is visible
      // in the transcript instead of leaving the user wondering.
      const reason =
        details && typeof details === "object"
          ? ((details as { reason?: string; message?: string }).reason ??
            (details as { message?: string }).message ??
            "")
          : "";
      addLocalTurn(
        voiceTurn({
          sessionId: sessionRef.current,
          role: "system",
          text: reason ? `ElevenLabs Scribe STT disconnected: ${reason}` : "ElevenLabs Scribe STT disconnected.",
          source: "system",
        }),
      );
    },
  });

  const start = useCallback(
    async (sessionId: string) => {
      setError(null);
      sessionRef.current = sessionId;
      await api.setActiveSession(sessionId).catch(() => undefined);
      try {
        const { token } = await api.scribeToken();
        await scribe.connect({ token });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        addLocalTurn(voiceTurn({ sessionId, role: "system", text: `Scribe start failed: ${msg}`, source: "system" }));
        onError?.(msg);
      }
    },
    [addLocalTurn, onError, scribe],
  );

  const stop = useCallback(() => {
    try {
      scribe.disconnect();
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    } catch {
      /* ignore */
    }
  }, [scribe]);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      const next = !m;
      try {
        if (next) scribe.mute();
        else scribe.unmute();
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [scribe]);

  const clearLocalTurns = useCallback(() => setLocalTurns([]), []);
  const getInputLevel = useCallback(() => 0, []);

  useEffect(() => () => stop(), [stop]);

  const connected = scribe.status === "connected" || scribe.status === "transcribing";
  return {
    status: scribe.status === "error" ? "error" : connected ? "connected" : scribe.status === "connecting" ? "connecting" : "disconnected",
    mode: "listening",
    conversationId,
    isSpeaking: processingRef.current,
    isListening: connected && !isMuted,
    isMuted,
    error: error ?? scribe.error,
    localTurns,
    start,
    stop,
    toggleMute,
    clearLocalTurns,
    getInputLevel,
  };
}
