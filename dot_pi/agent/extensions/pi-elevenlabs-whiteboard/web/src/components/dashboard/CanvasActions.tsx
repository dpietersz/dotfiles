import { useRef, useState } from "react";
import { Download, FileUp, ImageDown, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  sessionId: string | null;
}

export function CanvasActions({ sessionId }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>("");
  const disabled = !sessionId;

  async function exportScene() {
    if (!sessionId) return;
    const wb = await api.whiteboard(sessionId);
    const blob = new Blob([JSON.stringify(wb.scene, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pi-whiteboard-${sessionId}-${wb.revisionId}.excalidraw`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus(`exported ${wb.revisionId}`);
  }

  async function importScene(file: File) {
    if (!sessionId) return;
    const text = await file.text();
    const scene = JSON.parse(text) as unknown;
    await api.importWhiteboard(sessionId, scene);
    setStatus("imported scene");
  }

  async function cleanup() {
    if (!sessionId) return;
    const wb = await api.whiteboard(sessionId);
    const result = await api.cleanupWhiteboard(sessionId, wb.revisionId);
    setStatus(`cleaned ${result.removed} stale element(s)`);
  }

  async function snapshot() {
    if (!sessionId) return;
    const result = await api.snapshot(sessionId, "all");
    setStatus(result.available ? `snapshot via ${result.via}${result.path ? `: ${result.path}` : ""}` : `snapshot failed: ${result.error}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canvas actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept=".excalidraw,application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.currentTarget.value = "";
            if (file) importScene(file).catch((err) => setStatus(err instanceof Error ? err.message : String(err)));
          }}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" disabled={disabled} onClick={() => exportScene().catch((err) => setStatus(err instanceof Error ? err.message : String(err)))}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" disabled={disabled} onClick={() => inputRef.current?.click()}>
            <FileUp className="h-4 w-4" /> Import
          </Button>
          <Button variant="outline" size="sm" disabled={disabled} onClick={() => cleanup().catch((err) => setStatus(err instanceof Error ? err.message : String(err)))}>
            <Sparkles className="h-4 w-4" /> Cleanup
          </Button>
          <Button variant="outline" size="sm" disabled={disabled} onClick={() => snapshot().catch((err) => setStatus(err instanceof Error ? err.message : String(err)))}>
            <ImageDown className="h-4 w-4" /> Snapshot
          </Button>
        </div>
        {status ? <p className="break-words text-[11px] text-muted-foreground">{status}</p> : null}
      </CardContent>
    </Card>
  );
}
