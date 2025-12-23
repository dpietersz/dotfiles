---
description: Intelligent three-layer content retrieval system for DIFFICULT content retrieval. Uses built-in tools (WebFetch), Crawl4AI API (JS rendering), and BrightData MCP (CAPTCHA handling). USE ONLY WHEN user indicates difficulty accessing content.
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
- "Page content is incomplete" / "JavaScript not rendering"

**DO NOT use this workflow for simple requests:**
- "Read this page" → Use WebFetch directly
- "Get content from [URL]" → Use WebFetch directly
- "What does this site say" → Use WebFetch directly

**Simple rule:** Only activate when user signals DIFFICULTY, not for routine content requests.

---

## Three-Layer Escalation Strategy

```
Layer 1: Built-in Tools (Fast, Simple, FREE)
   ↓ (If incomplete content or fails)
Layer 1.5: Crawl4AI API (Self-hosted, JS rendering, fast)
   ↓ (If blocked, CAPTCHA, or fails)
Layer 2: BrightData MCP (CAPTCHA handling, residential proxies)
```

### Decision Tree: Which Layer to Use?

**Start with Layer 1 (Built-in) if:**
- Simple public webpage
- No known bot detection
- Standard HTML content
- Quick one-off fetch

**Use Layer 1.5 (Crawl4AI) if:**
- Layer 1 returns incomplete/broken content
- JavaScript-heavy site (SPA, React, Vue, etc.)
- Need markdown output optimized for LLMs
- Batch crawling multiple URLs (up to 100)
- Need specific content filtering (fit, raw, bm25)

**Use Layer 2 (BrightData) if:**
- Layer 1.5 blocked or failed
- Known bot detection (CloudFlare, etc.)
- CAPTCHA protection
- Rate limiting encountered
- Need residential proxy network
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
- JavaScript content not rendered
→ **Escalate to Layer 1.5 (Crawl4AI)**

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

## Layer 1.5: Crawl4AI API

### Prerequisites

- `CRAWL4AI_API_TOKEN` environment variable must be set
- Self-hosted at: https://crawl4ai.pietersz.me
- API Documentation: https://crawl4ai.pietersz.me/docs

### /md Endpoint (Primary Use Case)

**Best for:** Getting clean markdown from any URL with JS rendering

**Key Features:**
- Headless browser with full JavaScript execution
- Markdown output optimized for LLM consumption
- Content filtering options (fit, raw, bm25, llm)
- Fast response times (self-hosted)
- No rate limits (self-hosted)

**Usage via Bash:**
```bash
curl -X POST https://crawl4ai.pietersz.me/md \
  -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article"}'
```

**Request Body Options:**
```json
{
  "url": "https://example.com",  // Required - URL to scrape
  "f": "fit",                    // Filter: fit (default), raw, bm25, llm
  "q": "search query",           // Query for bm25/llm filters (optional)
  "c": "0"                       // Cache-bust counter (optional)
}
```

**Filter Options:**
- `fit` (default): Cleaned markdown, removes boilerplate
- `raw`: Full page content as markdown
- `bm25`: BM25-ranked content based on query
- `llm`: LLM-optimized content extraction

**Response:**
```json
{
  "url": "https://example.com",
  "filter": "fit",
  "query": null,
  "cache": "0",
  "markdown": "# Page Title\nContent here...",
  "success": true
}
```

### /crawl Endpoint (Batch Crawling)

**Best for:** Crawling multiple URLs in one request (up to 100)

**Usage via Bash:**
```bash
curl -X POST https://crawl4ai.pietersz.me/crawl \
  -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example1.com", "https://example2.com", "https://example3.com"]}'
```

**When to use:**
- Need to scrape multiple pages from same or different domains
- Building research corpus from multiple sources
- Batch processing up to 100 URLs

### /screenshot Endpoint

**Best for:** Capturing full-page screenshots

**Usage via Bash:**
```bash
curl -X POST https://crawl4ai.pietersz.me/screenshot \
  -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "screenshot_wait_for": 2}'
```

### /execute_js Endpoint

**Best for:** Pages requiring JavaScript interaction before scraping

**Usage via Bash:**
```bash
curl -X POST https://crawl4ai.pietersz.me/execute_js \
  -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "js_code": "document.querySelector(\"button.load-more\").click()"
  }'
```

### Other Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/html` | POST | Get sanitized HTML instead of markdown |
| `/pdf` | POST | Generate PDF of the page |

### When Crawl4AI Fails

**Escalate to Layer 2 (BrightData) if:**
- HTTP 403 (Forbidden) - bot detection
- CAPTCHA challenge detected
- CloudFlare or similar protection
- Residential IP required
→ **Use BrightData MCP**

---

## Layer 2: BrightData MCP

### Prerequisites

- `BRIGHTDATA_API_TOKEN` environment variable must be set
- BrightData MCP server must be configured in OpenCode

### scrape_as_markdown Tool

**Best for:** Sites with bot protection, CAPTCHA, requiring residential proxies

**Key Features:**
- Bypasses CloudFlare, bot detection, CAPTCHAs
- Returns clean markdown (perfect for LLM consumption)
- Handles JavaScript-heavy sites
- Residential proxy network (appears as real user)

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
- Layer 1.5 Crawl4AI failed with blocking/CAPTCHA
- Known protected sites (CloudFlare, etc.)
- Need residential proxy network
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

Step 2: If Layer 1 returns incomplete content (JS not rendered):
→ curl -X POST https://crawl4ai.pietersz.me/md \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com/article"}'

Step 3: If Layer 1.5 fails (blocked/CAPTCHA):
→ mcp__brightdata__scrape_as_markdown url="https://example.com/article"
```

### Example: Batch Scrape Multiple Pages

**User request:** "Get content from these 5 URLs"

**Execution:**

```
Step 1: Try Layer 1.5 (Crawl4AI) batch endpoint:
→ curl -X POST https://crawl4ai.pietersz.me/crawl \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"urls": ["url1", "url2", "url3", "url4", "url5"]}'

Step 2: If any URLs fail, retry failed ones with Layer 2:
→ mcp__brightdata__scrape_batch urls=[failed_urls]
```

### Example: Search + Scrape Multiple Pages

**User request:** "Get content about React 19 from the top 5 search results"

**Execution:**

```
Step 1: Try Layer 1 for search:
→ WebSearch query="React 19 features documentation"
→ Extract URLs from results

Step 2: Batch fetch with Layer 1.5 (Crawl4AI):
→ curl -X POST https://crawl4ai.pietersz.me/crawl \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"urls": ["url1", "url2", "url3", "url4", "url5"]}'

Step 3: If any Layer 1.5 fetches fail, use Layer 2 batch:
→ mcp__brightdata__scrape_batch urls=[failed_urls]
```

### Example: Protected Site Scraping

**User request:** "Scrape this CloudFlare-protected site"

**Execution:**

```
Step 1: Try Layer 1.5 first (might work for some protected sites):
→ curl -X POST https://crawl4ai.pietersz.me/md \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://cloudflare-protected-site.com"}'

Step 2: If blocked, escalate to Layer 2:
→ mcp__brightdata__scrape_as_markdown url="https://cloudflare-protected-site.com"
```

### Example: JavaScript-Heavy SPA

**User request:** "Get content from this React app"

**Execution:**

```
Step 1: Skip Layer 1 (known to fail on SPAs)
→ Go directly to Layer 1.5

Step 2: Use Crawl4AI with JS rendering:
→ curl -X POST https://crawl4ai.pietersz.me/md \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://react-app.com/page", "f": "fit"}'
```

---

## Layer Comparison Matrix

| Feature | Layer 1 (Built-in) | Layer 1.5 (Crawl4AI) | Layer 2 (BrightData) |
|---------|-------------------|----------------------|----------------------|
| **Speed** | Fast (< 5s) | Fast (5-15s) | Medium (10-30s) |
| **JavaScript Rendering** | Limited | Full | Full |
| **Bot Detection Bypass** | No | Limited | Yes |
| **CAPTCHA Handling** | No | No | Yes |
| **Residential Proxies** | No | No | Yes |
| **Batch Operations** | Manual | Up to 100 | Up to 10 |
| **Search Integration** | Basic | No | Multi-engine |
| **Markdown Output** | Yes | Yes (optimized) | Yes |
| **Cost** | Free | Free (self-hosted) | Paid |
| **Best For** | Simple pages | JS-heavy sites | Protected sites |

---

## Error Handling & Escalation

**Layer 1 Errors → Escalate to Layer 1.5:**
- Empty or incomplete content
- JavaScript content not rendered
- Dynamic content missing
- SPA/React/Vue pages

**Layer 1.5 Errors → Escalate to Layer 2:**
- HTTP 403 (Forbidden)
- HTTP 429 (Rate Limited)
- CAPTCHA challenge detected
- Bot detection messages
- CloudFlare protection

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

**Use Layer 1.5 (Crawl4AI):**
- JavaScript-heavy sites (SPA, React, Vue)
- Layer 1 returns incomplete content
- Need batch crawling (up to 100 URLs)
- Want LLM-optimized markdown

**Use Layer 2 (BrightData):**
- Bot detection blocking Layer 1.5
- CAPTCHA protection
- Need residential proxy network
- Search engine results needed

**Remember:**
- Always try simplest approach first (Layer 1)
- Crawl4AI before BrightData (Layer 1.5 before Layer 2)
- BrightData is the last resort for CAPTCHA/bot detection
- Document which layers were used and why

---

## Crawl4AI API Quick Reference

**Base URL:** `https://crawl4ai.pietersz.me`
**Auth Header:** `Authorization: Bearer $CRAWL4AI_API_TOKEN`
**Swagger Docs:** `https://crawl4ai.pietersz.me/docs`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/md` | POST | Get markdown from URL (primary) |
| `/html` | POST | Get sanitized HTML |
| `/screenshot` | POST | Capture full-page PNG |
| `/pdf` | POST | Generate PDF of page |
| `/crawl` | POST | Batch crawl up to 100 URLs |
| `/execute_js` | POST | Execute JavaScript on page |
