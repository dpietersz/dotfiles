/**
 * openai-image - Generate and edit images via OpenAI Image API
 *
 * Auth: OPENAI_API_KEY environment variable
 * API:  https://api.openai.com/v1/images/generations and /images/edits
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Text } from "@mariozechner/pi-tui";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESCRIPTION = readFileSync(join(__dirname, "openai-image.txt"), "utf8").trim();

const OPENAI_API_BASE = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-image-2";
const DEFAULT_TIMEOUT_MS = 180_000;
const MAX_TIMEOUT_MS = 240_000;
const MAX_N = 4;

const Action = ["generate", "edit"] as const;
const Quality = ["auto", "low", "medium", "high"] as const;
const OutputFormat = ["png", "jpeg", "webp"] as const;
const Background = ["auto", "opaque", "transparent"] as const;
const Moderation = ["auto", "low"] as const;

const ParameterSchema = Type.Object({
  action: StringEnum(Action, { description: "generate creates from prompt; edit uses local input image references" }),
  prompt: Type.String({ description: "Image generation/edit prompt" }),
  outputPath: Type.Optional(Type.String({ description: "Output file path or directory. Defaults to current working directory with timestamped filename." })),
  model: Type.Optional(Type.String({ description: "OpenAI image model. Default: gpt-image-2" })),
  size: Type.Optional(Type.String({ description: "Image size, e.g. auto, 1024x1024, 1536x1024, 1024x1536, or valid custom WxH for gpt-image-2. Default: auto" })),
  quality: Type.Optional(StringEnum(Quality, { description: "Rendering quality. Default: auto" })),
  outputFormat: Type.Optional(StringEnum(OutputFormat, { description: "Output file format. Default: png" })),
  outputCompression: Type.Optional(Type.Number({ description: "Compression 0-100 for jpeg/webp only" })),
  background: Type.Optional(StringEnum(Background, { description: "Background mode. gpt-image-2 supports auto or opaque, not transparent. Default: auto" })),
  moderation: Type.Optional(StringEnum(Moderation, { description: "Moderation strictness. Default: auto" })),
  n: Type.Optional(Type.Number({ description: `Number of images to generate, 1-${MAX_N}. Default: 1` })),
  inputImages: Type.Optional(Type.Array(Type.String(), { description: "Local image paths for edit/reference workflows" })),
  maskPath: Type.Optional(Type.String({ description: "Optional local mask path for edit. Must match first image size/format and include alpha channel." })),
  timeoutSec: Type.Optional(Type.Number({ description: "Request timeout in seconds. Default 180, max 240." })),
  returnImage: Type.Optional(Type.Boolean({ description: "Return first image inline in the tool result. Default false; prefer saved file paths to reduce context." })),
});

type OpenAIImageParams = Static<typeof ParameterSchema>;

type SavedImage = {
  path: string;
  mediaType: string;
  bytes: number;
  revisedPrompt?: string;
};

type OpenAIErrorBody = {
  error?: {
    message?: string;
    type?: string;
    code?: string;
    moderation_details?: {
      moderation_stage?: string;
      categories?: string[];
    };
  };
};

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY environment variable is not set.");
  return key;
}

function clampTimeoutMs(timeoutSec?: number): number {
  const requested = Math.round((timeoutSec ?? DEFAULT_TIMEOUT_MS / 1000) * 1000);
  return Math.max(1_000, Math.min(requested, MAX_TIMEOUT_MS));
}

function resolvePath(path: string, cwd: string): string {
  return isAbsolute(path) ? path : resolve(cwd, path);
}

function mediaTypeFor(format: string): string {
  if (format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}

function extensionFor(format: string): string {
  return format === "jpeg" ? "jpg" : format;
}

function buildOutputPaths(params: OpenAIImageParams, cwd: string, count: number, format: string): string[] {
  const ext = extensionFor(format);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (!params.outputPath) {
    return Array.from({ length: count }, (_, i) =>
      resolve(cwd, `openai-image-${stamp}${count > 1 ? `-${i + 1}` : ""}.${ext}`)
    );
  }

  const requested = resolvePath(params.outputPath, cwd);
  const treatAsDir =
    (existsSync(requested) && statSync(requested).isDirectory()) ||
    params.outputPath.endsWith("/");

  if (treatAsDir) {
    return Array.from({ length: count }, (_, i) =>
      join(requested, `openai-image-${stamp}${count > 1 ? `-${i + 1}` : ""}.${ext}`)
    );
  }

  if (count === 1) return [requested];

  const dir = dirname(requested);
  const extnameValue = extname(requested);
  const base = basename(requested, extnameValue);
  const suffixExt = extnameValue || `.${ext}`;
  return Array.from({ length: count }, (_, i) => join(dir, `${base}-${i + 1}${suffixExt}`));
}

function validateParams(params: OpenAIImageParams): string | null {
  const model = params.model ?? DEFAULT_MODEL;
  const action = params.action;
  const count = Math.round(params.n ?? 1);

  if (action === "edit" && (!params.inputImages || params.inputImages.length === 0)) {
    return "action=edit requires at least one inputImages path.";
  }
  if (action === "generate" && params.maskPath) {
    return "maskPath is only valid for action=edit.";
  }
  if (count < 1 || count > MAX_N) {
    return `n must be between 1 and ${MAX_N}.`;
  }
  if (params.outputCompression !== undefined) {
    const format = params.outputFormat ?? "png";
    if (format === "png") return "outputCompression is only valid for jpeg or webp outputFormat.";
    if (params.outputCompression < 0 || params.outputCompression > 100) {
      return "outputCompression must be between 0 and 100.";
    }
  }
  if (model === "gpt-image-2" && params.background === "transparent") {
    return "gpt-image-2 does not support background=transparent. Use auto or opaque.";
  }
  return null;
}

function buildGenerationBody(params: OpenAIImageParams): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: params.model ?? DEFAULT_MODEL,
    prompt: params.prompt,
    n: Math.round(params.n ?? 1),
    size: params.size ?? "auto",
    quality: params.quality ?? "auto",
    output_format: params.outputFormat ?? "png",
    background: params.background ?? "auto",
    moderation: params.moderation ?? "auto",
  };
  if (params.outputCompression !== undefined) body.output_compression = Math.round(params.outputCompression);
  return body;
}

function appendIfDefined(form: FormData, key: string, value: unknown): void {
  if (value !== undefined && value !== null) form.append(key, String(value));
}

function buildEditForm(params: OpenAIImageParams, cwd: string): FormData {
  const form = new FormData();
  form.append("model", params.model ?? DEFAULT_MODEL);
  form.append("prompt", params.prompt);
  appendIfDefined(form, "n", Math.round(params.n ?? 1));
  appendIfDefined(form, "size", params.size ?? "auto");
  appendIfDefined(form, "quality", params.quality ?? "auto");
  appendIfDefined(form, "output_format", params.outputFormat ?? "png");
  appendIfDefined(form, "background", params.background ?? "auto");
  appendIfDefined(form, "moderation", params.moderation ?? "auto");
  if (params.outputCompression !== undefined) {
    appendIfDefined(form, "output_compression", Math.round(params.outputCompression));
  }

  for (const imagePath of params.inputImages ?? []) {
    const fullPath = resolvePath(imagePath, cwd);
    if (!existsSync(fullPath)) throw new Error(`Input image not found: ${fullPath}`);
    const bytes = readFileSync(fullPath);
    const blob = new Blob([bytes], { type: guessMediaType(fullPath) });
    form.append("image[]", blob, basename(fullPath));
  }

  if (params.maskPath) {
    const fullPath = resolvePath(params.maskPath, cwd);
    if (!existsSync(fullPath)) throw new Error(`Mask image not found: ${fullPath}`);
    const bytes = readFileSync(fullPath);
    const blob = new Blob([bytes], { type: guessMediaType(fullPath) });
    form.append("mask", blob, basename(fullPath));
  }

  return form;
}

function guessMediaType(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const abortListener = () => controller.abort();
  signal?.addEventListener("abort", abortListener);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortListener);
  }
}

async function callOpenAI(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<{ data: any; requestId?: string }> {
  let lastResponseText = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await fetchWithTimeout(url, init, timeoutMs, signal);
    const requestId = response.headers.get("x-request-id") ?? undefined;
    const text = await response.text();
    lastResponseText = text;

    if (response.ok) {
      return { data: text ? JSON.parse(text) : {}, requestId };
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt === 1) {
      await new Promise((r) => setTimeout(r, 1_000));
      continue;
    }

    throw formatOpenAIError(response.status, text, requestId);
  }

  throw new Error(`OpenAI request failed: ${lastResponseText}`);
}

function formatOpenAIError(status: number, text: string, requestId?: string): Error {
  let parsed: OpenAIErrorBody | null = null;
  try {
    parsed = JSON.parse(text) as OpenAIErrorBody;
  } catch {
    // ignore non-JSON body
  }

  const err = parsed?.error;
  if (err?.code === "moderation_blocked") {
    const details = err.moderation_details;
    const categories = details?.categories?.length ? ` categories=${details.categories.join(",")}` : "";
    const stage = details?.moderation_stage ? ` stage=${details.moderation_stage}` : "";
    return new Error(
      `OpenAI image request moderation-blocked.${stage}${categories}. Revise prompt or input images. Request ID: ${requestId ?? "unknown"}`
    );
  }

  const message = err?.message ?? (text || "Unknown error");
  const code = err?.code ? ` code=${err.code}` : "";
  const type = err?.type ? ` type=${err.type}` : "";
  return new Error(`OpenAI image request failed (${status})${type}${code}: ${message}. Request ID: ${requestId ?? "unknown"}`);
}

function saveImages(data: any, outputPaths: string[], format: string): SavedImage[] {
  const items = Array.isArray(data?.data) ? data.data : [];
  if (items.length === 0) throw new Error("OpenAI response did not include any images.");

  return items.map((item: any, index: number) => {
    const b64 = item.b64_json;
    if (!b64) throw new Error(`OpenAI response image ${index + 1} did not include b64_json.`);
    const outputPath = outputPaths[index] ?? outputPaths[0];
    mkdirSync(dirname(outputPath), { recursive: true });
    const bytes = Buffer.from(b64, "base64");
    writeFileSync(outputPath, bytes);
    return {
      path: outputPath,
      mediaType: mediaTypeFor(format),
      bytes: bytes.length,
      revisedPrompt: item.revised_prompt,
    };
  });
}

function formatSummary(params: OpenAIImageParams, saved: SavedImage[], requestId?: string, usage?: any): string {
  const lines: string[] = [];
  lines.push(`# OpenAI image ${params.action}: saved ${saved.length} file${saved.length === 1 ? "" : "s"}`);
  lines.push(`Model: ${params.model ?? DEFAULT_MODEL}`);
  lines.push(`Quality: ${params.quality ?? "auto"}`);
  lines.push(`Size: ${params.size ?? "auto"}`);
  lines.push(`Format: ${params.outputFormat ?? "png"}`);
  if (requestId) lines.push(`Request ID: ${requestId}`);
  if (usage?.total_tokens !== undefined) lines.push(`Tokens: ${usage.total_tokens}`);
  lines.push("Files:");
  for (const image of saved) {
    lines.push(`- ${image.path} (${image.mediaType}, ${image.bytes} bytes)`);
  }
  const revised = saved.find((image) => image.revisedPrompt)?.revisedPrompt;
  if (revised) lines.push(`Revised prompt: ${revised}`);
  return lines.join("\n");
}

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "openai_image",
    label: "OpenAI Image",
    description: DESCRIPTION,
    parameters: ParameterSchema,

    async execute(_toolCallId, params: OpenAIImageParams, signal, _onUpdate, ctx) {
      try {
        const validationError = validateParams(params);
        if (validationError) {
          return {
            content: [{ type: "text", text: `Error: ${validationError}` }],
            details: { error: true },
            isError: true,
          };
        }

        const apiKey = getApiKey();
        const timeoutMs = clampTimeoutMs(params.timeoutSec);
        const format = params.outputFormat ?? "png";
        const count = Math.round(params.n ?? 1);
        const outputPaths = buildOutputPaths(params, ctx.cwd, count, format);

        const headers: Record<string, string> = {
          Authorization: `Bearer ${apiKey}`,
        };

        const { data, requestId } = params.action === "generate"
          ? await callOpenAI(
              `${OPENAI_API_BASE}/images/generations`,
              {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify(buildGenerationBody(params)),
              },
              timeoutMs,
              signal
            )
          : await callOpenAI(
              `${OPENAI_API_BASE}/images/edits`,
              {
                method: "POST",
                headers,
                body: buildEditForm(params, ctx.cwd),
              },
              timeoutMs,
              signal
            );

        const saved = saveImages(data, outputPaths, format);
        const text = formatSummary(params, saved, requestId, data?.usage);
        const content: any[] = [{ type: "text", text }];

        if (params.returnImage && saved[0]) {
          const first = readFileSync(saved[0].path).toString("base64");
          content.unshift({
            type: "image",
            source: {
              type: "base64",
              mediaType: saved[0].mediaType,
              data: first,
            },
          });
        }

        return {
          content,
          details: {
            action: params.action,
            model: params.model ?? DEFAULT_MODEL,
            requestId,
            files: saved.map((image) => image.path),
            count: saved.length,
            format,
            usage: data?.usage,
          },
        };
      } catch (err: any) {
        const isAbort = err?.name === "AbortError";
        const message = isAbort
          ? `OpenAI image request timed out or was cancelled.`
          : `OpenAI image error: ${err?.message ?? String(err)}`;
        return {
          content: [{ type: "text", text: message }],
          details: { error: true, timeout: isAbort },
          isError: true,
        };
      }
    },

    renderCall(args, theme) {
      const action = args.action ?? "generate";
      const prompt = String(args.prompt ?? "").replace(/\s+/g, " ").slice(0, 80);
      let text = theme.fg("toolTitle", theme.bold("openai_image "));
      text += theme.fg("muted", `${action} `);
      text += theme.fg("dim", prompt);
      return new Text(text, 0, 0);
    },

    renderResult(result, { isPartial }, theme) {
      if (isPartial) return new Text(theme.fg("warning", "Generating image…"), 0, 0);

      const details = result.details as Record<string, any> | undefined;
      const textContent = result.content
        ?.filter((c: any) => c.type === "text")
        .map((c: any) => c.text)
        .join("") ?? "";

      if (details?.error) return new Text(theme.fg("error", textContent || "OpenAI image error"), 0, 0);

      const count = details?.count ?? 0;
      const files = Array.isArray(details?.files) ? details.files : [];
      let text = theme.fg("success", `✓ saved ${count} image${count === 1 ? "" : "s"}`);
      if (files.length) text += theme.fg("dim", ` → ${files.join(", ")}`);
      return new Text(text, 0, 0);
    },
  });
}
