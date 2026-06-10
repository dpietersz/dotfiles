import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import type { VoiceApi } from "@/hooks/useElevenLabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  voice: VoiceApi;
  sessionId: string | null;
  voiceConfigured: boolean;
}

export function MicControls({ voice, sessionId, voiceConfigured }: Props) {
  const [level, setLevel] = useState(0);
  const raf = useRef<number | null>(null);
  const active = voice.status === "connected" || voice.status === "connecting";

  useEffect(() => {
    if (voice.status !== "connected") {
      setLevel(0);
      return;
    }
    const tick = () => {
      setLevel(voice.getInputLevel());
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [voice.status, voice]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border",
              voice.status === "connected" && !voice.isMuted
                ? "border-aqua text-aqua"
                : "border-border text-muted-foreground",
              voice.isSpeaking && "ring-2 ring-primary",
            )}
            aria-hidden
          >
            {voice.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </div>
          {!active ? (
            <Button
              className="flex-1"
              disabled={!sessionId || !voiceConfigured}
              onClick={() => sessionId && voice.start(sessionId)}
              title={voiceConfigured ? "Start voice session" : "ElevenLabs not configured on the hub"}
            >
              <Mic className="h-4 w-4" /> Start
            </Button>
          ) : (
            <Button variant="destructive" className="flex-1" onClick={voice.stop}>
              <Square className="h-4 w-4" /> Stop
            </Button>
          )}
          <Button
            variant={voice.isMuted ? "secondary" : "outline"}
            size="icon"
            disabled={voice.status !== "connected"}
            onClick={voice.toggleMute}
            title={voice.isMuted ? "Unmute" : "Mute"}
          >
            {voice.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>

        {/* Level meter */}
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-aqua transition-[width] duration-75"
              style={{ width: `${Math.min(100, Math.round(level * 140))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{voice.status}</span>
            <span>{voice.status === "connected" ? (voice.mode === "speaking" ? "TTS speaking" : "STT listening") : "voice idle"}</span>
          </div>
          {voice.conversationId ? (
            <div className="truncate text-[11px] text-muted-foreground" title={voice.conversationId}>
              conversation {voice.conversationId}
            </div>
          ) : null}
        </div>

        {!voiceConfigured ? (
          <p className="text-xs text-muted-foreground">
            Voice is optional. Configure <code className="text-[11px]">ELEVENLABS_AGENT_ID</code> on the
            hub to enable the mic, or use the text box below.
          </p>
        ) : voice.error ? (
          <p className="text-xs text-destructive">{voice.error}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
