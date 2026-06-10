import { useCallback, useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useHub } from "@/hooks/useHub";
import { useTheme } from "@/hooks/useTheme";
import { useElevenLabs } from "@/hooks/useElevenLabs";
import { api, type PublicConfig } from "@/lib/api";
import { LeftPane } from "@/components/dashboard/LeftPane";
import { WhiteboardCanvas } from "@/components/whiteboard/WhiteboardCanvas";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  const { theme, toggle } = useTheme();
  const renderParams = useMemo(() => new URLSearchParams(location.search), []);
  const renderSession = renderParams.get("render") ?? renderParams.get("session");
  const rawRenderScope = renderParams.get("scope");
  const renderScope = rawRenderScope === "selected" || rawRenderScope === "viewport" ? rawRenderScope : "all";

  const hub = useHub();
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const voice = useElevenLabs();

  useEffect(() => {
    api.config().then(setConfig).catch(() => undefined);
  }, []);

  // Default the selection to the hub's active session / first available.
  useEffect(() => {
    if (selected) return;
    const next = hub.activeSessionId ?? hub.sessions[0]?.id ?? null;
    if (next) setSelected(next);
  }, [hub.activeSessionId, hub.sessions, selected]);

  const onSelectSession = useCallback((id: string) => {
    setSelected(id);
    api.setActiveSession(id).catch(() => undefined);
  }, []);

  const activeSession = useMemo(
    () => hub.sessions.find((s) => s.id === selected) ?? null,
    [hub.sessions, selected],
  );

  const transcript = useMemo(() => {
    const turns = [...hub.transcript, ...voice.localTurns].filter((t) => !selected || t.sessionId === selected);
    turns.sort((a, b) => a.ts - b.ts);
    return turns;
  }, [hub.transcript, selected, voice.localTurns]);

  // Headless render mode for Playwright snapshots.
  if (renderSession) {
    return (
      <div className="h-screen w-screen">
        <WhiteboardCanvas hub={hub} sessionId={renderSession} theme={theme} renderMode renderScope={renderScope} />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-screen overflow-hidden">
        <LeftPane
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          sessions={hub.sessions}
          selectedSessionId={selected}
          onSelectSession={onSelectSession}
          activeSession={activeSession}
          voice={voice}
          config={config}
          hubConnected={hub.connected}
          transcript={transcript}
        />
        <main className="relative min-w-0 flex-1">
          <div className="absolute right-3 top-3 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          <WhiteboardCanvas hub={hub} sessionId={selected} theme={theme} />
        </main>
      </div>
    </TooltipProvider>
  );
}
