/**
 * image-gen - Generate and edit images via selectable AI image providers.
 *
 * Providers:
 * - OpenAI Image API: OPENAI_API_KEY, /v1/images/generations and /v1/images/edits
 * - Google Gemini/Nano Banana: GEMINI_API_KEY or GOOGLE_API_KEY, generateContent
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
const DESCRIPTION = readFileSync(join(__dirname, "image-gen.txt"), "utf8").trim();

const OPENAI_API_BASE = "https://api.openai.com/v1";
const GOOGLE_API_BASE = "https://generativelanguage.googleapis.com/v1";
const DEFAULT_OPENAI_MODEL = "gpt-image-2";
const DEFAULT_GOOGLE_MODEL = "gemini-3.1-flash-image";
const DEFAULT_TIMEOUT_MS = 180_000;
const MAX_TIMEOUT_MS = 240_000;
const OPENAI_MAX_N = 4;
const GOOGLE_MAX_INPUT_IMAGES = 14;

const Provider = ["openai", "google"] as const;
const Action = ["generate", "edit"] as const;
const Quality = ["auto", "low", "medium", "high"] as const;
const OutputFormat = ["png", "jpeg", "webp"] as const;
const Background = ["auto", "opaque", "transparent"] as const;
const Moderation = ["auto", "low"] as const;

const ParameterSchema = Type.Object({
  provider: Type.Optional(StringEnum(Provider, { description: "Image provider. Use openai for OpenAI Image API; google for Gemini/Nano Banana 2. Default: openai unless model starts with gemini-." })),
  action: StringEnum(Action, { description: "generate creates from prompt; edit uses local input image references" }),
  prompt: Type.String({ description: "Image generation/edit prompt" }),
  outputPath: Type.Optional(Type.String({ description: "Output file path or directory. Defaults to current working directory with timestamped filename." })),
  model: Type.Optional(Type.String({ description: "Provider model. OpenAI default: gpt-image-2. Google/Nano Banana 2 default: gemini-3.1-flash-image." })),
  inputImages: Type.Optional(Type.Array(Type.String(), { description: "Local image paths for edit/reference workflows. Google supports up to 14 reference images." })),
  timeoutSec: Type.Optional(Type.Number({ description: "Request timeout in seconds. Default 180, max 240." })),
  returnImage: Type.Optional(Type.Boolean({ description: "Return first image inline in the tool result. Default false; prefer saved file paths to reduce context." })),

  // OpenAI-only options.
  size: Type.Optional(Type.String({ description: "OpenAI image size, e.g. auto, 1024x1024, 1536x1024, 1024x1536, or valid custom WxH for gpt-image-2. Default: auto" })),
  quality: Type.Optional(StringEnum(Quality, { description: "OpenAI rendering quality. Default: auto" })),
  outputFormat: Type.Optional(StringEnum(OutputFormat, { description: "OpenAI output file format. Default: png. Google chooses the returned MIME type." })),
  outputCompression: Type.Optional(Type.Number({ description: "OpenAI compression 0-100 for jpeg/webp only" })),
  background: Type.Optional(StringEnum(Background, { description: "OpenAI background mode. gpt-image-2 supports auto or opaque, not transparent. Default: auto" })),
  moderation: Type.Optional(StringEnum(Moderation, { description: "OpenAI moderation strictness. Default: auto" })),
  n: Type.Optional(Type.Number({ description: `OpenAI number of images to generate, 1-${OPENAI_MAX_N}. Google currently returns one image. Default: 1` })),
  maskPath: Type.Optional(Type.String({ description: "OpenAI edit mask path. Must match first image size/format and include alpha channel." })),
});

type ImageGenParams = Static<typeof ParameterSchema>;
type ProviderName = typeof Provider[number];

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

type GoogleErrorBody = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

function inferProvider(params: ImageGenParams): ProviderName {
  if (params.provider) return params.provider as ProviderName;
  if (params.model?.startsWith("gemini-")) return "google";
  return "openai";
}

function providerModel(provider: ProviderName, params: ImageGenParams): string {
  return params.model ?? (provider === "google" ? DEFAULT_GOOGLE_MODEL : DEFAULT_OPENAI_MODEL);
}

function getOpenAIApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY environment variable is not set.");
  return key;
}

function getGoogleApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY environment variable is not set.");
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

function extensionFor(formatOrMime: string): string {
  if (formatOrMime === "jpeg" || formatOrMime.includes("jpeg") || formatOrMime.includes("jpg")) return "jpg";
  if (formatOrMime === "webp" || formatOrMime.includes("webp")) return "webp";
  return "png";
}

function buildOutputPaths(
  params: ImageGenParams,
  cwd: string,
  count: number,
  formatOrMime: string,
  prefix: string
): string[] {
  const ext = extensionFor(formatOrMime);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (!params.outputPath) {
    return Array.from({ length: count }, (_, i) =>
      resolve(cwd, `${prefix}-${stamp}${count > 1 ? `-${i + 1}` : ""}.${ext}`)
    );
  }

  const requested = resolvePath(params.outputPath, cwd);
  const treatAsDir =
    (existsSync(requested) && statSync(requested).isDirectory()) ||
    params.outputPath.endsWith("/");

  if (treatAsDir) {
    return Array.from({ length: count }, (_, i) =>
      join(requested, `${prefix}-${stamp}${count > 1 ? `-${i + 1}` : ""}.${ext}`)
    );
  }

  if (count === 1) return [requested];

  const dir = dirname(requested);
  const extnameValue = extname(requested);
  const base = basename(requested, extnameValue);
  const suffixExt = extnameValue || `.${ext}`;
  return Array.from({ length: count }, (_, i) => join(dir, `${base}-${i + 1}${suffixExt}`));
}

function validateParams(params: ImageGenParams): string | null {
  const provider = inferProvider(params);
  const model = providerModel(provider, params);
  const count = Math.round(params.n ?? 1);

  if (params.action === "edit" && (!params.inputImages || params.inputImages.length === 0)) {
    return "action=edit requires at least one inputImages path.";
  }
  if (params.action === "generate" && params.maskPath) {
    return "maskPath is only valid for action=edit.";
  }

  if (provider === "openai") {
    if (count < 1 || count > OPENAI_MAX_N) return `n must be between 1 and ${OPENAI_MAX_N}.`;
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

  if (params.inputImages && params.inputImages.length > GOOGLE_MAX_INPUT_IMAGES) {
    return `Google/Nano Banana supports at most ${GOOGLE_MAX_INPUT_IMAGES} inputImages.`;
  }
  if (params.maskPath) return "maskPath is only supported for provider=openai.";
  if (count !== 1) return "n is only supported for provider=openai. Google/Nano Banana currently returns one image.";
  if (params.size) return "size is only supported for provider=openai.";
  if (params.quality) return "quality is only supported for provider=openai.";
  if (params.outputCompression !== undefined) return "outputCompression is only supported for provider=openai.";
  if (params.background) return "background is only supported for provider=openai.";
  if (params.moderation) return "moderation is only supported for provider=openai.";
  return null;
}

function guessMediaType(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

function buildOpenAIGenerationBody(params: ImageGenParams): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: params.model ?? DEFAULT_OPENAI_MODEL,
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

function buildOpenAIEditForm(params: ImageGenParams, cwd: string): FormData {
  const form = new FormData();
  form.append("model", params.model ?? DEFAULT_OPENAI_MODEL);
  form.append("prompt", params.prompt);
  appendIfDefined(form, "n", Math.round(params.n ?? 1));
  appendIfDefined(form, "size", params.size ?? "auto");
  appendIfDefined(form, "quality", params.quality ?? "auto");
  appendIfDefined(form, "output_format", params.outputFormat ?? "png");
  appendIfDefined(form, "background", params.background ?? "auto");
  appendIfDefined(form, "moderation", params.moderation ?? "auto");
  if (params.outputCompression !== undefined) appendIfDefined(form, "output_compression", Math.round(params.outputCompression));

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

function buildGoogleBody(params: ImageGenParams, cwd: string): Record<string, unknown> {
  const parts: Array<Record<string, unknown>> = [{ text: params.prompt }];
  for (const imagePath of params.inputImages ?? []) {
    const fullPath = resolvePath(imagePath, cwd);
    if (!existsSync(fullPath)) throw new Error(`Input image not found: ${fullPath}`);
    parts.push({
      inline_data: {
        mime_type: guessMediaType(fullPath),
        data: readFileSync(fullPath).toString("base64"),
      },
    });
  }

  // REST generationConfig image controls are intentionally omitted: current v1 endpoint rejects
  // responseModalities/responseFormat/imageConfig for gemini-3.1-flash-image, while minimal
  // generateContent reliably returns inline image data.
  return { contents: [{ role: "user", parts }] };
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

    if (response.ok) return { data: text ? JSON.parse(text) : {}, requestId };

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt === 1) {
      await new Promise((r) => setTimeout(r, 1_000));
      continue;
    }

    throw formatOpenAIError(response.status, text, requestId);
  }

  throw new Error(`OpenAI request failed: ${lastResponseText}`);
}

async function callGoogle(
  model: string,
  body: Record<string, unknown>,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<{ data: any }> {
  let lastResponseText = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await fetchWithTimeout(
      `${GOOGLE_API_BASE}/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": getGoogleApiKey(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
      timeoutMs,
      signal
    );
    const text = await response.text();
    lastResponseText = text;

    if (response.ok) return { data: text ? JSON.parse(text) : {} };

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt === 1) {
      await new Promise((r) => setTimeout(r, 1_000));
      continue;
    }

    throw formatGoogleError(response.status, text);
  }

  throw new Error(`Google image request failed: ${lastResponseText}`);
}

function formatOpenAIError(status: number, text: string, requestId?: string): Error {
  let parsed: OpenAIErrorBody | null = null;
  try { parsed = JSON.parse(text) as OpenAIErrorBody; } catch { /* ignore non-JSON body */ }

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

function formatGoogleError(status: number, text: string): Error {
  let parsed: GoogleErrorBody | null = null;
  try { parsed = JSON.parse(text) as GoogleErrorBody; } catch { /* ignore non-JSON body */ }
  const err = parsed?.error;
  const statusText = err?.status ? ` status=${err.status}` : "";
  const message = err?.message ?? (text || "Unknown error");
  return new Error(`Google/Nano Banana image request failed (${status})${statusText}: ${message}`);
}

function saveOpenAIImages(data: any, outputPaths: string[], format: string): SavedImage[] {
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

function collectGoogleParts(data: any): any[] {
  const candidates = Array.isArray(data?.candidates) ? data.candidates : [];
  return candidates.flatMap((candidate: any) => candidate?.content?.parts ?? []);
}

function saveGoogleImages(data: any, params: ImageGenParams, cwd: string): { saved: SavedImage[]; text: string } {
  const parts = collectGoogleParts(data);
  const imageParts = parts
    .map((part: any) => part.inlineData ?? part.inline_data)
    .filter((inline: any) => inline?.data);
  const text = parts
    .filter((part: any) => typeof part.text === "string")
    .map((part: any) => part.text)
    .join("\n")
    .trim();

  if (imageParts.length === 0) {
    const reason = data?.candidates?.[0]?.finishReason ? ` finishReason=${data.candidates[0].finishReason}` : "";
    throw new Error(`Google/Nano Banana response did not include any images.${reason}${text ? ` Text: ${text}` : ""}`);
  }

  return {
    text,
    saved: imageParts.map((inline: any, index: number) => {
      const mediaType = inline.mimeType ?? inline.mime_type ?? "image/png";
      const outputPaths = buildOutputPaths(params, cwd, imageParts.length, mediaType, "image-gen-google");
      const outputPath = outputPaths[index] ?? outputPaths[0];
      mkdirSync(dirname(outputPath), { recursive: true });
      const bytes = Buffer.from(inline.data, "base64");
      writeFileSync(outputPath, bytes);
      return { path: outputPath, mediaType, bytes: bytes.length };
    }),
  };
}

function formatSummary(
  provider: ProviderName,
  params: ImageGenParams,
  saved: SavedImage[],
  options: { requestId?: string; usage?: any; googleText?: string } = {}
): string {
  const model = providerModel(provider, params);
  const lines: string[] = [];
  lines.push(`# ${provider === "google" ? "Google/Nano Banana" : "OpenAI"} image ${params.action}: saved ${saved.length} file${saved.length === 1 ? "" : "s"}`);
  lines.push(`Provider: ${provider}`);
  lines.push(`Model: ${model}`);
  if (provider === "openai") {
    lines.push(`Quality: ${params.quality ?? "auto"}`);
    lines.push(`Size: ${params.size ?? "auto"}`);
    lines.push(`Format: ${params.outputFormat ?? "png"}`);
  }
  if (options.requestId) lines.push(`Request ID: ${options.requestId}`);
  if (options.usage?.total_tokens !== undefined) lines.push(`Tokens: ${options.usage.total_tokens}`);
  if (options.usage?.totalTokenCount !== undefined) lines.push(`Tokens: ${options.usage.totalTokenCount}`);
  lines.push("Files:");
  for (const image of saved) lines.push(`- ${image.path} (${image.mediaType}, ${image.bytes} bytes)`);
  const revised = saved.find((image) => image.revisedPrompt)?.revisedPrompt;
  if (revised) lines.push(`Revised prompt: ${revised}`);
  if (options.googleText) lines.push(`Model text: ${options.googleText}`);
  return lines.join("\n");
}

async function runOpenAI(params: ImageGenParams, signal: AbortSignal | undefined, cwd: string) {
  const apiKey = getOpenAIApiKey();
  const timeoutMs = clampTimeoutMs(params.timeoutSec);
  const format = params.outputFormat ?? "png";
  const count = Math.round(params.n ?? 1);
  const outputPaths = buildOutputPaths(params, cwd, count, format, "image-gen-openai");
  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}` };

  const { data, requestId } = params.action === "generate"
    ? await callOpenAI(
        `${OPENAI_API_BASE}/images/generations`,
        { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(buildOpenAIGenerationBody(params)) },
        timeoutMs,
        signal
      )
    : await callOpenAI(
        `${OPENAI_API_BASE}/images/edits`,
        { method: "POST", headers, body: buildOpenAIEditForm(params, cwd) },
        timeoutMs,
        signal
      );

  const saved = saveOpenAIImages(data, outputPaths, format);
  return { saved, text: formatSummary("openai", params, saved, { requestId, usage: data?.usage }), requestId, usage: data?.usage };
}

async function runGoogle(params: ImageGenParams, signal: AbortSignal | undefined, cwd: string) {
  const timeoutMs = clampTimeoutMs(params.timeoutSec);
  const model = providerModel("google", params);
  const { data } = await callGoogle(model, buildGoogleBody(params, cwd), timeoutMs, signal);
  const { saved, text: googleText } = saveGoogleImages(data, params, cwd);
  return {
    saved,
    text: formatSummary("google", params, saved, { usage: data?.usageMetadata, googleText }),
    usage: data?.usageMetadata,
    finishReason: data?.candidates?.[0]?.finishReason,
  };
}

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "image_gen",
    label: "Image Gen",
    description: DESCRIPTION,
    parameters: ParameterSchema,

    async execute(_toolCallId, params: ImageGenParams, signal, _onUpdate, ctx) {
      const provider = inferProvider(params);
      try {
        const validationError = validateParams(params);
        if (validationError) {
          return { content: [{ type: "text", text: `Error: ${validationError}` }], details: { error: true }, isError: true };
        }

        const result = provider === "google"
          ? await runGoogle(params, signal, ctx.cwd)
          : await runOpenAI(params, signal, ctx.cwd);

        const content: any[] = [{ type: "text", text: result.text }];
        if (params.returnImage && result.saved[0]) {
          const first = readFileSync(result.saved[0].path).toString("base64");
          content.unshift({
            type: "image",
            source: { type: "base64", mediaType: result.saved[0].mediaType, data: first },
          });
        }

        return {
          content,
          details: {
            provider,
            action: params.action,
            model: providerModel(provider, params),
            files: result.saved.map((image) => image.path),
            count: result.saved.length,
            format: provider === "openai" ? (params.outputFormat ?? "png") : result.saved[0]?.mediaType,
            usage: result.usage,
            requestId: "requestId" in result ? result.requestId : undefined,
            finishReason: "finishReason" in result ? result.finishReason : undefined,
          },
        };
      } catch (err: any) {
        const isAbort = err?.name === "AbortError";
        const message = isAbort
          ? `${provider} image request timed out or was cancelled.`
          : `${provider} image error: ${err?.message ?? String(err)}`;
        return { content: [{ type: "text", text: message }], details: { error: true, timeout: isAbort, provider }, isError: true };
      }
    },

    renderCall(args, theme) {
      const provider = args.provider ?? (String(args.model ?? "").startsWith("gemini-") ? "google" : "openai");
      const action = args.action ?? "generate";
      const prompt = String(args.prompt ?? "").replace(/\s+/g, " ").slice(0, 80);
      let text = theme.fg("toolTitle", theme.bold("image_gen "));
      text += theme.fg("muted", `${provider}/${action} `);
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

      if (details?.error) return new Text(theme.fg("error", textContent || "image_gen error"), 0, 0);

      const count = details?.count ?? 0;
      const files = Array.isArray(details?.files) ? details.files : [];
      let text = theme.fg("success", `✓ saved ${count} image${count === 1 ? "" : "s"}`);
      if (files.length) text += theme.fg("dim", ` → ${files.join(", ")}`);
      return new Text(text, 0, 0);
    },
  });
}
