import { Activity, MessageSquare, Mic, PanelLeftClose, PanelLeftOpen, Boxes } from "lucide-react";
import type { SessionInfo, TranscriptTurn } from "@shared/protocol";
import type { VoiceApi } from "@/hooks/useElevenLabs";
import type { PublicConfig } from "@/lib/api";
import { Sessions } from "./Sessions";
import { ActiveStatus } from "./ActiveStatus";
import { MicControls } from "./MicControls";
import { Transcript } from "./Transcript";
import { CanvasActions } from "./CanvasActions";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  sessions: SessionInfo[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  activeSession: SessionInfo | null;
  voice: VoiceApi;
  config: PublicConfig | null;
  hubConnected: boolean;
  transcript: TranscriptTurn[];
}

const COLLAPSED_ICONS = [
  { icon: Boxes, label: "Sessions" },
  { icon: Activity, label: "Active" },
  { icon: Mic, label: "Mic" },
  { icon: MessageSquare, label: "Transcript" },
];

export function LeftPane(props: Props) {
  if (props.collapsed) {
    return (
      <aside className="flex h-full w-14 flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar py-3">
        <Button variant="ghost" size="icon" onClick={props.onToggle} title="Expand panel">
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
        <div className="mt-2 flex flex-col gap-1">
          {COLLAPSED_ICONS.map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={props.onToggle} aria-label={label}>
                  <Icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-80 flex-col gap-3 border-r border-sidebar-border bg-sidebar p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">Voice Whiteboard</span>
        <Button variant="ghost" size="icon" onClick={props.onToggle} title="Collapse panel">
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>
      <Sessions sessions={props.sessions} value={props.selectedSessionId} onChange={props.onSelectSession} />
      <ActiveStatus
        session={props.activeSession}
        voiceId={props.config?.voiceId ?? "pq3wL6"}
        voiceStatus={props.voice.status}
        hubConnected={props.hubConnected}
      />
      <MicControls
        voice={props.voice}
        sessionId={props.selectedSessionId}
        voiceConfigured={Boolean(props.config?.elevenLabsConfigured)}
      />
      <CanvasActions sessionId={props.selectedSessionId} />
      <Transcript turns={props.transcript} sessionId={props.selectedSessionId} />
    </aside>
  );
}
