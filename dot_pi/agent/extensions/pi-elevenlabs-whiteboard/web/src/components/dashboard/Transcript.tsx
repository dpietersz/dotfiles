import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { TranscriptTurn } from "@shared/protocol";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  turns: TranscriptTurn[];
  sessionId: string | null;
}

const ROLE_STYLE: Record<string, string> = {
  user: "bg-secondary text-secondary-foreground self-end",
  assistant: "bg-primary/10 text-foreground self-start border border-primary/20",
  system: "bg-muted text-muted-foreground self-center text-xs italic",
};

export function Transcript({ turns, sessionId }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  const submit = async () => {
    const t = text.trim();
    if (!t || !sessionId || sending) return;
    setText("");
    setSending(true);
    try {
      await api.prompt(sessionId, t);
    } catch {
      /* surfaced via transcript system turn */
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-0">
        <ScrollArea className="min-h-0 flex-1 px-3">
          <div className="flex flex-col gap-2 py-2">
            {turns.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                No conversation yet. Start the mic or type below.
              </p>
            ) : (
              turns.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "max-w-[88%] rounded-lg px-3 py-1.5 text-sm leading-relaxed",
                    ROLE_STYLE[t.role] ?? ROLE_STYLE.system,
                  )}
                >
                  {t.text || (t.streaming ? "…" : "")}
                  {t.streaming ? <span className="ml-0.5 animate-pulse">▍</span> : null}
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2 border-t border-border p-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            placeholder={sessionId ? "Type a message to Pi…" : "Select a session"}
            disabled={!sessionId}
            className="h-9 flex-1 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <Button size="icon" onClick={() => void submit()} disabled={!sessionId || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
