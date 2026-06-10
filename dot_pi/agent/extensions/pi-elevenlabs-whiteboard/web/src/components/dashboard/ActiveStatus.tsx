import type { SessionInfo } from "@shared/protocol";
import type { VoiceStatus } from "@/hooks/useElevenLabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  session: SessionInfo | null;
  voiceId: string;
  voiceStatus: VoiceStatus;
  hubConnected: boolean;
}

const VOICE_VARIANT: Record<VoiceStatus, "ok" | "warn" | "danger" | "outline"> = {
  connected: "ok",
  connecting: "warn",
  disconnected: "outline",
  error: "danger",
};

export function ActiveStatus({ session, voiceId, voiceStatus, hubConnected }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        <Badge variant={session?.model ? "default" : "outline"} title="Model (owned by Pi)">
          {session?.model ?? "no model"}
        </Badge>
        <Badge variant="secondary" title="ElevenLabs voice id">
          voice {voiceId.slice(0, 6)}…
        </Badge>
        <Badge variant={VOICE_VARIANT[voiceStatus]} title="Voice connection">
          {voiceStatus}
        </Badge>
        <Badge variant={hubConnected ? "ok" : "danger"} title="Dashboard hub link">
          {hubConnected ? "hub live" : "hub down"}
        </Badge>
        {session?.busy ? <Badge variant="warn">streaming</Badge> : null}
      </CardContent>
    </Card>
  );
}
