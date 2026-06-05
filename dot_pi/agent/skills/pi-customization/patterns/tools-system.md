# Pattern: Tools System

A global, dynamically-loaded custom tools framework for pi. Tools live in
`~/.pi/agent/extensions/tools/` and are auto-discovered by `index.ts`.

## File Layout

```
~/.pi/agent/extensions/tools/
├── index.ts          # Loader: discovers *.ts, calls register(), provides /tools command
├── webfetch.ts       # Tool implementation
├── webfetch.txt      # Tool description (LLM-facing, loaded into system prompt)
├── perplexity.ts     # Direct Perplexity Sonar API research tool
├── perplexity.txt    # Perplexity usage guidance
├── openai-image.ts   # OpenAI Image API generation/editing tool
├── openai-image.txt  # Image generation usage guidance
├── playwright.ts     # Compact browser automation via Playwright distrobox
├── playwright.txt    # Frontend/E2E verification guidance
```

## Adding a New Tool

1. Create `mytool.txt` — plain-text description telling the LLM what the tool does
   and when to use it. Keep it concise but specific. See `webfetch.txt` for reference.

2. Create `mytool.ts` — must export a `register(pi: ExtensionAPI)` function:

```typescript
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { truncateHead, DEFAULT_MAX_BYTES, DEFAULT_MAX_LINES, formatSize } from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Text } from "@mariozechner/pi-tui";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESCRIPTION = readFileSync(join(__dirname, "mytool.txt"), "utf8").trim();

const ParameterSchema = Type.Object({
  // Use Type.String(), Type.Number(), Type.Optional(), Type.Boolean()
  // Use StringEnum(["a", "b"] as const) for enums (Google-compatible)
  query: Type.String({ description: "..." }),
});

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "mytool",
    label: "My Tool",
    description: DESCRIPTION,
    parameters: ParameterSchema,

    async execute(toolCallId, params, signal, onUpdate, ctx) {
      // signal: AbortSignal for cancellation
      // onUpdate: stream partial results via onUpdate?.({ content: [...] })
      // ctx: ExtensionContext (ctx.cwd, ctx.ui, ctx.sessionManager, etc.)

      // Return result to LLM
      return {
        content: [{ type: "text", text: "result" }],
        details: { /* metadata for rendering & state */ },
      };
    },

    // Optional: custom TUI rendering
    renderCall(args, theme) {
      return new Text(theme.fg("toolTitle", theme.bold("mytool ")) + theme.fg("muted", args.query), 0, 0);
    },

    renderResult(result, { expanded, isPartial }, theme) {
      if (isPartial) return new Text(theme.fg("warning", "Working…"), 0, 0);
      const details = result.details as Record<string, any> | undefined;
      if (details?.error) {
        const msg = result.content?.filter((c: any) => c.type === "text").map((c: any) => c.text).join("") || "Error";
        return new Text(theme.fg("error", msg), 0, 0);
      }
      return new Text(theme.fg("success", "✓ Done"), 0, 0);
    },
  });
}
```

3. Run `/reload` in pi — the tool is immediately available.

## Key Conventions

- **Description in `.txt`**: The `.txt` file is the LLM-facing description injected into the
  system prompt. It determines when the model decides to use the tool. Write it like
  instructions to the LLM, not documentation for humans.
- **`register()` export**: The loader calls `register(pi)` — not a default export.
  This differs from standalone extensions which use `export default function`.
- **Truncate large output**: Use `truncateHead`/`truncateTail` from pi-coding-agent
  to keep output under 50KB/2000 lines. Write full output to a temp file.
- **StringEnum for enums**: Use `StringEnum` from `@mariozechner/pi-ai`, not
  `Type.Union`/`Type.Literal` (broken with Google's API).
- **renderCall/renderResult**: Optional but recommended. Without them, pi falls back
  to showing the tool name and raw text content.
- **`/tools` command**: Lists all custom tools. Registered by `index.ts`.
- **Browser tools**: Prefer compact, task-specific outputs over MCP-style full tool surfaces. Save screenshots/HARs to files and return paths; only include summaries, failures, and key controls in text output.
- **Generated media tools**: Save generated media to local files and return artifact paths by default. Only return inline `image` content behind an explicit parameter to avoid injecting large base64 blobs into context.
- **Responsive testing**: Support both viewport presets and Playwright `devices[...]` profiles. Device profiles should emulate userAgent, viewport, DPR, mobile behavior, and touch; optional overrides cover color scheme, reduced motion, locale/timezone, JavaScript, and offline state.
- **Direct API tools**: Prefer direct REST calls over MCP/offloaded agents when the tool has a simple API and a stable env var. The `perplexity` tool calls `https://api.perplexity.ai/v1/sonar` with `PERPLEXITY_API_KEY` and formats citations/search results for subagents.

## Authentication Pattern

When a tool needs credentials, read from environment variables at call time (not module
load time) so the tool fails gracefully with a clear error:

```typescript
function getCreds(): { token: string } {
  const token = process.env.MY_TOKEN;
  if (!token) throw new Error("MY_TOKEN environment variable is not set.");
  return { token };
}
```

## Reference Implementation

The live `webfetch` tool is the reference for HTTP/API tools:
- `~/.pi/agent/extensions/tools/webfetch.ts`
- `~/.pi/agent/extensions/tools/webfetch.txt`

The live `perplexity` tool is the reference for direct AI/search API tools:
- `~/.pi/agent/extensions/tools/perplexity.ts`
- `~/.pi/agent/extensions/tools/perplexity.txt`
- Reads `PERPLEXITY_API_KEY` at call time, supports Sonar modes (`search`, `ask`, `research`, `reason`), and returns answer + citations + search results.

The live `playwright` tool is the reference for context-efficient browser automation:
- `~/.pi/agent/extensions/tools/playwright.ts`
- `~/.pi/agent/extensions/tools/playwright.txt`
- Use managed distrobox commands for Linux/Bluefin, keep output compact, and return artifact paths for screenshots.

The live `openai_image` tool is the reference for generated media tools:
- `~/.pi/agent/extensions/tools/openai-image.ts`
- `~/.pi/agent/extensions/tools/openai-image.txt`
- Use direct REST calls when it avoids new dependencies, read credentials at call time, save generated files under `ctx.cwd` by default, and keep base64 out of model context unless explicitly requested.
