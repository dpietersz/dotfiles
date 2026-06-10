import type { SessionInfo } from "@shared/protocol";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  sessions: SessionInfo[];
  value: string | null;
  onChange: (id: string) => void;
}

export function Sessions({ sessions, value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger aria-label="Select Pi session">
            <SelectValue placeholder={sessions.length ? "Select a session" : "No sessions"} />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      s.liveness === "live" ? "bg-aqua" : "bg-muted-foreground",
                    )}
                  />
                  <span className="truncate">{s.title}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
