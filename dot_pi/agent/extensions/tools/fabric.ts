/**
 * Fabric AI Pattern Tools
 *
 * Dynamically registers tools for patterns, sources, and pipelines
 * defined in fabric-patterns.json.
 *
 * Building blocks:
 *   - Patterns:  f_[name] — run a single Fabric pattern via /chat
 *   - Sources:   not exposed as tools directly, used inside pipelines
 *
 * Pipelines:
 *   - fp_[name] — chain sources and patterns together
 *     e.g. fp_yt_summary = youtube_transcript → youtube_summary
 *
 * Config: fabric-patterns.json (patterns, sources, pipelines, default model)
 * Auth:   FABRIC_API_KEY environment variable
 * API:    https://fabric.pietersz.me
 *
 * Commands:
 *   /fabric — manage patterns, pipelines, and settings
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import {
  truncateHead,
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  formatSize,
  DynamicBorder,
} from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { Text, Container, SelectList, Key, matchesKey, type SelectItem, type Component, type TUI } from "@mariozechner/pi-tui";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FABRIC_API_URL = "https://fabric.pietersz.me";
const CONFIG_PATH = join(__dirname, "fabric-patterns.json");
const DESCRIPTION = readFileSync(join(__dirname, "fabric.txt"), "utf8").trim();

// ── Types ──

interface SourceConfig {
  endpoint: string;
  bodyKey: string;
  resultKey: string;
  description: string;
  extraBody?: Record<string, any>;
  baseUrl?: string;
  authHeaders?: Record<string, string>;
}

interface PipelineStep {
  source?: string;
  pattern?: string;
}

interface PipelineConfig {
  description: string;
  inputDescription?: string;
  steps: PipelineStep[];
}

interface FabricConfig {
  defaultModel: string;
  patterns: string[];
  sources: Record<string, SourceConfig>;
  pipelines: Record<string, PipelineConfig>;
}

// ── Pattern descriptions (from upstream pattern_explanations.md) ──

const PATTERN_DESCRIPTIONS: Record<string, string> = {
  youtube_summary:
    "Create concise, timestamped YouTube video summaries that highlight key points.",
  extract_wisdom:
    "Extract surprising, insightful, and interesting information from text on topics like human flourishing, AI, learning, and more.",
  extract_wisdom_agents:
    "Extract valuable insights, ideas, quotes, and references from content, emphasizing topics like human flourishing, AI, learning, and technology.",
  extract_main_activities:
    "Extract key events and activities from transcripts or logs, providing a summary of what happened.",
  extract_patterns:
    "Extract and analyze recurring, surprising, and insightful patterns from input, providing detailed analysis and advice for builders.",
  extract_article_wisdom:
    "Extract surprising, insightful information from written articles, categorizing into summary, ideas, quotes, facts, references, and recommendations.",
  extract_recommendations:
    "Extract concise, practical recommendations from content in a bulleted list.",
  summarize:
    "Summarize content into a 20-word sentence, main points, and takeaways in Markdown.",
  summarize_git_diff:
    "Summarize and organize Git diff changes with clear, succinct commit messages and bullet points.",
  summarize_git_changes:
    "Summarize recent project updates from the last 7 days, focusing on key changes with enthusiasm.",
  summarize_paper:
    "Summarize an academic paper with technical approach, results, advantages, limitations, and conclusion.",
  create_summary:
    "Summarize content into a 20-word sentence, 10 main points, and 5 key takeaways in Markdown.",
  sanitize_broken_html_to_markdown:
    "Convert messy HTML into clean, properly formatted Markdown, applying custom styling and ensuring compatibility.",
  convert_to_markdown:
    "Convert content to clean, complete Markdown format, preserving all original structure, formatting, links, and code blocks without alterations.",
  review_design:
    "Review and analyze architecture design, focusing on clarity, component design, system integrations, security, performance, scalability, and data management.",
  review_code:
    "Perform a comprehensive code review with detailed feedback on correctness, security, and performance.",
  refine_design_document:
    "Refine a design document based on a design review by analyzing, mapping concepts, and implementing changes using valid Markdown.",
  create_prd:
    "Create a precise Product Requirements Document (PRD) in Markdown based on input.",
  create_pattern:
    "Extract, organize, and format LLM/AI prompts into structured sections, detailing the AI's role, instructions, output format, and examples.",
  create_mermaid_visualization_for_github:
    "Create standalone, detailed visualizations using Mermaid (Markdown) syntax optimized for GitHub rendering.",
  create_mermaid_visualization:
    "Create detailed, standalone visualizations of concepts using Mermaid (Markdown) syntax, ensuring clarity and coherence.",
  create_design_document:
    "Create a detailed design document for a system using the C4 model, addressing business and security postures.",
  create_coding_feature:
    "Generate secure and composable code features using modern technology and best practices from project specifications.",
  create_user_story:
    "Write concise and clear technical user stories for new features in complex software programs.",
  create_stride_threat_model:
    "Create a STRIDE-based threat model for a system design, identifying assets, trust boundaries, data flows, and prioritizing threats with mitigations.",
  analyze_mistakes:
    "Analyze past mistakes in thinking patterns, map them to current beliefs, and offer recommendations to improve accuracy in predictions.",
  explain_code:
    "Explain code, security tool output, configuration text, and answer questions based on the provided input.",
  explain_terms:
    "Produce a glossary of advanced terms from content, providing a definition, analogy, and explanation of why each term matters.",
  improve_writing:
    "Refine text by correcting grammar, enhancing style, improving clarity, and maintaining the original meaning.",
  improve_prompt:
    "Improve an LLM/AI prompt by applying expert prompt writing strategies for better results and clarity.",
  generate_code_rules:
    "Compile best-practice coding rules and guardrails for AI-assisted development workflows from provided content.",
  "write_pull-request":
    "Draft detailed pull request descriptions explaining changes, providing reasoning, and identifying potential bugs from git diff output.",
  to_flashcards:
    "Create Anki flashcards from text with concise, optimized questions and answers.",
  create_git_diff_commit:
    "Generate Git commands and conventional commit messages for reflecting changes in a repository.",
  "summarize_pull-requests":
    "Summarize pull requests with human-readable descriptions of changes.",
  extract_instructions:
    "Extract clear, actionable step-by-step instructions from instructional video transcripts or technical tutorials.",
};

// ── Vendor detection ──

/** Auto-detect vendor from model name per Fabric API requirement */
function detectVendor(model: string): string {
  const m = model.toLowerCase();
  if (m.includes("claude") || m.includes("anthropic")) return "anthropic";
  if (m.includes("gemini") || m.includes("gemma")) return "gemini";
  if (m.includes("gpt") || m.includes("o1") || m.includes("o3") || m.includes("o4") || m.startsWith("ft:")) return "openai";
  if (m.includes("llama") || m.includes("mistral") || m.includes("mixtral") || m.includes("codellama")) return "ollama";
  // Default to openai as safest fallback
  return "openai";
}

// ── Helpers ──

function loadConfig(): FabricConfig {
  const raw = readFileSync(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw);
  return {
    defaultModel: parsed.defaultModel ?? "gemini-2.5-flash",
    patterns: parsed.patterns ?? [],
    sources: parsed.sources ?? {},
    pipelines: parsed.pipelines ?? {},
  } as FabricConfig;
}

function saveConfig(config: FabricConfig): void {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf8");
}

function getApiKey(): string {
  const key = process.env.FABRIC_API_KEY;
  if (!key) throw new Error("FABRIC_API_KEY environment variable is not set.");
  return key;
}

function writeTempFile(content: string): string {
  const file = join(tmpdir(), `pi-fabric-${Date.now()}.md`);
  writeFileSync(file, content, "utf8");
  return file;
}

function truncateResult(content: string): {
  content: Array<{ type: string; text: string }>;
  details: { lines: number; bytes: number; truncated: boolean };
} {
  const totalLines = content.split("\n").length;
  const totalBytes = Buffer.byteLength(content, "utf8");

  const truncation = truncateHead(content, {
    maxLines: DEFAULT_MAX_LINES,
    maxBytes: DEFAULT_MAX_BYTES,
  });

  let output = truncation.content;

  if (truncation.truncated) {
    const tempFile = writeTempFile(content);
    output += `\n\n[Output truncated: ${truncation.outputLines} of ${truncation.totalLines} lines`;
    output += ` (${formatSize(truncation.outputBytes)} of ${formatSize(truncation.totalBytes)}).`;
    output += ` Full output saved to: ${tempFile}]`;
  }

  return {
    content: [{ type: "text", text: output }],
    details: {
      lines: totalLines,
      bytes: totalBytes,
      truncated: truncation.truncated,
    },
  };
}

function makeAbortable(signal?: AbortSignal, timeoutMs = 120_000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }
  return { controller, timeoutId };
}

// ── SSE parsing ──

/**
 * Parse Server-Sent Events response from Fabric /chat endpoint.
 * The stream contains multiple `data: {...}` lines:
 *   - type "content": response chunk (concatenate all)
 *   - type "error":   error message (throw)
 *   - type "complete": stream finished
 */
function parseSSE(raw: string): string {
  const parts: string[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data: ")) continue;
    try {
      const data = JSON.parse(trimmed.slice(6));
      if (data.type === "error") {
        throw new Error(data.content || "Unknown Fabric API error");
      }
      if (data.type === "content" && data.content) {
        parts.push(data.content);
      }
    } catch (err: any) {
      // Re-throw Fabric errors, skip malformed JSON
      if (err.message && !err.message.startsWith("Unexpected")) throw err;
    }
  }
  return parts.join("");
}

// ── API calls ──

/** Run a source: fetch data from a Fabric endpoint (e.g. /youtube/transcript) */
async function runSource(
  source: SourceConfig,
  input: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<string> {
  const { controller, timeoutId } = makeAbortable(signal);

  try {
    const body: Record<string, any> = { [source.bodyKey]: input };
    // Merge any extra body params defined in the source config
    if (source.extraBody) {
      Object.assign(body, source.extraBody);
    }

    const baseUrl = source.baseUrl ?? FABRIC_API_URL;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // Resolve auth headers (values starting with $ are env var references)
    if (source.authHeaders) {
      for (const [key, value] of Object.entries(source.authHeaders)) {
        headers[key] = value.startsWith("$") ? (process.env[value.slice(1)] ?? "") : value;
      }
    }
    // Only add Fabric API key for Fabric endpoints
    if (!source.baseUrl) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(`${baseUrl}${source.endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      throw new Error(`Source ${source.endpoint} failed (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const result = data[source.resultKey];
    if (!result) {
      throw new Error(
        `Source ${source.endpoint} returned no '${source.resultKey}' field. Keys: ${Object.keys(data).join(", ")}`
      );
    }

    // For YouTube sources, prepend title/description as context if available
    if (data.title || data.description) {
      const meta: string[] = [];
      if (data.title) meta.push(`Title: ${data.title}`);
      if (data.description) meta.push(`Description: ${data.description}`);
      return `${meta.join("\n")}\n\nTranscript:\n${result}`;
    }

    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Run a pattern: send text to Fabric /chat endpoint.
 * Uses SSE streaming response format per the Fabric REST API spec.
 * Includes vendor auto-detection and proper chat options.
 */
async function runPattern(
  patternName: string,
  input: string,
  model: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<string> {
  const { controller, timeoutId } = makeAbortable(signal);
  const vendor = detectVendor(model);

  try {
    const response = await fetch(`${FABRIC_API_URL}/chat`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompts: [{
          userInput: input,
          vendor,
          model,
          patternName,
        }],
        temperature: 0.7,
        topP: 0.9,
        frequencyPenalty: 0,
        presencePenalty: 0,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Pattern '${patternName}' failed (${response.status}): ${body}`);
    }

    const raw = await response.text();
    return parseSSE(raw);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Execute a pipeline: chain sources and patterns, piping output → input */
async function runPipeline(
  pipeline: PipelineConfig,
  input: string,
  model: string,
  config: FabricConfig,
  apiKey: string,
  signal?: AbortSignal,
  onStep?: (stepIndex: number, stepLabel: string) => void
): Promise<string> {
  let data = input;

  for (let i = 0; i < pipeline.steps.length; i++) {
    const step = pipeline.steps[i];

    if (step.source) {
      const sourceConfig = config.sources[step.source];
      if (!sourceConfig) throw new Error(`Unknown source: '${step.source}'`);
      onStep?.(i, `source:${step.source}`);
      data = await runSource(sourceConfig, data, apiKey, signal);
    } else if (step.pattern) {
      onStep?.(i, `pattern:${step.pattern}`);
      data = await runPattern(step.pattern, data, model, apiKey, signal);
    } else {
      throw new Error(`Pipeline step ${i} has neither 'source' nor 'pattern'`);
    }
  }

  return data;
}

// ── Tool rendering helpers ──

function renderToolCall(label: string, args: any, theme: any) {
  let text = theme.fg("toolTitle", theme.bold(`${label} `));
  const inputPreview = (args.input ?? "").slice(0, 80);
  text += theme.fg("muted", inputPreview);
  if (args.input && args.input.length > 80) text += theme.fg("dim", "…");
  if (args.model) text += theme.fg("dim", ` (${args.model})`);
  return new Text(text, 0, 0);
}

function renderToolResult(label: string, result: any, expanded: boolean, isPartial: boolean, theme: any) {
  if (isPartial) {
    return new Text(theme.fg("warning", `Running ${label}…`), 0, 0);
  }

  const details = result.details as Record<string, any> | undefined;

  if (details?.error) {
    const errorText =
      result.content
        ?.filter((c: any) => c.type === "text")
        .map((c: any) => c.text)
        .join("") || "Unknown error";
    return new Text(theme.fg("error", errorText), 0, 0);
  }

  const lines = details?.lines || 0;
  const bytes = details?.bytes || 0;
  const truncated = details?.truncated || false;
  const steps = details?.steps;

  let text = theme.fg("success", "✓ ");
  text += theme.fg("muted", label);
  if (steps) text += theme.fg("dim", ` (${steps} steps, `);
  else text += theme.fg("dim", ` (`);
  text += theme.fg("dim", `${lines} lines, ${formatSize(bytes)})`);
  if (truncated) text += theme.fg("warning", " [truncated]");

  if (expanded) {
    const content = result.content
      ?.filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("");
    if (content) {
      const preview = content.split("\n").slice(0, 40).join("\n");
      text += "\n" + theme.fg("dim", preview);
      if (content.split("\n").length > 40) {
        text += "\n" + theme.fg("warning", `... (${content.split("\n").length - 40} more lines)`);
      }
    }
  }

  return new Text(text, 0, 0);
}

function makeErrorResult(message: string, extra: Record<string, any> = {}) {
  return {
    content: [{ type: "text", text: message }],
    details: { error: true, ...extra },
    isError: true,
  };
}

// ── Unified pattern tool ──

function registerUnifiedPatternTool(pi: ExtensionAPI, patterns: string[], defaultModel: string): void {
  // Build description with all pattern names and their descriptions
  const patternList = patterns
    .map((p) => `- ${p}: ${PATTERN_DESCRIPTIONS[p] ?? "No description"}`)
    .join("\n");

  const desc = `Run a Fabric AI pattern on text input. Available patterns:\n${patternList}`;

  const ParameterSchema = Type.Object({
    pattern: Type.String({ description: "Pattern name to run." }),
    input: Type.String({ description: "The text content to process." }),
    model: Type.Optional(
      Type.String({
        description: `LLM model to use. Defaults to "${defaultModel}".`,
      })
    ),
  });

  pi.registerTool({
    name: "fabric",
    label: "Fabric Pattern",
    description: desc,
    parameters: ParameterSchema,

    async execute(toolCallId, params, signal, onUpdate, ctx) {
      const pattern = params.pattern;
      if (!patterns.includes(pattern)) {
        return makeErrorResult(`Unknown pattern '${pattern}'. Available: ${patterns.join(", ")}`, { pattern });
      }
      try {
        const apiKey = getApiKey();
        const model = params.model ?? defaultModel;
        const result = await runPattern(pattern, params.input, model, apiKey, signal);
        const formatted = truncateResult(result);
        return {
          ...formatted,
          details: { pattern, ...formatted.details },
        };
      } catch (err: any) {
        if (err.name === "AbortError") {
          return makeErrorResult(`Fabric request timed out for pattern '${pattern}'.`, { pattern, timeout: true });
        }
        return makeErrorResult(`Fabric error: ${err.message}`, { pattern });
      }
    },

    renderCall(args, theme) {
      return renderToolCall(`fabric:${args.pattern ?? "?"}`, args, theme);
    },

    renderResult(result, { expanded, isPartial }, theme) {
      const pattern = (result as any)?.details?.pattern ?? "pattern";
      return renderToolResult(pattern, result, expanded, isPartial, theme);
    },
  });
}

// ── Unified pipeline tool ──

function registerUnifiedPipelineTool(
  pi: ExtensionAPI,
  config: FabricConfig
): void {
  const pipelineEntries = Object.entries(config.pipelines);
  if (pipelineEntries.length === 0) return;

  // Build description with all pipeline names, descriptions, and steps
  const pipelineList = pipelineEntries
    .map(([name, p]) => {
      const steps = p.steps.map((s) => s.source ?? s.pattern).join(" → ");
      return `- ${name}: ${p.description} (${steps})`;
    })
    .join("\n");

  const desc = `Run a Fabric pipeline (chained sources and patterns). Available pipelines:\n${pipelineList}`;

  const ParameterSchema = Type.Object({
    pipeline: Type.String({ description: "Pipeline name to run." }),
    input: Type.String({ description: "The input to process (e.g. YouTube URL, HTML content, text)." }),
    model: Type.Optional(
      Type.String({
        description: `LLM model for pattern steps. Defaults to "${config.defaultModel}".`,
      })
    ),
  });

  const pipelineNames = pipelineEntries.map(([name]) => name);

  pi.registerTool({
    name: "fabric_pipeline",
    label: "Fabric Pipeline",
    description: desc,
    parameters: ParameterSchema,

    async execute(toolCallId, params, signal, onUpdate, ctx) {
      const name = params.pipeline;
      const pipeline = config.pipelines[name];
      if (!pipeline) {
        return makeErrorResult(`Unknown pipeline '${name}'. Available: ${pipelineNames.join(", ")}`, { pipeline: name });
      }
      try {
        const apiKey = getApiKey();
        const model = params.model ?? config.defaultModel;

        const result = await runPipeline(
          pipeline,
          params.input,
          model,
          config,
          apiKey,
          signal,
          (stepIdx, stepLabel) => {
            onUpdate?.({
              content: [{ type: "text", text: `Step ${stepIdx + 1}/${pipeline.steps.length}: ${stepLabel}\u2026` }],
            });
          }
        );

        const formatted = truncateResult(result);
        return {
          ...formatted,
          details: { pipeline: name, steps: pipeline.steps.length, ...formatted.details },
        };
      } catch (err: any) {
        if (err.name === "AbortError") {
          return makeErrorResult(`Pipeline '${name}' timed out.`, { pipeline: name, timeout: true });
        }
        return makeErrorResult(`Pipeline '${name}' error: ${err.message}`, { pipeline: name });
      }
    },

    renderCall(args, theme) {
      let text = theme.fg("toolTitle", theme.bold(`fabric_pipeline:${args.pipeline ?? "?"} `));
      const inputPreview = (args.input ?? "").slice(0, 80);
      text += theme.fg("muted", inputPreview);
      if (args.input && args.input.length > 80) text += theme.fg("dim", "…");
      if (args.model) text += theme.fg("dim", ` (${args.model})`);
      return new Text(text, 0, 0);
    },

    renderResult(result, { expanded, isPartial }, theme) {
      const name = (result as any)?.details?.pipeline ?? "pipeline";
      return renderToolResult(`${name} pipeline`, result, expanded, isPartial, theme);
    },
  });
}

// ── Styled list view ──

interface FabricListItem {
  name: string;
  description: string;
  detail?: string; // e.g. pipeline steps or endpoint
}

interface FabricListViewOptions {
  title: string;
  subtitle?: string;
  items: FabricListItem[];
  emptyMessage: string;
}

class FabricListView implements Component {
  private tui: TUI;
  private theme: any;
  private onDone: () => void;
  private options: FabricListViewOptions;
  private container: Container;
  private body: Text;
  private scrollOffset = 0;
  private cachedWidth?: number;
  private visibleLines = 0;
  private totalLines = 0;

  constructor(tui: TUI, theme: any, onDone: () => void, options: FabricListViewOptions) {
    this.tui = tui;
    this.theme = theme;
    this.onDone = onDone;
    this.options = options;

    this.container = new Container();
    this.container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));

    const titleLine =
      theme.fg("accent", theme.bold(` ${options.title}`)) +
      (options.subtitle ? theme.fg("dim", `  ${options.subtitle}`) : "");
    this.container.addChild(new Text(titleLine, 0, 0));
    this.container.addChild(new Text("", 0, 0));

    this.body = new Text("", 1, 0);
    this.container.addChild(this.body);

    this.container.addChild(new Text("", 0, 0));
    this.container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));
  }

  private rebuild(width: number): void {
    const { theme, options } = this;
    const muted = (s: string) => theme.fg("muted", s);
    const dim = (s: string) => theme.fg("dim", s);
    const text = (s: string) => theme.fg("text", s);
    const accent = (s: string) => theme.fg("accent", s);

    if (options.items.length === 0) {
      this.body.setText(muted(options.emptyMessage));
      this.totalLines = 1;
      this.cachedWidth = width;
      return;
    }

    const allLines: string[] = [];

    for (const item of options.items) {
      allLines.push(accent("  ●") + " " + text(theme.bold(item.name)));
      allLines.push("    " + muted(item.description));
      if (item.detail) {
        allLines.push("    " + dim(item.detail));
      }
      allLines.push("");
    }

    // Remove trailing empty line
    if (allLines.length > 0 && allLines[allLines.length - 1] === "") {
      allLines.pop();
    }

    this.totalLines = allLines.length;
    // Reserve lines for header (border + title + blank) and footer (blank + border)
    // Use a generous visible area
    this.visibleLines = Math.max(5, Math.min(this.totalLines, 30));

    const visible = allLines.slice(this.scrollOffset, this.scrollOffset + this.visibleLines);

    const lines = [...visible];

    if (this.totalLines > this.visibleLines) {
      lines.push("");
      const pos = this.scrollOffset + 1;
      const max = Math.max(1, this.totalLines - this.visibleLines + 1);
      lines.push(dim(`  ↑↓/jk scroll · g/G top/bottom · ${pos}/${max}`) + "  " + muted("Esc/q to close"));
    } else {
      lines.push("");
      lines.push(muted("  Esc/q to close"));
    }

    this.body.setText(lines.join("\n"));
    this.cachedWidth = width;
  }

  handleInput(data: string): void {
    if (
      matchesKey(data, Key.escape) ||
      matchesKey(data, Key.ctrl("c")) ||
      data.toLowerCase() === "q" ||
      data === "\r"
    ) {
      this.onDone();
      return;
    }

    const maxScroll = Math.max(0, this.totalLines - this.visibleLines);

    if (matchesKey(data, Key.up) || data === "k") {
      if (this.scrollOffset > 0) {
        this.scrollOffset--;
        this.cachedWidth = undefined;
        this.container.invalidate();
        this.tui.requestRender();
      }
      return;
    }
    if (matchesKey(data, Key.down) || data === "j") {
      if (this.scrollOffset < maxScroll) {
        this.scrollOffset++;
        this.cachedWidth = undefined;
        this.container.invalidate();
        this.tui.requestRender();
      }
      return;
    }
    // Page up/down via g/G (top/bottom)
    if (data === "g") {
      this.scrollOffset = 0;
      this.cachedWidth = undefined;
      this.container.invalidate();
      this.tui.requestRender();
      return;
    }
    if (data === "G") {
      this.scrollOffset = maxScroll;
      this.cachedWidth = undefined;
      this.container.invalidate();
      this.tui.requestRender();
      return;
    }
  }

  invalidate(): void {
    this.container.invalidate();
    this.cachedWidth = undefined;
  }

  render(width: number): string[] {
    if (this.cachedWidth !== width) this.rebuild(width);
    return this.container.render(width);
  }
}

// ── /fabric command ──

function registerFabricCommand(pi: ExtensionAPI) {
  pi.registerCommand("fabric", {
    description: "Manage Fabric pattern tools, pipelines, and settings",
    handler: async (args, ctx) => {
      if (!ctx.hasUI) {
        ctx.ui.notify("Fabric command requires interactive mode", "error");
        return;
      }

      const config = loadConfig();
      const pipelineCount = Object.keys(config.pipelines).length;
      const sourceCount = Object.keys(config.sources).length;

      const actions: SelectItem[] = [
        {
          value: "list_patterns",
          label: "List active patterns",
          description: `${config.patterns.length} patterns via fabric(pattern, input)`,
        },
        {
          value: "list_pipelines",
          label: "List active pipelines",
          description: `${pipelineCount} pipelines via fabric_pipeline(pipeline, input)`,
        },
        {
          value: "list_sources",
          label: "List available sources",
          description: `${sourceCount} sources (building blocks for pipelines)`,
        },
        {
          value: "add_pattern",
          label: "Add a pattern",
          description: "Add a Fabric pattern to the fabric tool",
        },
        {
          value: "remove_pattern",
          label: "Remove a pattern",
          description: "Remove a pattern from the fabric tool",
        },
        {
          value: "add_pipeline",
          label: "Add a pipeline",
          description: "Create a new pipeline combining sources and patterns",
        },
        {
          value: "remove_pipeline",
          label: "Remove a pipeline",
          description: "Remove a pipeline from active tools",
        },
        {
          value: "model",
          label: "Change default model",
          description: `Current: ${config.defaultModel}`,
        },
      ];

      const action = await ctx.ui.custom<string | null>((tui, theme, _kb, done) => {
        const container = new Container();
        container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));
        container.addChild(
          new Text(
            theme.fg("accent", theme.bold(" Fabric")) +
            theme.fg("dim", `  ${config.patterns.length} patterns · ${pipelineCount} pipelines · ${sourceCount} sources`),
            0, 0,
          )
        );
        container.addChild(new Text("", 0, 0));

        const selectList = new SelectList(actions, 10, {
          selectedPrefix: (text) => theme.fg("accent", text),
          selectedText: (text) => theme.fg("accent", text),
          description: (text) => theme.fg("muted", text),
          scrollInfo: (text) => theme.fg("dim", text),
          noMatch: (text) => theme.fg("warning", text),
        });

        selectList.onSelect = (item) => done(item.value as string);
        selectList.onCancel = () => done(null);

        container.addChild(selectList);
        container.addChild(new Text("", 0, 0));
        container.addChild(new Text(theme.fg("dim", "  Esc to close"), 0, 0));
        container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));

        return {
          render(width: number) { return container.render(width); },
          invalidate() { container.invalidate(); },
          handleInput(data: string) { selectList.handleInput(data); tui.requestRender(); },
        };
      });

      if (!action) return;

      // ── List patterns ──
      if (action === "list_patterns") {
        await ctx.ui.custom<void>((tui, theme, _kb, done) => {
          return new FabricListView(tui, theme, done, {
            title: "Patterns",
            subtitle: `${config.patterns.length} active · model: ${config.defaultModel}`,
            items: config.patterns.map((p) => ({
              name: p,
              description: PATTERN_DESCRIPTIONS[p] ?? "No description available",
            })),
            emptyMessage: "No patterns configured.",
          });
        });
        return;
      }

      // ── List pipelines ──
      if (action === "list_pipelines") {
        const entries = Object.entries(config.pipelines);
        await ctx.ui.custom<void>((tui, theme, _kb, done) => {
          return new FabricListView(tui, theme, done, {
            title: "Pipelines",
            subtitle: `${entries.length} active · model: ${config.defaultModel}`,
            items: entries.map(([name, p]) => {
              const steps = p.steps.map((s) => s.source ?? s.pattern).join(" → ");
              return { name, description: p.description, detail: steps };
            }),
            emptyMessage: "No pipelines configured.",
          });
        });
        return;
      }

      // ── List sources ──
      if (action === "list_sources") {
        const entries = Object.entries(config.sources);
        await ctx.ui.custom<void>((tui, theme, _kb, done) => {
          return new FabricListView(tui, theme, done, {
            title: "Sources",
            subtitle: `${entries.length} available`,
            items: entries.map(([name, s]) => ({
              name,
              description: s.description,
              detail: s.endpoint,
            })),
            emptyMessage: "No sources configured.",
          });
        });
        return;
      }

      // ── Add pattern ──
      if (action === "add_pattern") {
        const name = await ctx.ui.input("Pattern name to add (e.g. summarize):");
        if (!name) return;
        const trimmed = name.trim();
        if (config.patterns.includes(trimmed)) {
          ctx.ui.notify(`Pattern '${trimmed}' is already active.`, "warning");
          return;
        }
        config.patterns.push(trimmed);
        config.patterns.sort();
        saveConfig(config);
        ctx.ui.notify(`Added f_${trimmed}. Run /reload to activate.`, "success");
        return;
      }

      // ── Remove pattern ──
      if (action === "remove_pattern") {
        if (config.patterns.length === 0) {
          ctx.ui.notify("No patterns to remove.", "warning");
          return;
        }

        const items: SelectItem[] = config.patterns.map((p) => ({
          value: p,
          label: `f_${p}`,
          description: PATTERN_DESCRIPTIONS[p] ?? "",
        }));

        const toRemove = await ctx.ui.custom<string | null>((tui, theme, _kb, done) => {
          const container = new Container();
          container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));
          container.addChild(
            new Text(theme.fg("warning", theme.bold(" Select pattern to remove")), 0, 0)
          );

          const selectList = new SelectList(items, Math.min(items.length, 15), {
            selectedPrefix: (text) => theme.fg("accent", text),
            selectedText: (text) => theme.fg("accent", text),
            description: (text) => theme.fg("muted", text),
            scrollInfo: (text) => theme.fg("dim", text),
            noMatch: (text) => theme.fg("warning", text),
          });

          selectList.onSelect = (item) => done(item.value as string);
          selectList.onCancel = () => done(null);

          container.addChild(selectList);
          container.addChild(new Text(theme.fg("dim", "Press esc to cancel"), 0, 0));
          container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));

          return {
            render(width: number) { return container.render(width); },
            invalidate() { container.invalidate(); },
            handleInput(data: string) { selectList.handleInput(data); tui.requestRender(); },
          };
        });

        if (!toRemove) return;
        config.patterns = config.patterns.filter((p) => p !== toRemove);
        saveConfig(config);
        ctx.ui.notify(`Removed f_${toRemove}. Run /reload to deactivate.`, "success");
        return;
      }

      // ── Add pipeline ──
      if (action === "add_pipeline") {
        const name = await ctx.ui.input("Pipeline name (e.g. yt_cyber_summary):");
        if (!name) return;
        const trimmed = name.trim();
        if (config.pipelines[trimmed]) {
          ctx.ui.notify(`Pipeline '${trimmed}' already exists.`, "warning");
          return;
        }

        const desc = await ctx.ui.input("Description:");
        if (!desc) return;

        const inputDesc = await ctx.ui.input("Input description (e.g. 'YouTube video URL'):");

        const stepsRaw = await ctx.ui.input(
          "Steps (comma-separated, prefix with source: or pattern:)\n" +
          "Example: source:youtube_transcript, pattern:create_cyber_summary"
        );
        if (!stepsRaw) return;

        const steps: PipelineStep[] = stepsRaw.split(",").map((s) => {
          const trimmedStep = s.trim();
          if (trimmedStep.startsWith("source:")) {
            return { source: trimmedStep.slice(7).trim() };
          } else if (trimmedStep.startsWith("pattern:")) {
            return { pattern: trimmedStep.slice(8).trim() };
          } else {
            return { pattern: trimmedStep };
          }
        });

        config.pipelines[trimmed] = {
          description: desc.trim(),
          inputDescription: inputDesc?.trim() || undefined,
          steps,
        };
        saveConfig(config);
        ctx.ui.notify(
          `Added pipeline fp_${trimmed} (${steps.length} steps). Run /reload to activate.`,
          "success"
        );
        return;
      }

      // ── Remove pipeline ──
      if (action === "remove_pipeline") {
        const entries = Object.entries(config.pipelines);
        if (entries.length === 0) {
          ctx.ui.notify("No pipelines to remove.", "warning");
          return;
        }

        const items: SelectItem[] = entries.map(([name, p]) => ({
          value: name,
          label: `fp_${name}`,
          description: p.description,
        }));

        const toRemove = await ctx.ui.custom<string | null>((tui, theme, _kb, done) => {
          const container = new Container();
          container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));
          container.addChild(
            new Text(theme.fg("warning", theme.bold(" Select pipeline to remove")), 0, 0)
          );

          const selectList = new SelectList(items, Math.min(items.length, 15), {
            selectedPrefix: (text) => theme.fg("accent", text),
            selectedText: (text) => theme.fg("accent", text),
            description: (text) => theme.fg("muted", text),
            scrollInfo: (text) => theme.fg("dim", text),
            noMatch: (text) => theme.fg("warning", text),
          });

          selectList.onSelect = (item) => done(item.value as string);
          selectList.onCancel = () => done(null);

          container.addChild(selectList);
          container.addChild(new Text(theme.fg("dim", "Press esc to cancel"), 0, 0));
          container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));

          return {
            render(width: number) { return container.render(width); },
            invalidate() { container.invalidate(); },
            handleInput(data: string) { selectList.handleInput(data); tui.requestRender(); },
          };
        });

        if (!toRemove) return;
        delete config.pipelines[toRemove];
        saveConfig(config);
        ctx.ui.notify(`Removed fp_${toRemove}. Run /reload to deactivate.`, "success");
        return;
      }

      // ── Change model ──
      if (action === "model") {
        const newModel = await ctx.ui.input(
          `New default model (current: ${config.defaultModel}):`
        );
        if (!newModel) return;
        config.defaultModel = newModel.trim();
        saveConfig(config);
        ctx.ui.notify(
          `Default model set to ${config.defaultModel}. Run /reload to apply.`,
          "success"
        );
        return;
      }
    },
  });
}

// ── Main register ──

export function register(pi: ExtensionAPI) {
  const config = loadConfig();

  // Register unified pattern tool (single tool for all patterns)
  if (config.patterns.length > 0) {
    registerUnifiedPatternTool(pi, config.patterns, config.defaultModel);
  }

  // Register unified pipeline tool (single tool for all pipelines)
  registerUnifiedPipelineTool(pi, config);

  // Register /fabric command
  registerFabricCommand(pi);
}
