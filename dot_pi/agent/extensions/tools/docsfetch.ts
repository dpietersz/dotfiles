/**
 * docsfetch - Scrape a documentation site into local markdown files
 *
 * Two-phase approach:
 *   Phase 1 (discover): Recursively discover all doc pages via BFS, return
 *     a grouped URL tree to the LLM for intelligent filtering.
 *   Phase 2 (fetch): Download the curated list of URLs and save as markdown.
 *
 * Supports two modes:
 *   1. Website docs (via Crawl4AI) — discovers links, crawls each page
 *   2. GitHub repo docs — fetches markdown files from a GitHub directory
 *
 * Website mode features:
 *   - Recursive link discovery: crawls discovered pages to find deeper links (BFS)
 *   - Multi-section support: crawl multiple URL paths under the same domain
 *   - AI-assisted filtering: discovery returns URLs for LLM to curate before fetching
 *   - Incremental updates: pages <7 days old are skipped; stale pages checked via ETag
 *
 * GitHub mode features:
 *   - Uses file SHA from GitHub API; only re-fetches if SHA changed
 *
 * Requires CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_ID and
 * CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_SECRET environment variables (for website mode).
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Text } from "@mariozechner/pi-tui";
import {
  readFileSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CRAWL4AI_URL = "https://crawl4ai.pietersz.me";
const STALE_DAYS = 7;
const MAX_PAGES = 500; // Safety cap for recursive discovery
const DISCOVERY_CONCURRENCY = 5; // Concurrent crawls during discovery

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

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

function getHeaders(creds: { clientId: string; clientSecret: string }): Record<string, string> {
  return {
    "CF-Access-Client-Id": creds.clientId,
    "CF-Access-Client-Secret": creds.clientSecret,
    "Content-Type": "application/json",
  };
}

// ------------------------------------------------------------------
// Frontmatter parsing
// ------------------------------------------------------------------

interface ParsedFile {
  frontmatter: Record<string, string>;
  body: string;
}

function parseFrontmatter(content: string): ParsedFile {
  const fm: Record<string, string> = {};
  if (!content.startsWith("---")) return { frontmatter: fm, body: content };

  const endIdx = content.indexOf("\n---", 3);
  if (endIdx === -1) return { frontmatter: fm, body: content };

  const fmBlock = content.slice(4, endIdx);
  for (const line of fmBlock.split("\n")) {
    const match = line.match(/^(\w[\w_]*)\s*:\s*"?(.*?)"?\s*$/);
    if (match) {
      fm[match[1]] = match[2];
    }
  }

  const body = content.slice(endIdx + 4).replace(/^\n+/, "");
  return { frontmatter: fm, body };
}

function buildFrontmatter(fields: Record<string, string>): string {
  const lines = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    if (value) {
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

// ------------------------------------------------------------------
// Existing file cache
// ------------------------------------------------------------------

interface ExistingPage {
  scrapedAt: string;
  etag: string;
  sha: string;
  title: string;
  description: string;
}

/**
 * Recursively read all .md files in a directory and extract their frontmatter.
 */
function loadExistingPages(dir: string, base?: string): Map<string, ExistingPage> {
  const map = new Map<string, ExistingPage>();
  if (!existsSync(dir)) return map;
  if (!base) base = dir;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      for (const [k, v] of loadExistingPages(full, base)) {
        map.set(k, v);
      }
    } else if (entry.endsWith(".md") && entry !== "_index.md") {
      try {
        const content = readFileSync(full, "utf8");
        const { frontmatter } = parseFrontmatter(content);
        const relative = full.slice(base.length + 1);
        map.set(relative, {
          scrapedAt: frontmatter.scraped_at || "",
          etag: frontmatter.etag || "",
          sha: frontmatter.sha || "",
          title: frontmatter.title || "",
          description: frontmatter.description || "",
        });
      } catch {
        // skip unreadable files
      }
    }
  }
  return map;
}

function isStale(scrapedAt: string): boolean {
  if (!scrapedAt) return true;
  try {
    const age = Date.now() - new Date(scrapedAt).getTime();
    return age > STALE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

// ------------------------------------------------------------------
// ETag check via HTTP HEAD (lightweight, no browser rendering)
// ------------------------------------------------------------------

async function fetchEtag(url: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const response = await fetch(url, { method: "HEAD", signal, redirect: "follow" });
    if (!response.ok) return null;
    return response.headers.get("etag") || null;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------
// GitHub support
// ------------------------------------------------------------------

interface GitHubParsedUrl {
  owner: string;
  repo: string;
  branch: string;
  dirPath: string;
}

/**
 * Parse a GitHub URL like:
 *   https://github.com/owner/repo/tree/branch/path/to/docs
 * Returns null if not a GitHub docs URL.
 */
function parseGitHubUrl(url: string): GitHubParsedUrl | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;

    // Match /owner/repo/tree/branch/path...
    const match = parsed.pathname.match(
      /^\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+?)\/?\s*$/
    );
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2],
      branch: match[3],
      dirPath: match[4],
    };
  } catch {
    return null;
  }
}

/**
 * Build the domain key for GitHub repos: "github.com/owner/repo" (lowercase)
 */
function gitHubDomainKey(gh: GitHubParsedUrl): string {
  return `github.com/${gh.owner}/${gh.repo}`.toLowerCase();
}

interface GitHubFileInfo {
  name: string;
  sha: string;
  downloadUrl: string;
  htmlUrl: string;
  size: number;
}

/**
 * List markdown files in a GitHub directory using the Contents API.
 * Recursively includes files in subdirectories.
 */
async function listGitHubMarkdownFiles(
  gh: GitHubParsedUrl,
  signal?: AbortSignal,
  subPath?: string
): Promise<GitHubFileInfo[]> {
  const apiPath = subPath || gh.dirPath;
  const apiUrl = `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${apiPath}?ref=${gh.branch}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "pi-docsfetch",
  };

  // Use GITHUB_TOKEN if available for higher rate limits
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(apiUrl, { headers, signal });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const items = (await response.json()) as Array<{
    name: string;
    path: string;
    sha: string;
    size: number;
    type: string;
    download_url: string | null;
    html_url: string;
  }>;

  const files: GitHubFileInfo[] = [];

  for (const item of items) {
    if (item.type === "file" && item.name.toLowerCase().endsWith(".md")) {
      files.push({
        name: item.name,
        sha: item.sha,
        downloadUrl: item.download_url || "",
        htmlUrl: item.html_url,
        size: item.size,
      });
    } else if (item.type === "dir") {
      // Recursively fetch subdirectories
      const subFiles = await listGitHubMarkdownFiles(gh, signal, item.path);
      files.push(...subFiles);
    }
  }

  return files;
}

/**
 * Fetch raw markdown content from GitHub.
 */
async function fetchGitHubFile(
  downloadUrl: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "pi-docsfetch",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(downloadUrl, { headers, signal });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

/**
 * Extract a title from markdown content (first # heading).
 */
function extractMarkdownTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

/**
 * Extract a description from markdown content (first paragraph after title).
 */
function extractMarkdownDescription(content: string): string {
  // Skip frontmatter if present
  let text = content;
  if (text.startsWith("---")) {
    const endIdx = text.indexOf("\n---", 3);
    if (endIdx !== -1) text = text.slice(endIdx + 4);
  }

  // Skip the title line
  text = text.replace(/^#\s+.+$/m, "").trim();

  // Get first non-empty paragraph
  const lines = text.split("\n");
  const paraLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" && paraLines.length > 0) break;
    if (trimmed === "") continue;
    if (trimmed.startsWith("#")) break;
    paraLines.push(trimmed);
  }

  const desc = paraLines.join(" ").slice(0, 200);
  return desc;
}

/**
 * Handle fetching docs from a GitHub repository directory.
 */
async function fetchGitHubDocs(
  gh: GitHubParsedUrl,
  outDir: string,
  domainKey: string,
  location: string,
  signal: AbortSignal | undefined,
  onUpdate?: (update: any) => void
): Promise<{
  content: Array<{ type: string; text: string }>;
  details: Record<string, any>;
}> {
  const scrapedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const sourceUrl = `https://github.com/${gh.owner}/${gh.repo}/tree/${gh.branch}/${gh.dirPath}`;

  // Step 1: List markdown files
  onUpdate?.({
    content: [{ type: "text", text: `Listing markdown files from GitHub: ${gh.owner}/${gh.repo}/${gh.dirPath}...` }],
    details: { phase: "discovery" },
  });

  let files: GitHubFileInfo[];
  try {
    files = await listGitHubMarkdownFiles(gh, signal);
  } catch (err: any) {
    return {
      content: [{ type: "text", text: `Failed to list GitHub files: ${err.message}` }],
      details: { error: true },
    };
  }

  if (files.length === 0) {
    return {
      content: [{ type: "text", text: `No markdown files found in ${sourceUrl}` }],
      details: { error: true },
    };
  }

  // Step 2: Load existing pages and categorize
  const existing = loadExistingPages(outDir);
  mkdirSync(outDir, { recursive: true });

  const toFetch: Array<{ file: GitHubFileInfo; localName: string; isNew: boolean }> = [];
  const freshFiles: Array<{ localName: string; title: string; description: string }> = [];

  for (const file of files) {
    const localName = file.name.toLowerCase();
    const prev = existing.get(localName);

    if (prev && prev.sha === file.sha) {
      // SHA matches — file hasn't changed on GitHub
      freshFiles.push({
        localName,
        title: prev.title,
        description: prev.description,
      });
    } else {
      toFetch.push({
        file,
        localName,
        isNew: !prev,
      });
    }
  }

  onUpdate?.({
    content: [
      {
        type: "text",
        text:
          `Found ${files.length} markdown files: ` +
          `${toFetch.filter((f) => f.isNew).length} new, ` +
          `${toFetch.filter((f) => !f.isNew).length} changed, ` +
          `${freshFiles.length} unchanged. ` +
          (toFetch.length > 0 ? "Fetching..." : "All up to date."),
      },
    ],
    details: { phase: "checking", total: files.length },
  });

  // Step 3: Fetch files that are new or changed
  const allPages: Array<{ filename: string; title: string; description: string }> = [];
  const changedPages: Array<{ filename: string; isNew: boolean }> = [];
  let failed = 0;

  // Add fresh pages
  for (const f of freshFiles) {
    allPages.push({ filename: f.localName, title: f.title, description: f.description });
  }

  for (let i = 0; i < toFetch.length; i++) {
    const { file, localName, isNew } = toFetch[i];

    if (signal?.aborted) {
      return {
        content: [{ type: "text", text: "Aborted by user" }],
        details: { error: true },
      };
    }

    onUpdate?.({
      content: [
        {
          type: "text",
          text: `Fetching ${i + 1}/${toFetch.length}: ${localName}${isNew ? " (new)" : " (changed)"}`,
        },
      ],
      details: { phase: "fetching", current: i + 1, total: toFetch.length },
    });

    const content = await fetchGitHubFile(file.downloadUrl, signal);
    if (!content) {
      failed++;
      continue;
    }

    const title = extractMarkdownTitle(content) || localName.replace(/\.md$/, "");
    const description = extractMarkdownDescription(content);

    const frontmatter = buildFrontmatter({
      title,
      description,
      domain: domainKey,
      source: file.htmlUrl,
      scraped_at: scrapedAt,
      sha: file.sha,
    });

    const filePath = join(outDir, localName);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, frontmatter + "\n\n" + content, "utf8");

    allPages.push({ filename: localName, title, description });
    changedPages.push({ filename: localName, isNew });
  }

  // Sort for consistent index
  allPages.sort((a, b) => a.filename.localeCompare(b.filename));

  // Step 4: Generate _index.md
  const indexLines = [
    buildFrontmatter({
      title: `${domainKey} Documentation`,
      description: `Documentation index for ${domainKey} (${allPages.length} pages)`,
      domain: domainKey,
      source: sourceUrl,
      scraped_at: scrapedAt,
    }),
    "",
    `# ${domainKey} Documentation`,
    "",
  ];

  for (const page of allPages) {
    const label = page.title || page.filename.replace(/\.md$/, "");
    const desc = page.description ? ` - ${page.description}` : "";
    indexLines.push(`- [${label}](./${page.filename})${desc}`);
  }

  writeFileSync(join(outDir, "_index.md"), indexLines.join("\n") + "\n", "utf8");

  // Step 5: Summary
  const newCount = changedPages.filter((p) => p.isNew).length;
  const updatedCount = changedPages.filter((p) => !p.isNew).length;
  const unchangedCount = freshFiles.length;

  const displayDir =
    location === "global"
      ? `~/.pi/.ai/ref-docs/${domainKey}/`
      : `.ai/ref-docs/${domainKey}/`;

  const lines: string[] = [];
  lines.push(
    `${allPages.length} pages in ${displayDir} (${location}) — ` +
      `${newCount} new, ${updatedCount} updated, ` +
      `${unchangedCount} unchanged, ${failed} failed`
  );

  if (changedPages.length === 0) {
    lines.push("", "All pages are up to date.");
  } else {
    lines.push("");
    const MAX_LIST = 10;
    const displayList = changedPages.map(
      (p) => `  ${p.isNew ? "+" : "~"} ${p.filename} (${p.isNew ? "new" : "updated"})`
    );

    if (displayList.length <= MAX_LIST) {
      lines.push("Changed pages:");
      lines.push(...displayList);
    } else {
      lines.push("Changed pages:");
      lines.push(...displayList.slice(0, MAX_LIST));
      lines.push(`  ... and ${displayList.length - MAX_LIST} more`);
    }
  }

  return {
    content: [{ type: "text", text: lines.join("\n") }],
    details: {
      domain: domainKey,
      pages: allPages.length,
      new: newCount,
      updated: updatedCount,
      unchanged: unchangedCount,
      failed,
      location,
      outDir: displayDir,
    },
  };
}

// ------------------------------------------------------------------
// Crawl4AI (website mode)
// ------------------------------------------------------------------

interface CrawlResult {
  success: boolean;
  metadata?: {
    title?: string;
    description?: string;
    "og:title"?: string;
    "og:description"?: string;
  };
  markdown?: {
    raw_markdown?: string;
    markdown_with_citations?: string;
    fit_markdown?: string;
  };
  links?: {
    internal?: Array<{ href: string }>;
  };
}

async function crawlPage(
  url: string,
  headers: Record<string, string>,
  signal?: AbortSignal
): Promise<CrawlResult | null> {
  try {
    const response = await fetch(`${CRAWL4AI_URL}/crawl`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        urls: [url],
        browser_config: { headless: true },
        crawler_config: { cache_mode: "bypass" },
      }),
      signal,
    });

    if (!response.ok) return null;

    const data = await response.json();
    const result = data?.results?.[0];
    if (!result?.success) return null;
    return result as CrawlResult;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------
// Link discovery (multi-prefix aware)
// ------------------------------------------------------------------

/**
 * Extract internal links from a crawl result that match any of the given path prefixes.
 */
function discoverLinks(result: CrawlResult, domain: string, pathPrefixes: string[]): string[] {
  const internal = result.links?.internal ?? [];
  const seen = new Set<string>();

  for (const link of internal) {
    const href = link.href;
    if (!href) continue;

    try {
      const u = new URL(href);
      if (u.hostname !== domain) continue;

      u.hash = "";
      u.search = "";
      const clean = u.origin + u.pathname.replace(/\/$/, "");
      const cleanPath = new URL(clean).pathname;

      // Check if the URL falls under any of the allowed path prefixes
      const matchesPrefix = pathPrefixes.some((prefix) => cleanPath.startsWith(prefix));
      if (!matchesPrefix) continue;

      seen.add(clean);
    } catch {
      continue;
    }
  }

  return Array.from(seen).sort();
}

/**
 * Recursively discover all pages using BFS.
 * Crawls each discovered page to find more links, up to MAX_PAGES.
 * Returns discovered URLs and cached crawl results for reuse.
 */
async function discoverAllPages(
  entryUrls: string[],
  domain: string,
  pathPrefixes: string[],
  headers: Record<string, string>,
  signal: AbortSignal | undefined,
  onUpdate?: (update: any) => void
): Promise<{ urls: string[]; crawlCache: Map<string, CrawlResult> }> {
  const discovered = new Set<string>();
  const queue: string[] = [];
  const crawlCache = new Map<string, CrawlResult>();

  // Seed the queue with all entry URLs
  for (const url of entryUrls) {
    const clean = url.replace(/\/$/, "");
    if (!discovered.has(clean)) {
      discovered.add(clean);
      queue.push(clean);
    }
  }

  while (queue.length > 0 && discovered.size < MAX_PAGES) {
    if (signal?.aborted) break;

    // Process a batch of pages concurrently
    const batch = queue.splice(0, DISCOVERY_CONCURRENCY);

    onUpdate?.({
      content: [
        {
          type: "text",
          text: `Discovering pages... ${discovered.size} found, crawling ${batch.length} pages (${queue.length} queued)`,
        },
      ],
      details: { phase: "discovery", discovered: discovered.size },
    });

    const results = await Promise.all(
      batch.map(async (url) => {
        const result = await crawlPage(url, headers, signal);
        return { url, result };
      })
    );

    for (const { url, result } of results) {
      if (!result) continue;

      crawlCache.set(url, result);

      // Extract links from this page and add new ones to the queue
      const newLinks = discoverLinks(result, domain, pathPrefixes);
      for (const link of newLinks) {
        if (!discovered.has(link) && discovered.size < MAX_PAGES) {
          discovered.add(link);
          queue.push(link);
        }
      }
    }
  }

  if (discovered.size >= MAX_PAGES) {
    onUpdate?.({
      content: [
        {
          type: "text",
          text: `⚠️ Hit max page limit (${MAX_PAGES}). Some pages may not be included.`,
        },
      ],
      details: { phase: "discovery", discovered: discovered.size, capped: true },
    });
  }

  return { urls: Array.from(discovered).sort(), crawlCache };
}

// ------------------------------------------------------------------
// Extractors (website mode)
// ------------------------------------------------------------------

function extractTitle(result: CrawlResult): string {
  const meta = result.metadata;
  if (!meta) return "";
  const raw = meta["og:title"] || meta.title || "";
  return raw.replace(/\s*[|–—-]\s*[^|–—-]+$/, "").trim();
}

function extractDescription(result: CrawlResult): string {
  const meta = result.metadata;
  if (!meta) return "";
  return (meta["og:description"] || meta.description || "").trim();
}

function extractMarkdown(result: CrawlResult): string {
  const md = result.markdown;
  if (!md) return "";
  return md.raw_markdown || md.markdown_with_citations || md.fit_markdown || "";
}

/**
 * Compute the common path prefix from multiple path prefixes.
 * E.g., ["/packer/docs", "/packer/install", "/packer/tutorials"] => "/packer"
 */
function computeCommonPrefix(prefixes: string[]): string {
  if (prefixes.length === 0) return "";
  if (prefixes.length === 1) return prefixes[0];

  const segments = prefixes.map((p) => p.split("/").filter(Boolean));
  const common: string[] = [];

  for (let i = 0; i < segments[0].length; i++) {
    const seg = segments[0][i];
    if (segments.every((s) => s[i] === seg)) {
      common.push(seg);
    } else {
      break;
    }
  }

  return common.length > 0 ? "/" + common.join("/") : "";
}

/**
 * Convert a URL to a local filename, relative to the common path prefix.
 */
function urlToFilename(url: string, commonPrefix: string): string {
  const pagePath = new URL(url).pathname.replace(/\/$/, "");
  let relative = pagePath.slice(commonPrefix.length).replace(/^\//, "");
  if (!relative) return "index.md";
  return relative.toLowerCase() + ".md";
}

/**
 * Group discovered URLs by their first path segment after the common prefix.
 * Returns a map of section → list of URLs + metadata.
 */
function groupUrlsBySection(
  urls: string[],
  commonPrefix: string,
  crawlCache: Map<string, CrawlResult>
): Map<string, Array<{ url: string; title: string; path: string }>> {
  const groups = new Map<string, Array<{ url: string; title: string; path: string }>>();

  for (const url of urls) {
    const pagePath = new URL(url).pathname.replace(/\/$/, "");
    const relative = pagePath.slice(commonPrefix.length).replace(/^\//, "");

    // First segment is the section
    const parts = relative.split("/");
    const section = parts[0] || "(root)";

    // Try to get title from crawl cache
    let title = "";
    const cached = crawlCache.get(url);
    if (cached) {
      title = extractTitle(cached);
    }

    if (!groups.has(section)) {
      groups.set(section, []);
    }
    groups.get(section)!.push({ url, title, path: relative });
  }

  return groups;
}

// ------------------------------------------------------------------
// Root detection
// ------------------------------------------------------------------

function detectDocsRoot(url: string): string | null {
  const parsed = new URL(url);
  const segments = parsed.pathname.replace(/\/$/, "").split("/").filter(Boolean);

  const docsRoots = [
    "docs", "documentation", "guide", "guides", "manual", "reference",
    "wiki", "help", "learn", "tutorial", "tutorials", "api",
  ];

  const rootIdx = segments.findIndex((s) => docsRoots.includes(s.toLowerCase()));
  if (rootIdx === -1) return null;
  if (segments.length > rootIdx + 1) {
    return parsed.origin + "/" + segments.slice(0, rootIdx + 1).join("/");
  }
  return null;
}

// ------------------------------------------------------------------
// Tool definition
// ------------------------------------------------------------------

const ParameterSchema = Type.Object({
  url: Type.String({
    description:
      "The entry URL of the documentation site or a GitHub repository docs directory " +
      "(e.g. https://opencode.ai/docs or https://github.com/owner/repo/tree/main/docs)",
  }),
  sections: Type.Optional(
    Type.String({
      description:
        "Comma-separated list of additional section URLs to crawl under the same domain. " +
        "Use this when a doc site has multiple top-level sections that are siblings, not children. " +
        "For example, for HashiCorp Packer with url='https://developer.hashicorp.com/packer/docs', " +
        "set sections='https://developer.hashicorp.com/packer/install,https://developer.hashicorp.com/packer/tutorials," +
        "https://developer.hashicorp.com/packer/guides,https://developer.hashicorp.com/packer/integrations'. " +
        "All sections must be on the same domain as the main url.",
    })
  ),
  urls: Type.Optional(
    Type.String({
      description:
        "Newline-separated list of specific URLs to fetch. Use this in the second phase after " +
        "discovery: the tool returns discovered URLs grouped by section, you curate the list " +
        "(removing old versions, overly detailed pages, non-doc pages, etc.), then call again " +
        "with this parameter containing only the URLs you want to actually download. " +
        "When this is set, discovery is skipped and only these URLs are fetched.",
    })
  ),
  scope: Type.Optional(
    StringEnum(["auto", "as-is"] as const, {
      description:
        'How to handle URLs that look like subpages. ' +
        '"auto" tries to find the docs root automatically. ' +
        '"as-is" uses the given URL as-is. ' +
        "Only set this when responding to a root-detection prompt.",
    })
  ),
  location: Type.Optional(
    StringEnum(["project", "global"] as const, {
      description:
        'Where to store the docs. ' +
        '"project" saves to .ai/ref-docs/{domain}/ in the current project. ' +
        '"global" saves to ~/.pi/.ai/ref-docs/{domain}/ for use across all projects. ' +
        "If not specified, the user will be asked to choose.",
    })
  ),
});

type FetchdocsParams = Static<typeof ParameterSchema>;

const DESCRIPTION = readFileSync(join(__dirname, "docsfetch.txt"), "utf8").trim();

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "docsfetch",
    label: "Docs Fetch",
    description: DESCRIPTION,
    parameters: ParameterSchema,

    async execute(toolCallId, params, signal, onUpdate, ctx) {
      const entryUrl = params.url.replace(/\/$/, "");

      // Validate URL
      if (!entryUrl.startsWith("http://") && !entryUrl.startsWith("https://")) {
        return {
          content: [{ type: "text", text: "Error: URL must start with http:// or https://" }],
          details: { error: true },
          isError: true,
        };
      }

      // Ask user for location if not specified
      const location = params.location;
      if (!location) {
        return {
          content: [
            {
              type: "text",
              text:
                `Where should the docs be stored?\n\n` +
                `1. location="project" — save to .ai/ref-docs/ in this project (only available here)\n` +
                `2. location="global" — save to ~/.pi/.ai/ref-docs/ (available across all projects)\n\n` +
                `Ask the user which they prefer, then call docsfetch again with the same url and the chosen location.`,
            },
          ],
          details: { needsInput: true },
        };
      }

      // ----------------------------------------------------------
      // GitHub mode
      // ----------------------------------------------------------
      const gh = parseGitHubUrl(entryUrl);
      if (gh) {
        const domainKey = gitHubDomainKey(gh);
        const baseDir =
          location === "global"
            ? join(homedir(), ".pi", ".ai", "ref-docs", ...domainKey.split("/"))
            : join(process.cwd(), ".ai", "ref-docs", ...domainKey.split("/"));

        return fetchGitHubDocs(gh, baseDir, domainKey, location, signal, onUpdate);
      }

      // ----------------------------------------------------------
      // Website mode (Crawl4AI)
      // ----------------------------------------------------------

      const domain = new URL(entryUrl).hostname;

      // Build the list of all section URLs and path prefixes
      const allSectionUrls: string[] = [entryUrl];
      if (params.sections) {
        const extras = params.sections
          .split(",")
          .map((s) => s.trim().replace(/\/$/, ""))
          .filter((s) => s.length > 0);
        allSectionUrls.push(...extras);
      }

      // Validate all section URLs are on the same domain
      for (const sectionUrl of allSectionUrls) {
        try {
          const parsed = new URL(sectionUrl);
          if (parsed.hostname !== domain) {
            return {
              content: [
                {
                  type: "text",
                  text: `Error: Section URL "${sectionUrl}" is on a different domain (${parsed.hostname}) than the main URL (${domain}). All sections must be on the same domain.`,
                },
              ],
              details: { error: true },
              isError: true,
            };
          }
        } catch {
          return {
            content: [
              { type: "text", text: `Error: Invalid section URL: "${sectionUrl}"` },
            ],
            details: { error: true },
            isError: true,
          };
        }
      }

      // Compute path prefixes for link filtering
      const pathPrefixes = allSectionUrls.map(
        (url) => new URL(url).pathname.replace(/\/$/, "")
      );

      // Compute common prefix for filename generation
      const commonPrefix = computeCommonPrefix(pathPrefixes);

      // Build the domain key: hostname + common prefix path segments.
      // This allows multiple doc sets on the same domain to coexist,
      // e.g. developer.hashicorp.com/packer vs developer.hashicorp.com/terraform.
      //
      // Only include the common prefix when it's a TRUE product prefix — i.e. when
      // it's a strict prefix of at least one section path (not equal to any of them).
      // For example:
      //   /packer/docs, /packer/install → common=/packer → strict prefix → include → "domain/packer"
      //   /docs (single section)        → common=/docs   → equals section → exclude → "domain"
      const isStrictPrefix = commonPrefix !== "" &&
        pathPrefixes.some((p) => p !== commonPrefix && p.startsWith(commonPrefix));
      const domainKeySegments = isStrictPrefix
        ? commonPrefix.split("/").filter(Boolean)
        : [];
      const domainKey = [domain, ...domainKeySegments].join("/");

      const outDir =
        location === "global"
          ? join(homedir(), ".pi", ".ai", "ref-docs", ...domainKey.split("/"))
          : join(process.cwd(), ".ai", "ref-docs", ...domainKey.split("/"));

      let creds: { clientId: string; clientSecret: string };
      try {
        creds = getCloudflareCreds();
      } catch (err: any) {
        return {
          content: [{ type: "text", text: err.message }],
          details: { error: true },
          isError: true,
        };
      }

      const headers = getHeaders(creds);
      const scrapedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

      // ----------------------------------------------------------
      // Phase 2: Fetch specific URLs (when urls parameter is provided)
      // ----------------------------------------------------------
      if (params.urls) {
        const urlList = params.urls
          .split("\n")
          .map((u) => u.trim().replace(/\/$/, ""))
          .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://")));

        if (urlList.length === 0) {
          return {
            content: [{ type: "text", text: "Error: No valid URLs provided in the urls parameter." }],
            details: { error: true },
            isError: true,
          };
        }

        return fetchWebsitePages(
          urlList, domainKey, commonPrefix, outDir, location, headers, creds, scrapedAt, signal, onUpdate
        );
      }

      // ----------------------------------------------------------
      // Phase 1: Discover pages
      // ----------------------------------------------------------

      // Detect if this looks like a subpage rather than a docs root
      // Skip root detection when sections are provided (user knows what they want)
      const scope = params.scope;
      if (!scope && !params.sections) {
        const candidateRoot = detectDocsRoot(entryUrl);
        if (candidateRoot) {
          return {
            content: [
              {
                type: "text",
                text:
                  `The URL "${entryUrl}" looks like a subpage, not a docs root.\n` +
                  `The likely docs root is: ${candidateRoot}\n\n` +
                  `Options — call docsfetch again with one of:\n` +
                  `1. url="${candidateRoot}" — use the detected root\n` +
                  `2. url="${entryUrl}", scope="auto" — auto-detect and use the root (${candidateRoot})\n` +
                  `3. url="${entryUrl}", scope="as-is" — fetch from the current URL as-is\n\n` +
                  `Ask the user which option they prefer.`,
              },
            ],
            details: { needsInput: true, candidateRoot, originalUrl: entryUrl },
          };
        }
      }

      // If scope is "auto", resolve to the detected root
      let resolvedUrl = entryUrl;
      if (scope === "auto") {
        const candidateRoot = detectDocsRoot(entryUrl);
        if (candidateRoot) {
          resolvedUrl = candidateRoot;
          // Rebuild section URLs with resolved root
          allSectionUrls[0] = resolvedUrl;
        }
      }

      onUpdate?.({
        content: [
          {
            type: "text",
            text: `Discovering pages from ${allSectionUrls.length} section(s)...`,
          },
        ],
        details: { phase: "discovery" },
      });

      const { urls: discoveredUrls, crawlCache } = await discoverAllPages(
        allSectionUrls,
        domain,
        pathPrefixes,
        headers,
        signal,
        onUpdate
      );

      if (discoveredUrls.length === 0) {
        return {
          content: [{ type: "text", text: `No doc pages found from ${resolvedUrl}` }],
          details: { error: true },
          isError: true,
        };
      }

      // Group URLs by section for the LLM to review
      const grouped = groupUrlsBySection(discoveredUrls, commonPrefix, crawlCache);

      // Build a human/LLM-readable summary
      const summaryLines: string[] = [];
      summaryLines.push(
        `Discovered ${discoveredUrls.length} pages across ${grouped.size} section(s) on ${domainKey}.`
      );
      summaryLines.push("");
      summaryLines.push(
        "Review the sections below. Call docsfetch again with the same url, location, " +
        "and sections parameters, plus a `urls` parameter containing a newline-separated " +
        "list of the URLs you want to fetch. Remove pages you don't need — e.g.:"
      );
      summaryLines.push("  - Old version pages (e.g. v1.5.x, v1.6.x — keep only latest)");
      summaryLines.push("  - Overly granular subpages if the parent page covers the topic");
      summaryLines.push("  - Pages that aren't actual documentation (changelogs, marketing, etc.)");
      summaryLines.push("");

      // Build the full URL list too
      const allUrlsList: string[] = [];

      for (const [section, pages] of Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
        summaryLines.push(`### ${section} (${pages.length} pages)`);
        for (const page of pages.sort((a, b) => a.path.localeCompare(b.path))) {
          const label = page.title ? ` — ${page.title}` : "";
          summaryLines.push(`  ${page.url}${label}`);
          allUrlsList.push(page.url);
        }
        summaryLines.push("");
      }

      return {
        content: [{ type: "text", text: summaryLines.join("\n") }],
        details: {
          phase: "discovery_complete",
          domain: domainKey,
          totalPages: discoveredUrls.length,
          sections: grouped.size,
          capped: discoveredUrls.length >= MAX_PAGES,
        },
      };
    },

    renderCall(args, theme) {
      let text = theme.fg("toolTitle", theme.bold("docsfetch "));
      text += theme.fg("muted", args.url || "");
      if (args.sections) {
        const count = args.sections.split(",").filter((s: string) => s.trim()).length;
        text += theme.fg("dim", ` +${count} sections`);
      }
      if (args.urls) {
        const count = args.urls.split("\n").filter((u: string) => u.trim()).length;
        text += theme.fg("dim", ` [${count} urls]`);
      }
      return new Text(text, 0, 0);
    },

    renderResult(result, { expanded, isPartial }, theme) {
      if (isPartial) {
        const current = (result.details as any)?.current;
        const total = (result.details as any)?.total;
        const discovered = (result.details as any)?.discovered;

        let text = theme.fg("warning", "⟳ ");
        const msg =
          result.content
            ?.filter((c: any) => c.type === "text")
            .map((c: any) => c.text)
            .join("") || "working";
        text += theme.fg("muted", msg);

        if (current && total) {
          text += theme.fg("dim", ` [${current}/${total}]`);
        } else if (discovered) {
          text += theme.fg("dim", ` [${discovered} found]`);
        }

        return new Text(text, 0, 0);
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

      // Discovery complete — show summary
      if (details?.phase === "discovery_complete") {
        let text = theme.fg("accent", "🔍 ");
        text += theme.fg("muted", `Discovered ${details.totalPages} pages across ${details.sections} sections`);
        if (details.capped) {
          text += theme.fg("warning", " (max reached)");
        }
        text += theme.fg("dim", " — review and call again with urls");

        if (expanded) {
          const content = result.content
            ?.filter((c: any) => c.type === "text")
            .map((c: any) => c.text)
            .join("");
          if (content) {
            text += "\n" + theme.fg("dim", content);
          }
        }

        return new Text(text, 0, 0);
      }

      const pages = details?.pages || 0;
      const newCount = details?.new || 0;
      const updated = details?.updated || 0;
      const unchanged = details?.unchanged || 0;
      const f = details?.failed || 0;
      const dir = details?.outDir || "";

      let text = theme.fg("success", "✓ ");
      text += theme.fg("muted", `${dir} — ${pages} pages`);

      const parts: string[] = [];
      if (newCount > 0) parts.push(`${newCount} new`);
      if (updated > 0) parts.push(`${updated} updated`);
      if (unchanged > 0) parts.push(`${unchanged} unchanged`);
      if (f > 0) parts.push(`${f} failed`);
      if (parts.length > 0) {
        text += theme.fg("dim", ` (${parts.join(", ")})`);
      }

      if (expanded) {
        const content = result.content
          ?.filter((c: any) => c.type === "text")
          .map((c: any) => c.text)
          .join("");
        if (content) {
          text += "\n" + theme.fg("dim", content);
        }
      }

      return new Text(text, 0, 0);
    },
  });
}

// ------------------------------------------------------------------
// Fetch phase: download specific URLs and save as markdown
// ------------------------------------------------------------------

async function fetchWebsitePages(
  urls: string[],
  domainKey: string,
  commonPrefix: string,
  outDir: string,
  location: string,
  headers: Record<string, string>,
  creds: { clientId: string; clientSecret: string },
  scrapedAt: string,
  signal: AbortSignal | undefined,
  onUpdate?: (update: any) => void
): Promise<{
  content: Array<{ type: string; text: string }>;
  details: Record<string, any>;
}> {
  // Load existing pages to determine what needs updating
  const existing = loadExistingPages(outDir);
  mkdirSync(outDir, { recursive: true });

  // Categorize pages: new, fresh (skip), stale (needs ETag check)
  const newUrls: string[] = [];
  const freshFiles: string[] = [];
  const staleUrls: string[] = [];

  for (const url of urls) {
    const filename = urlToFilename(url, commonPrefix);
    const prev = existing.get(filename);
    if (!prev) {
      newUrls.push(url);
    } else if (!isStale(prev.scrapedAt)) {
      freshFiles.push(filename);
    } else {
      staleUrls.push(url);
    }
  }

  onUpdate?.({
    content: [
      {
        type: "text",
        text:
          `${urls.length} pages to process: ` +
          `${newUrls.length} new, ${staleUrls.length} stale, ${freshFiles.length} fresh. ` +
          (staleUrls.length > 0 ? "Checking ETags..." : "Fetching new pages..."),
      },
    ],
    details: { phase: "checking", total: urls.length },
  });

  // For stale pages, do HEAD requests to check ETags
  const toFetch: string[] = [...newUrls]; // always fetch new pages

  if (staleUrls.length > 0) {
    const BATCH_SIZE = 10;
    for (let i = 0; i < staleUrls.length; i += BATCH_SIZE) {
      if (signal?.aborted) break;
      const batch = staleUrls.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (url) => {
          const filename = urlToFilename(url, commonPrefix);
          const prev = existing.get(filename)!;
          const remoteEtag = await fetchEtag(url, signal);

          if (prev.etag && remoteEtag && prev.etag === remoteEtag) {
            return { url, filename, changed: false };
          }
          return { url, filename, changed: true };
        })
      );

      for (const r of results) {
        if (r.changed) {
          toFetch.push(r.url);
        } else {
          freshFiles.push(r.filename);
          const filePath = join(outDir, r.filename);
          try {
            const content = readFileSync(filePath, "utf8");
            const { frontmatter, body } = parseFrontmatter(content);
            frontmatter.scraped_at = scrapedAt;
            writeFileSync(filePath, buildFrontmatter(frontmatter) + "\n\n" + body, "utf8");
          } catch {
            // ignore
          }
        }
      }
    }
  }

  onUpdate?.({
    content: [
      {
        type: "text",
        text:
          `${freshFiles.length} unchanged, ${toFetch.length} to fetch. ` +
          (toFetch.length > 0 ? "Crawling..." : "Done."),
      },
    ],
    details: { phase: "fetching", total: toFetch.length },
  });

  // Crawl pages that are new or changed
  const allPages: Array<{ filename: string; title: string; description: string }> = [];
  const changedPages: Array<{ filename: string; isNew: boolean }> = [];
  let failed = 0;

  // Add fresh (skipped) pages to allPages for index generation
  for (const filename of freshFiles) {
    const prev = existing.get(filename);
    allPages.push({
      filename,
      title: prev?.title || "",
      description: prev?.description || "",
    });
  }

  for (let i = 0; i < toFetch.length; i++) {
    const url = toFetch[i];
    const filename = urlToFilename(url, commonPrefix);
    const isNew = !existing.has(filename);

    if (signal?.aborted) {
      return {
        content: [{ type: "text", text: "Aborted by user" }],
        details: { error: true },
        isError: true,
      };
    }

    onUpdate?.({
      content: [
        {
          type: "text",
          text: `Crawling ${i + 1}/${toFetch.length}: ${filename}${isNew ? " (new)" : " (changed)"}`,
        },
      ],
      details: { phase: "fetching", current: i + 1, total: toFetch.length },
    });

    const result = await crawlPage(url, headers, signal);

    if (!result) {
      failed++;
      continue;
    }

    const title = extractTitle(result);
    const description = extractDescription(result);
    const markdown = extractMarkdown(result);

    if (!markdown) {
      failed++;
      continue;
    }

    const etag = await fetchEtag(url, signal);

    const frontmatter = buildFrontmatter({
      title,
      description,
      domain: domainKey,
      source: url,
      scraped_at: scrapedAt,
      ...(etag ? { etag } : {}),
    });

    const filePath = join(outDir, filename);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, frontmatter + "\n\n" + markdown, "utf8");

    allPages.push({ filename, title, description });
    changedPages.push({ filename, isNew });
  }

  // Sort allPages by filename for consistent index
  allPages.sort((a, b) => a.filename.localeCompare(b.filename));

  // Regenerate _index.md
  const indexLines = [
    buildFrontmatter({
      title: `${domainKey} Documentation`,
      description: `Documentation index for ${domainKey} (${allPages.length} pages)`,
      domain: domainKey,
      source: urls[0],
      scraped_at: scrapedAt,
    }),
    "",
    `# ${domainKey} Documentation`,
    "",
  ];

  for (const page of allPages) {
    const label = page.title || page.filename.replace(/\.md$/, "");
    const desc = page.description ? ` - ${page.description}` : "";
    indexLines.push(`- [${label}](./${page.filename})${desc}`);
  }

  writeFileSync(join(outDir, "_index.md"), indexLines.join("\n") + "\n", "utf8");

  // Build summary
  const newCount = changedPages.filter((p) => p.isNew).length;
  const updatedCount = changedPages.filter((p) => !p.isNew).length;
  const unchangedCount = freshFiles.length;

  const lines: string[] = [];
  const displayDir =
    location === "global"
      ? `~/.pi/.ai/ref-docs/${domainKey}/`
      : `.ai/ref-docs/${domainKey}/`;

  lines.push(
    `${allPages.length} pages in ${displayDir} (${location}) — ` +
      `${newCount} new, ${updatedCount} updated, ` +
      `${unchangedCount} unchanged, ${failed} failed`
  );

  if (changedPages.length === 0) {
    lines.push("", "All pages are up to date.");
  } else {
    lines.push("");
    const MAX_LIST = 10;
    const displayList = changedPages
      .map((p) => `  ${p.isNew ? "+" : "~"} ${p.filename} (${p.isNew ? "new" : "updated"})`)

    if (displayList.length <= MAX_LIST) {
      lines.push("Changed pages:");
      lines.push(...displayList);
    } else {
      lines.push("Changed pages:");
      lines.push(...displayList.slice(0, MAX_LIST));
      lines.push(`  ... and ${displayList.length - MAX_LIST} more`);
    }
  }

  return {
    content: [{ type: "text", text: lines.join("\n") }],
    details: {
      domain: domainKey,
      pages: allPages.length,
      new: newCount,
      updated: updatedCount,
      unchanged: unchangedCount,
      failed,
      location,
      outDir: displayDir,
    },
  };
}
