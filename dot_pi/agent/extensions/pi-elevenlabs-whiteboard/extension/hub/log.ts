import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export interface LoggerOptions {
  /** Minimum level to emit. */
  level?: LogLevel;
  /** Optional file to append structured JSON lines to. */
  file?: string;
  /** Literal secret strings to redact from all messages. */
  secrets?: string[];
  /** Sink for emitted (already redacted) lines. Defaults to console. */
  onLine?: (level: LogLevel, line: string) => void;
}

export class Logger {
  private level: LogLevel;
  private file?: string;
  private secrets: string[];
  private onLine?: (level: LogLevel, line: string) => void;

  constructor(opts: LoggerOptions = {}) {
    this.level = opts.level ?? "info";
    this.file = opts.file;
    this.secrets = (opts.secrets ?? []).filter((s) => s.length >= 4);
    this.onLine = opts.onLine;
    if (this.file) {
      try {
        mkdirSync(dirname(this.file), { recursive: true });
      } catch {
        /* ignore */
      }
    }
  }

  setSecrets(secrets: string[]): void {
    this.secrets = secrets.filter((s) => s.length >= 4);
  }

  private redact(input: string): string {
    let out = input;
    for (const s of this.secrets) {
      if (!s) continue;
      out = out.split(s).join("«redacted»");
    }
    return out;
  }

  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.level]) return;
    const safeMsg = this.redact(message);
    const record: Record<string, unknown> = {
      ts: new Date().toISOString(),
      level,
      msg: safeMsg,
    };
    if (fields) {
      for (const [k, v] of Object.entries(fields)) {
        record[k] = typeof v === "string" ? this.redact(v) : v;
      }
    }
    const line = JSON.stringify(record);
    if (this.onLine) {
      this.onLine(level, line);
    } else {
      const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
      stream.write(line + "\n");
    }
    if (this.file) {
      try {
        appendFileSync(this.file, line + "\n");
      } catch {
        /* best effort */
      }
    }
  }

  debug(msg: string, fields?: Record<string, unknown>) {
    this.log("debug", msg, fields);
  }
  info(msg: string, fields?: Record<string, unknown>) {
    this.log("info", msg, fields);
  }
  warn(msg: string, fields?: Record<string, unknown>) {
    this.log("warn", msg, fields);
  }
  error(msg: string, fields?: Record<string, unknown>) {
    this.log("error", msg, fields);
  }
}
