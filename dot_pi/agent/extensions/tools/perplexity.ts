/**
 * perplexity - Direct Perplexity Sonar API research tool
 *
 * Calls https://api.perplexity.ai/v1/sonar directly using PERPLEXITY_API_KEY.
 * No MCP, OpenCode, or Codex dependency.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import {
  truncateHead,
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  formatSize,
} from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Text } from "@mariozechner/pi-tui";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESCRIPTION = readFileSync(join(__dirname, "perplexity.txt"), "utf8").trim();

const PERPLEXITY_URL = "https://api.perplexity.ai/v1/sonar";
const DEFAULT_TIMEOUT = 120_000;
const MAX_TIMEOUT = 600_000;

const MODE_TO_MODEL = {
  search: "sonar",
  ask: "sonar-pro",
  research: "sonar-deep-research",
  reason: "sonar-reasoning-pro",
} as const;

function getApiKey(): string {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY environment variable is not set.");
  }
  return apiKey;
}

function writeTempFile(content: string): string {
  const file = join(tmpdir(), `pi-perplexity-${Date.now()}.md`);
  writeFileSync(file, content, "utf8");
  return file;
}

const ParameterSchema = Type.Object({
  query: Type.String({ description: "Research question or search query for Perplexity." }),
  mode: Type.Optional(
    StringEnum(["search", "ask", "research", "reason"] as const, {
      description:
        "Research mode. search=fast sonar, ask=sonar-pro, research=sonar-deep-research, reason=sonar-reasoning-pro. Default: ask.",
    })
  ),
  model: Type.Optional(
    StringEnum(["sonar", "sonar-pro", "sonar-deep-research", "sonar-reasoning-pro"] as const, {
      description: "Override Perplexity Sonar model.",
    })
  ),
  systemPrompt: Type.Optional(
    Type.String({
      description: "Optional system instruction for the Perplexity answer style.",
    })
  ),
  maxTokens: Type.Optional(
    Type.Number({ description: "Maximum response tokens. Default omitted; Perplexity decides." })
  ),
  temperature: Type.Optional(
    Type.Number({ description: "Sampling temperature 0-2. Default 0.2." })
  ),
  searchMode: Type.Optional(
    StringEnum(["web", "academic", "sec"] as const, {
      description: "Source type for search results. Default: web.",
    })
  ),
  searchRecency: Type.Optional(
    StringEnum(["hour", "day", "week", "month", "year"] as const, {
      description: "Optional publication recency filter.",
    })
  ),
  searchDomains: Type.Optional(
    Type.Array(Type.String(), {
      description: "Optional domains to restrict search to, e.g. ['github.com', 'docs.perplexity.ai'].",
    })
  ),
  returnRelatedQuestions: Type.Optional(
    Type.Boolean({ description: "Return related follow-up questions. Default false." })
  ),
  timeoutSec: Type.Optional(
    Type.Number({ description: "Request timeout in seconds. Default 120, max 600." })
  ),
});

type PerplexityParams = Static<typeof ParameterSchema>;

interface PerplexityResponse {
  id?: string;
  model?: string;
  choices?: Array<{ message?: { content?: string } }>;
  citations?: string[] | null;
  search_results?: Array<{
    title?: string;
    url?: string;
    date?: string;
    last_updated?: string;
    snippet?: string;
    source?: string;
  }> | null;
  related_questions?: string[] | null;
  usage?: Record<string, any>;
}

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "perplexity",
    label: "Perplexity",
    description: DESCRIPTION,
    parameters: ParameterSchema,

    async execute(_toolCallId: string, params: PerplexityParams, signal?: AbortSignal) {
      const apiKey = getApiKey();
      const mode = (params.mode ?? "ask") as keyof typeof MODE_TO_MODEL;
      const model = params.model ?? MODE_TO_MODEL[mode];
      const timeout = Math.min((params.timeoutSec ?? DEFAULT_TIMEOUT / 1000) * 1000, MAX_TIMEOUT);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      if (signal) signal.addEventListener("abort", () => controller.abort());

      const messages = [];
      if (params.systemPrompt) {
        messages.push({ role: "system", content: params.systemPrompt });
      }
      messages.push({ role: "user", content: params.query });

      const webSearchOptions: Record<string, any> = {};
      if (params.searchMode) webSearchOptions.search_mode = params.searchMode;
      if (params.searchRecency) webSearchOptions.search_recency_filter = params.searchRecency;
      if (params.searchDomains?.length) webSearchOptions.search_domain_filter = params.searchDomains;

      const body: Record<string, any> = {
        model,
        messages,
        temperature: params.temperature ?? 0.2,
        return_related_questions: params.returnRelatedQuestions ?? false,
      };
      if (params.maxTokens) body.max_tokens = params.maxTokens;
      if (Object.keys(webSearchOptions).length > 0) body.web_search_options = webSearchOptions;

      try {
        const response = await fetch(PERPLEXITY_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text().catch(() => "");
          return {
            content: [{ type: "text", text: `Perplexity API failed (${response.status}): ${errorBody}` }],
            details: { error: true, status: response.status, model, mode },
            isError: true,
          };
        }

        const data = (await response.json()) as PerplexityResponse;
        return formatResult(params.query, mode, model, data);
      } catch (err) {
        clearTimeout(timeoutId);
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Perplexity request failed: ${message}` }],
          details: { error: true, model, mode },
          isError: true,
        };
      }
    },

    renderCall(args: any, theme: any) {
      const mode = args.mode ?? "ask";
      const query = args.query ?? "";
      return new Text(
        theme.fg("toolTitle", theme.bold("perplexity ")) +
          theme.fg("muted", `${mode}: ${String(query).slice(0, 90)}`),
        0,
        0
      );
    },

    renderResult(result: any, { expanded, isPartial }: any, theme: any) {
      if (isPartial) return new Text(theme.fg("warning", "Searching Perplexity…"), 0, 0);
      const details = result.details as Record<string, any> | undefined;
      if (details?.error) {
        const msg = result.content?.filter((c: any) => c.type === "text").map((c: any) => c.text).join("") || "Error";
        return new Text(theme.fg("error", msg), 0, 0);
      }
      let text = theme.fg("success", `✓ Perplexity ${details?.mode ?? ""} (${details?.model ?? "unknown"})`);
      if (details?.citations) text += theme.fg("muted", ` · ${details.citations} citations`);
      if (expanded) {
        const content = result.content?.filter((c: any) => c.type === "text").map((c: any) => c.text).join("") ?? "";
        text += "\n" + theme.fg("dim", content.split("\n").slice(0, 30).join("\n"));
      }
      return new Text(text, 0, 0);
    },
  });
}

function formatResult(query: string, mode: string, model: string, data: PerplexityResponse) {
  const answer = data.choices?.[0]?.message?.content ?? "No answer returned.";
  const citations = data.citations ?? [];
  const searchResults = data.search_results ?? [];
  const related = data.related_questions ?? [];

  let output = `# Perplexity Research: ${query}\n\n`;
  output += `Model: ${model} (${mode})\n\n`;
  output += `## Answer\n${answer}\n\n`;

  if (citations.length > 0) {
    output += `## Citations\n`;
    citations.forEach((url, i) => {
      output += `${i + 1}. ${url}\n`;
    });
    output += "\n";
  }

  if (searchResults.length > 0) {
    output += `## Search Results\n`;
    searchResults.slice(0, 20).forEach((result, i) => {
      output += `${i + 1}. ${result.title ?? "Untitled"}`;
      if (result.url) output += ` — ${result.url}`;
      if (result.date) output += ` (${result.date})`;
      output += "\n";
      if (result.snippet) output += `   ${result.snippet}\n`;
    });
    output += "\n";
  }

  if (related.length > 0) {
    output += `## Related Questions\n`;
    related.forEach((question) => {
      output += `- ${question}\n`;
    });
    output += "\n";
  }

  if (data.usage) {
    output += `## Usage\n\`\`\`json\n${JSON.stringify(data.usage, null, 2)}\n\`\`\`\n`;
  }

  const truncation = truncateHead(output, {
    maxLines: DEFAULT_MAX_LINES,
    maxBytes: DEFAULT_MAX_BYTES,
  });

  let text = truncation.content;
  if (truncation.truncated) {
    const tempFile = writeTempFile(output);
    text += `\n\n[Output truncated: ${truncation.outputLines} of ${truncation.totalLines} lines`;
    text += ` (${formatSize(truncation.outputBytes)} of ${formatSize(truncation.totalBytes)}).`;
    text += ` Full output saved to: ${tempFile}]`;
  }

  return {
    content: [{ type: "text", text }],
    details: {
      query,
      mode,
      model,
      citations: citations.length,
      searchResults: searchResults.length,
      relatedQuestions: related.length,
      truncated: truncation.truncated,
      usage: data.usage,
    },
  };
}
