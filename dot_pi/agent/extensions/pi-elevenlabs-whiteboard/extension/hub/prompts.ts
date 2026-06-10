import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PROMPTS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "prompts");
const cache = new Map<string, string>();

/** Load a prompt template by name (without .md) and substitute {{vars}}. */
export function renderPrompt(name: string, vars: Record<string, string> = {}): string {
  let tpl = cache.get(name);
  if (tpl === undefined) {
    tpl = readFileSync(join(PROMPTS_DIR, `${name}.md`), "utf8");
    cache.set(name, tpl);
  }
  return tpl.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key: string) =>
    key in vars ? vars[key]! : "",
  );
}

/** Version tag (mtime-free, content hash short) for operability logging. */
export function promptVersion(name: string): string {
  const content = cache.get(name) ?? renderPrompt(name);
  let h = 0;
  for (let i = 0; i < content.length; i++) h = (h * 31 + content.charCodeAt(i)) | 0;
  return `${name}@${(h >>> 0).toString(16).slice(0, 8)}`;
}
