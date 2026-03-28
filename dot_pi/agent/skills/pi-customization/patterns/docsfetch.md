# Pattern: Docsfetch Tool

A documentation scraper tool that fetches entire doc sites (websites or GitHub repos)
and saves them locally as structured markdown with frontmatter. Works with a companion
`ref-docs` extension that injects cached docs into the LLM system prompt.

Built on top of the [tools-system](tools-system.md) pattern — lives in
`~/.pi/agent/extensions/tools/` and is auto-discovered by `index.ts`.

## File Layout

```
~/.pi/agent/extensions/tools/
├── docsfetch.ts          # Tool implementation: website + GitHub modes
├── docsfetch.txt         # LLM-facing description

~/.pi/agent/extensions/
├── ref-docs.ts           # Companion extension: scans ref-docs, injects into system prompt
```

### Output Layout

Fetched docs are saved under `.ai/ref-docs/` (project) or `~/.pi/.ai/ref-docs/` (global):

```
~/.pi/.ai/ref-docs/
├── opencode.ai/                              # Website docs (domain key = hostname when no common prefix)
│   ├── _index.md                             # Table of contents with frontmatter
│   ├── config.md
│   └── tools.md
├── developer.hashicorp.com/                  # Shared domain with product-specific subdirs
│   ├── packer/                               # domain key = hostname + common path prefix
│   │   ├── _index.md
│   │   ├── docs/
│   │   └── install.md
│   └── terraform/                            # Another product on the same domain
│       ├── _index.md
│       ├── docs/
│       └── install.md
├── github.com/danielmiessler/fabric/         # GitHub docs (nested domain path)
│   ├── _index.md
│   ├── automated-changelog.md                # All filenames lowercase
│   └── rest-api.md
```

## Two Modes

### 1. Website Mode (Crawl4AI) — Two-Phase Flow

For standard documentation sites (e.g. `https://opencode.ai/docs`).

Website mode uses a **two-phase approach** to avoid downloading too many pages:

#### Phase 1: Discover

Call docsfetch with just `url` (and optionally `sections`, `scope`, `location`).
The tool:
- **Recursively discovers** all reachable pages via BFS (breadth-first search)
- Crawls each discovered page to find more links (up to 500 page safety cap)
- Groups discovered URLs by section with page counts and titles
- Returns the grouped URL list to the LLM — **does NOT download/save any pages**

#### Phase 2: Fetch

The LLM reviews the discovered URLs and curates the list, then calls docsfetch again
with the same `url`/`sections`/`location` plus a `urls` parameter containing a
newline-separated list of only the URLs to actually download.

The LLM should filter intelligently:
- Remove old version pages (keep only latest)
- Remove marketing pages, changelogs, blog posts
- Remove overly granular subpages if the parent covers the topic
- Keep core docs, API refs, config guides, getting-started pages
- Aim for 20–80 pages typically

#### Multi-section support

The `sections` parameter allows crawling multiple sibling URL paths under the same
domain (e.g. `/packer/docs`, `/packer/install`, `/packer/tutorials` etc.).

When `sections` is provided:
- Root detection is skipped (the user explicitly specified what they want)
- The tool computes the common path prefix for filename generation
- Links matching any section prefix are followed during discovery

#### Other website mode details

- Only follows links on the same domain and under the allowed path prefixes
- **Discovery crawl cache**: pages crawled during discovery are cached in memory
  (but since discovery and fetch are separate tool calls, the cache is not shared
  between phases — the fetch phase crawls pages fresh)
- **Domain key**: the hostname plus common path prefix segments
  (e.g. `developer.hashicorp.com/packer` for sections under `/packer/...`,
  or just `opencode.ai` when there's no common prefix beyond the hostname).
  This allows multiple doc sets on the same domain to coexist without collisions.
- **Filename generation**: filenames are relative to the computed common path prefix
  across all section URLs
- **Freshness**: Time-based staleness (7 days) + HTTP ETag comparison
- **Requires**: `CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_ID` and
  `CLOUDFLARE_ACCESS_CRAWL4AI_CLIENT_SECRET` environment variables

### 2. GitHub Mode

For markdown files in a GitHub repository directory (e.g.
`https://github.com/owner/repo/tree/main/docs`).

GitHub mode does **NOT** use the two-phase flow — it fetches all markdown files
directly since GitHub repos typically have a well-curated set of docs already.

- Detects GitHub URLs matching `github.com/{owner}/{repo}/tree/{branch}/{path}`
- Uses the GitHub Contents API to list all `.md` files (recursively)
- Fetches raw markdown content via `download_url`
- **Domain key**: `github.com/owner/repo` — all **lowercase**
- **Freshness**: Uses the file `sha` from the GitHub API. On re-run, compares
  the stored SHA against the current API SHA — only re-fetches files where SHA changed.
- **Optional**: `GITHUB_TOKEN` environment variable for higher API rate limits

## Recursive Discovery (Website Mode)

The tool uses BFS (breadth-first search) to discover all reachable pages:

1. Seed the queue with all entry/section URLs
2. Crawl pages from the queue in batches of 5 (concurrent)
3. For each crawled page, extract internal links matching any allowed path prefix
4. Add newly-discovered URLs to the queue
5. Continue until the queue is empty or the 500-page safety cap is reached

This solves the problem with JavaScript-rendered sites (like HashiCorp Developer)
where sidebar navigation links are behind expandable menus. By crawling each
discovered page, we find links that weren't visible on the entry page alone.

After discovery, URLs are grouped by their first path segment after the common prefix
(e.g. `docs`, `install`, `tutorials`) with titles extracted from cached crawl results.
The grouped list is returned to the LLM for intelligent filtering.

## Frontmatter Format

Every saved page has YAML frontmatter:

```yaml
---
title: "Page Title"
description: "Brief description"
domain: "github.com/danielmiessler/fabric"
source: "https://github.com/danielmiessler/Fabric/blob/main/docs/rest-api.md"
scraped_at: "2026-03-01T12:00:00Z"
sha: "abc123def456"
---
```

| Field | Website mode | GitHub mode |
|-------|-------------|-------------|
| `title` | From `<title>` / og:title | From first `# Heading` in markdown |
| `description` | From meta description / og:description | From first paragraph after heading |
| `domain` | Hostname (e.g. `developer.hashicorp.com`) | `github.com/owner/repo` (lowercase) |
| `source` | Original page URL | GitHub blob URL |
| `scraped_at` | ISO timestamp | ISO timestamp |
| `etag` | HTTP ETag (website only) | — |
| `sha` | — | Git blob SHA (GitHub only) |

## Incremental Updates

### Website mode
1. Pages scraped less than 7 days ago → **skipped** (zero requests)
2. Stale pages → lightweight HTTP HEAD to compare ETag
3. ETag matches → mark fresh, update `scraped_at` timestamp
4. ETag differs or missing → re-crawl via Crawl4AI

### GitHub mode
1. Fetch current file list + SHAs from GitHub Contents API (1 request per directory)
2. Compare each file's SHA against stored `sha` in frontmatter
3. SHA matches → **skipped** (zero additional requests)
4. SHA differs or file is new → fetch raw content

## Root Detection (Website Mode Only)

If the URL looks like a subpage (e.g. `https://example.com/docs/getting-started`),
the tool detects known doc root segments (`docs`, `guide`, `wiki`, `api`, etc.)
and prompts the user to choose between using the detected root or the URL as-is.

Root detection is **skipped** when `sections` is provided, since the user is
explicitly specifying which paths to crawl.

GitHub URLs skip root detection entirely — the URL path structure defines the directory.

## The _index.md File

Each doc site generates a `_index.md` with:
- Frontmatter containing domain, description, page count, source URL
- Markdown list of all pages linking to local files with titles and descriptions

## Companion: ref-docs Extension

`~/.pi/agent/extensions/ref-docs.ts` is a standalone extension (default export, not
part of the tools system) that:

1. On `session_start`: recursively scans `.ai/ref-docs/` (project) and
   `~/.pi/.ai/ref-docs/` (global) for `_index.md` files at **any depth**
2. Parses frontmatter and page lists from each `_index.md`
3. Deduplicates by domain — keeps the most recently scraped version
4. On `before_agent_start`: injects a `## Reference Documentation` section
   into the system prompt listing all available doc sites, their pages, and
   file paths so the LLM can `read` specific pages on demand

### Recursive scanning

The scanner uses `findIndexDirs()` to recursively search for directories
containing `_index.md`. This is essential for nested domain paths like
`github.com/danielmiessler/fabric/` which are 3 levels deep under `ref-docs/`.

## Tool Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `url` | Yes | Entry URL — website docs or GitHub `tree/` URL |
| `sections` | No | Comma-separated list of additional section URLs to crawl. Must be on the same domain. Use for sites with multiple sibling doc sections. |
| `urls` | No | Newline-separated list of specific URLs to fetch (Phase 2). When set, discovery is skipped and only these URLs are downloaded. |
| `scope` | No | `"auto"` or `"as-is"` — only for website root-detection prompts. Skipped when `sections` is provided. |
| `location` | No | `"project"` or `"global"` — where to save. If omitted, tool asks user to choose. |

## Key Design Decisions

- **Two-phase flow**: Discovery and fetch are separate tool calls. This lets the
  LLM (with AI judgment) curate the URL list between phases — removing old versions,
  marketing pages, and overly granular subpages. This prevents downloading 300+ pages
  when only 50 are useful.
- **BFS discovery**: Crawls every discovered page to find deeper links, solving the
  problem with JavaScript-rendered expandable sidebar menus (common in modern doc sites).
- **Concurrency**: Discovery uses 5 concurrent crawls per batch, balancing speed
  against overwhelming the Crawl4AI service.
- **500-page safety cap**: Prevents runaway crawling on large sites.
- **Common prefix for filenames and domain key**: When multiple sections are provided,
  the tool computes the longest common path prefix. This prefix is used both for
  generating sensible filenames (relative paths within the output directory) and for
  constructing the domain key (hostname + common prefix), which determines the output
  directory path. This allows multiple doc sets on the same domain (e.g.
  `developer.hashicorp.com/packer` and `developer.hashicorp.com/terraform`) to coexist.
- **GitHub mode is single-phase**: GitHub repos already have curated docs, so no
  discovery/filtering step is needed.

## Reference Implementation

The live files are the reference:
- `~/.pi/agent/extensions/tools/docsfetch.ts`
- `~/.pi/agent/extensions/tools/docsfetch.txt`
- `~/.pi/agent/extensions/ref-docs.ts`
