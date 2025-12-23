---
description: Intelligent two-layer content retrieval system for DIFFICULT content retrieval. Uses built-in tools (WebFetch) and BrightData MCP (CAPTCHA handling, advanced scraping). USE ONLY WHEN user indicates difficulty accessing content.
globs: ""
alwaysApply: false
---

# Retrieve Workflow

Intelligent multi-layer content retrieval system for DIFFICULT content retrieval.

## When to Use This Workflow

**USE this workflow when user indicates difficulty:**
- "I can't get this content"
- "Having trouble retrieving this"
- "Site is blocking me"
- "Protected site" / "CloudFlare protected"
- "Keeps giving me CAPTCHA"
- "Won't let me scrape this"
- "Bot detection blocking me"
- "Rate limited when trying to get this"

**DO NOT use this workflow for simple requests:**
- "Read this page" → Use WebFetch directly
- "Get content from [URL]" → Use WebFetch directly
- "What does this site say" → Use WebFetch directly

**Simple rule:** Only activate when user signals DIFFICULTY, not for routine content requests.

---

## Two-Layer Escalation Strategy

```
Layer 1: Built-in Tools (Fast, Simple, FREE)
   ↓ (If blocked, rate-limited, or fails)
Layer 2: BrightData MCP (CAPTCHA handling, advanced scraping)
```

### Decision Tree: Which Layer to Use?

**Start with Layer 1 (Built-in) if:**
- Simple public webpage
- No known bot detection
- Standard HTML content
- Quick one-off fetch

**Use Layer 2 (BrightData) if:**
- Layer 1 blocked or failed
- Known bot detection (CloudFlare, etc.)
- CAPTCHA protection
- Rate limiting encountered
- Multiple pages from same domain
- Search engine results needed (Google, Bing, Yandex)

---

## Layer 1: Built-in Tools

### WebFetch Tool

**Best for:** Simple HTML pages, public content, one-off fetches

**Usage:**
```
Use WebFetch tool with:
- url: "https://example.com/page"
- prompt: "Extract the main article content and author name"
```

**When it fails:**
- Returns error about blocked request
- Gets rate-limited (429 status)
- Receives CAPTCHA challenge
- Returns empty/broken content
→ **Escalate to Layer 2 (BrightData)**

### WebSearch Tool

**Best for:** Finding content when you have keywords but not URLs

**Usage:**
```
Use WebSearch tool with:
- query: "latest React 19 features documentation"
- allowed_domains: ["react.dev"] (optional)
```

**When it fails:**
- Need more comprehensive search results
- Need specific search engine (Google, Bing, Yandex)
→ **Escalate to Layer 2 (BrightData search_engine)**

---

## Layer 2: BrightData MCP

### Prerequisites

- `BRIGHTDATA_API_TOKEN` environment variable must be set
- BrightData MCP server must be configured in OpenCode

### scrape_as_markdown Tool

**Best for:** Sites with bot protection, CAPTCHA, JavaScript rendering

**Key Features:**
- Bypasses CloudFlare, bot detection, CAPTCHAs
- Returns clean markdown (perfect for LLM consumption)
- Handles JavaScript-heavy sites
- Residential proxy network

**Usage:**
```
Use mcp__brightdata__scrape_as_markdown with:
- url: "https://protected-site.com/article"
```

**For multiple URLs (up to 10):**
```
Use mcp__brightdata__scrape_batch with:
- urls: ["https://site.com/page1", "https://site.com/page2", "https://site.com/page3"]
```

**When to use:**
- Layer 1 WebFetch failed with blocking/CAPTCHA
- Known protected sites (CloudFlare, etc.)
- Need batch scraping from same domain
- Want markdown output for LLM processing

### search_engine Tool

**Best for:** Getting search results from Google, Bing, Yandex

**Usage:**
```
Use mcp__brightdata__search_engine with:
- engine: "google"
- query: "React 19 server components"
```

**For multiple search engines:**
```
Use mcp__brightdata__search_engine_batch with:
- queries: [
    { "engine": "google", "query": "React 19 features" },
    { "engine": "bing", "query": "React 19 features" }
  ]
```

**When to use:**
- Need search engine results (not just website content)
- Want multiple search engines for comprehensive coverage
- Layer 1 WebSearch insufficient

---

## Complete Retrieval Workflow

### Example: Retrieve Article Content

**User request:** "Get me the content from https://example.com/article"

**Execution:**

```
Step 1: Try Layer 1 (Built-in) first
→ WebFetch url="https://example.com/article" prompt="Extract the main article content"

Step 2: If Layer 1 fails (blocked/CAPTCHA):
→ mcp__brightdata__scrape_as_markdown url="https://example.com/article"
```

### Example: Search + Scrape Multiple Pages

**User request:** "Get content about React 19 from the top 5 search results"

**Execution:**

```
Step 1: Try Layer 1 for search:
→ WebSearch query="React 19 features documentation"
→ Extract URLs from results

Step 2: Fetch each URL with Layer 1:
→ WebFetch url=url1 prompt="Extract main content"
→ WebFetch url=url2 prompt="Extract main content"
(can run in parallel)

Step 3: If any Layer 1 fetches fail, use Layer 2 batch:
→ mcp__brightdata__scrape_batch urls=[url1, url2, url3, url4, url5]
```

### Example: Protected Site Scraping

**User request:** "Scrape this CloudFlare-protected site"

**Execution:**

```
Step 1: Skip Layer 1 (known to fail on protected sites)
→ Go directly to Layer 2

Step 2: Use BrightData:
→ mcp__brightdata__scrape_as_markdown url="https://cloudflare-protected-site.com"
```

---

## Layer Comparison Matrix

| Feature | Layer 1 (Built-in) | Layer 2 (BrightData) |
|---------|-------------------|----------------------|
| **Speed** | Fast (< 5s) | Medium (10-30s) |
| **Bot Detection Bypass** | No | Yes |
| **CAPTCHA Handling** | No | Yes |
| **JavaScript Rendering** | Limited | Full |
| **Batch Operations** | Manual | Up to 10 |
| **Search Integration** | Basic | Multi-engine |
| **Markdown Output** | Yes | Yes |
| **Cost** | Free | Paid |
| **Best For** | Simple pages | Protected sites |

---

## Error Handling & Escalation

**Layer 1 Errors → Escalate to Layer 2:**
- HTTP 403 (Forbidden)
- HTTP 429 (Rate Limited)
- HTTP 503 (Service Unavailable)
- Empty content returned
- CAPTCHA challenge detected
- Bot detection messages

**Layer 2 Errors → Report to User:**
- All layers exhausted
- Site technically impossible to scrape
- Requires manual intervention or login
- Legal/ethical concerns with scraping

---

## Quick Reference Card

**Start with Layer 1 (Built-in):**
- Simple public webpages
- Quick one-off fetches
- Basic search queries

**Use Layer 2 (BrightData):**
- Bot detection blocking Layer 1
- CAPTCHA protection
- Rate limiting encountered
- Need batch scraping (2-10 URLs)
- Search engine results needed

**Remember:**
- Always try simplest approach first (Layer 1)
- Escalate only when previous layer fails
- Document which layers were used and why
