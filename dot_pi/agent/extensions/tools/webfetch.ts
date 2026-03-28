/**
 * webfetch - Web content fetching via Crawl4AI
 *
 * Uses a self-hosted Crawl4AI instance to fetch and convert web content.
 * Supports markdown extraction, raw HTML, screenshots, and more.
 *
 * Requires CRAWL4AI_API_KEY environment variable.
 * Endpoint: https://crawl4ai.pietersz.me
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

const CRAWL4AI_URL = "https://crawl4ai.pietersz.me";
const DEFAULT_TIMEOUT = 30_000;
const MAX_TIMEOUT = 120_000;

function getCloudflareCreds(): { clientId: string; clientSecret: string } {
  const clientId = process.env.CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_ID;
  const clientSecret = process.env.CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Cloudflare Access credentials not set. " +
        "Set CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_ID and " +
        "CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_SECRET environment variables."
    );
  }
  return { clientId, clientSecret };
}

function writeTempFile(content: string, ext: string): string {
  const file = join(tmpdir(), `pi-webfetch-${Date.now()}${ext}`);
  writeFileSync(file, content, "utf8");
  return file;
}

const ParameterSchema = Type.Object({
  url: Type.String({ description: "The URL to fetch content from" }),
  format: Type.Optional(
    StringEnum(["markdown", "html", "screenshot"] as const, {
      description:
        'Output format. "markdown" (default) extracts clean markdown. ' +
        '"html" returns preprocessed HTML. ' +
        '"screenshot" captures a page screenshot.',
    })
  ),
  timeout: Type.Optional(
    Type.Number({
      description: "Timeout in seconds (max 120). Default: 30.",
    })
  ),
});

type WebfetchParams = Static<typeof ParameterSchema>;

const DESCRIPTION = readFileSync(join(__dirname, "webfetch.txt"), "utf8").trim();

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "webfetch",
    label: "Web Fetch",
    description: DESCRIPTION,
    parameters: ParameterSchema,

    async execute(toolCallId, params, signal, onUpdate, ctx) {
      const format = params.format ?? "markdown";
      const url = params.url;

      // Validate URL
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return {
          content: [
            {
              type: "text",
              text: "Error: URL must start with http:// or https://",
            },
          ],
          details: { error: true },
          isError: true,
        };
      }

      const { clientId, clientSecret } = getCloudflareCreds();
      const timeout = Math.min(
        (params.timeout ?? DEFAULT_TIMEOUT / 1000) * 1000,
        MAX_TIMEOUT
      );

      const headers: Record<string, string> = {
        "CF-Access-Client-Id": clientId,
        "CF-Access-Client-Secret": clientSecret,
        "Content-Type": "application/json",
      };

      try {
        // Screenshot mode
        if (format === "screenshot") {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          if (signal) {
            signal.addEventListener("abort", () => controller.abort());
          }

          try {
            const response = await fetch(`${CRAWL4AI_URL}/screenshot`, {
              method: "POST",
              headers,
              body: JSON.stringify({ url }),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const body = await response.text().catch(() => "");
              return {
                content: [
                  {
                    type: "text",
                    text: `Screenshot failed (${response.status}): ${body}`,
                  },
                ],
                details: { error: true, status: response.status },
                isError: true,
              };
            }

            const data = await response.json();
            const imageData = data.screenshot || data.result;

            if (imageData) {
              const base64 = imageData.startsWith("data:")
                ? imageData.split(",")[1]
                : imageData;

              return {
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      mediaType: "image/png",
                      data: base64,
                    },
                  },
                  { type: "text", text: `Screenshot of ${url}` },
                ],
                details: { url, format: "screenshot" },
              };
            }

            return {
              content: [
                {
                  type: "text",
                  text: `Screenshot captured but no image data returned for ${url}`,
                },
              ],
              details: { url, format: "screenshot" },
            };
          } finally {
            clearTimeout(timeoutId);
          }
        }

        // Markdown mode - use /md endpoint
        if (format === "markdown") {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          if (signal) {
            signal.addEventListener("abort", () => controller.abort());
          }

          try {
            const response = await fetch(`${CRAWL4AI_URL}/md`, {
              method: "POST",
              headers,
              body: JSON.stringify({ url }),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const body = await response.text().catch(() => "");
              return {
                content: [
                  {
                    type: "text",
                    text: `Fetch failed (${response.status}): ${body}`,
                  },
                ],
                details: { error: true, status: response.status },
                isError: true,
              };
            }

            const data = await response.json();
            // Crawl4AI /md returns markdown content
            const markdown =
              data.markdown || data.result || data.fit_markdown || "";

            return formatTextResult(url, markdown, "markdown");
          } finally {
            clearTimeout(timeoutId);
          }
        }

        // HTML mode - use /html endpoint
        if (format === "html") {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          if (signal) {
            signal.addEventListener("abort", () => controller.abort());
          }

          try {
            const response = await fetch(`${CRAWL4AI_URL}/html`, {
              method: "POST",
              headers,
              body: JSON.stringify({ url }),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const body = await response.text().catch(() => "");
              return {
                content: [
                  {
                    type: "text",
                    text: `Fetch failed (${response.status}): ${body}`,
                  },
                ],
                details: { error: true, status: response.status },
                isError: true,
              };
            }

            const data = await response.json();
            const html = data.html || data.result || data.cleaned_html || "";

            return formatTextResult(url, html, "html");
          } finally {
            clearTimeout(timeoutId);
          }
        }

        return {
          content: [
            { type: "text", text: `Unknown format: ${format}` },
          ],
          details: { error: true },
          isError: true,
        };
      } catch (err: any) {
        if (err.name === "AbortError") {
          return {
            content: [
              { type: "text", text: `Request timed out after ${timeout / 1000}s for ${url}` },
            ],
            details: { error: true, timeout: true },
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Fetch error: ${err.message}`,
            },
          ],
          details: { error: true },
          isError: true,
        };
      }
    },

    // Custom rendering for tool call header
    renderCall(args, theme) {
      let text = theme.fg("toolTitle", theme.bold("webfetch "));
      text += theme.fg("muted", args.url || "");
      if (args.format && args.format !== "markdown") {
        text += theme.fg("dim", ` (${args.format})`);
      }
      return new Text(text, 0, 0);
    },

    // Custom rendering for tool result
    renderResult(result, { expanded, isPartial }, theme) {
      if (isPartial) {
        return new Text(theme.fg("warning", "Fetching…"), 0, 0);
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

      const url = details?.url || "";
      const format = details?.format || "markdown";
      const truncated = details?.truncated || false;
      const lines = details?.lines || 0;
      const bytes = details?.bytes || 0;

      let text = theme.fg("success", "✓ ");
      text += theme.fg("muted", `${url}`);
      text += theme.fg("dim", ` (${format}, ${lines} lines, ${formatSize(bytes)})`);

      if (truncated) {
        text += theme.fg("warning", " [truncated]");
      }

      if (expanded) {
        const content = result.content
          ?.filter((c: any) => c.type === "text")
          .map((c: any) => c.text)
          .join("");
        if (content) {
          // Show first 40 lines when expanded
          const preview = content.split("\n").slice(0, 40).join("\n");
          text += "\n" + theme.fg("dim", preview);
          if (content.split("\n").length > 40) {
            text += "\n" + theme.fg("warning", `... (${content.split("\n").length - 40} more lines)`);
          }
        }
      }

      return new Text(text, 0, 0);
    },
  });
}

function formatTextResult(
  url: string,
  content: string,
  format: string
): {
  content: Array<{ type: string; text: string }>;
  details: Record<string, any>;
} {
  const totalLines = content.split("\n").length;
  const totalBytes = Buffer.byteLength(content, "utf8");

  const truncation = truncateHead(content, {
    maxLines: DEFAULT_MAX_LINES,
    maxBytes: DEFAULT_MAX_BYTES,
  });

  let output = truncation.content;

  if (truncation.truncated) {
    const tempFile = writeTempFile(content, format === "html" ? ".html" : ".md");
    output += `\n\n[Output truncated: ${truncation.outputLines} of ${truncation.totalLines} lines`;
    output += ` (${formatSize(truncation.outputBytes)} of ${formatSize(truncation.totalBytes)}).`;
    output += ` Full output saved to: ${tempFile}]`;
  }

  return {
    content: [{ type: "text", text: output }],
    details: {
      url,
      format,
      lines: totalLines,
      bytes: totalBytes,
      truncated: truncation.truncated,
    },
  };
}
