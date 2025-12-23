---
description: Intelligent content retrieval system with Crawl4AI as the PREFERRED option. Crawl4AI provides sanitized, LLM-optimized markdown. WebFetch only for trivial speed-critical fetches. BrightData for CAPTCHA/bot detection only.
globs: ""
alwaysApply: false
---

# Retrieve Workflow

Intelligent content retrieval system with **Crawl4AI as the preferred option** for quality content extraction.

## When to Use This Workflow

**USE this workflow for any content retrieval:**
- User wants content from a URL
- User needs clean, sanitized markdown
- User wants LLM-ready content
- User needs batch scraping
- User indicates difficulty accessing content

**Use Crawl4AI (Layer 1.5) by default for:**
- "Get content from [URL]" → Crawl4AI for sanitized markdown
- "Read this page" → Crawl4AI for clean output
- "Scrape this site" → Crawl4AI for LLM-optimized content
- "Get these 5 URLs" → Crawl4AI batch endpoint

**Use WebFetch (Layer 1) ONLY for:**
- Trivial one-off fetches where speed is critical
- Quick checks where quality doesn't matter
- Simple HTML pages with no JS

**Simple rule:** Prefer Crawl4AI for quality. Use WebFetch only when speed matters more than quality.

---

## Three-Layer Strategy (Crawl4AI Preferred)

```
Layer 1.5: Crawl4AI API (PREFERRED - Sanitized, LLM-optimized, fast)
   ↓ (If blocked, CAPTCHA, or fails)
Layer 2: BrightData MCP (CAPTCHA handling, residential proxies)

Layer 1: Built-in Tools (Speed-only option for trivial cases)
```

### Decision Tree: Which Layer to Use?

**START with Layer 1.5 (Crawl4AI) - DEFAULT CHOICE:**
- **Any content retrieval request** (this is the default)
- Need sanitized, clean markdown output
- Want LLM-optimized content
- JavaScript-heavy site (SPA, React, Vue, etc.)
- Batch crawling multiple URLs (up to 100)
- Need specific content filtering (fit, raw, bm25)
- Quality matters more than raw speed

**Use Layer 1 (Built-in) ONLY if:**
- Trivial one-off fetch where speed is critical
- Quick check where quality doesn't matter
- Simple static HTML with no JS
- You explicitly don't need sanitized output

**Use Layer 2 (BrightData) if:**
- Layer 1.5 blocked or failed
- Known bot detection (CloudFlare, etc.)
- CAPTCHA protection
- Rate limiting encountered
- Need residential proxy network
- Search engine results needed (Google, Bing, Yandex)

---

## Layer 1.5: Crawl4AI API (PREFERRED)

### Why Crawl4AI is the Default Choice

**Key Benefits:**
- **Sanitized markdown** - Clean, boilerplate-free output
- **LLM-optimized** - Content structured for AI consumption
- **JavaScript rendering** - Full headless browser support
- **Batch operations** - Up to 100 URLs in one request
- **Self-hosted** - No rate limits, fast, free
- **Content filtering** - fit, raw, bm25, llm options

**Use Crawl4AI for:**
- Any content retrieval where quality matters
- JavaScript-heavy sites (SPA, React, Vue)
- Batch scraping multiple URLs
- Research and analysis tasks
- Building content corpora

---

## Layer 1: Built-in Tools (Speed-Only Option)

### WebFetch Tool

**Best for:** Trivial fetches where speed matters more than quality

**Usage:**
```
Use WebFetch tool with:
- url: "https://example.com/page"
- prompt: "Extract the main article content and author name"
```

**When to use:**
- Quick one-off check (don't need clean output)
- Speed is critical, quality doesn't matter
- Simple static HTML page

**When NOT to use (prefer Crawl4AI instead):**
- Need sanitized, clean markdown
- JavaScript content needs rendering
- Quality of output matters
- Batch operations needed

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

## Crawl4AI API Details

### Prerequisites

- `CRAWL4AI_API_TOKEN` environment variable must be set
- Self-hosted at: https://crawl4ai.pietersz.me
- API Documentation: https://crawl4ai.pietersz.me/docs

### /md Endpoint (Primary Use Case - DEFAULT)

**Best for:** Getting clean, sanitized markdown from any URL

**Key Features:**
- **Sanitized output** - Removes boilerplate, ads, navigation
- **LLM-optimized** - Markdown structured for AI consumption
- Headless browser with full JavaScript execution
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

### Example: Retrieve Article Content (Standard Case)

**User request:** "Get me the content from https://example.com/article"

**Execution:**

```
Step 1: Use Crawl4AI (preferred - sanitized, LLM-optimized output)
→ curl -X POST https://crawl4ai.pietersz.me/md \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com/article"}'

Step 2: If Crawl4AI fails (blocked/CAPTCHA):
→ mcp__brightdata__scrape_as_markdown url="https://example.com/article"
```

### Example: Quick Check (Speed-Critical)

**User request:** "Quickly check if this page mentions Python"

**Execution:**

```
Step 1: Use WebFetch (speed matters, quality doesn't)
→ WebFetch url="https://example.com/page" prompt="Does this page mention Python?"

Note: Only use WebFetch when speed is critical and you don't need clean output
```

### Example: Batch Scrape Multiple Pages

**User request:** "Get content from these 5 URLs"

**Execution:**

```
Step 1: Use Crawl4AI batch endpoint (preferred for batch operations):
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
Step 1: Use WebSearch for discovery:
→ WebSearch query="React 19 features documentation"
→ Extract URLs from results

Step 2: Use Crawl4AI for quality content extraction:
→ curl -X POST https://crawl4ai.pietersz.me/crawl \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"urls": ["url1", "url2", "url3", "url4", "url5"]}'

Step 3: If any Crawl4AI fetches fail, use Layer 2 batch:
→ mcp__brightdata__scrape_batch urls=[failed_urls]
```

### Example: Protected Site Scraping

**User request:** "Scrape this CloudFlare-protected site"

**Execution:**

```
Step 1: Try Crawl4AI first (might work for some protected sites):
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
Step 1: Use Crawl4AI (perfect for JS-heavy sites):
→ curl -X POST https://crawl4ai.pietersz.me/md \
    -H "Authorization: Bearer $CRAWL4AI_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://react-app.com/page", "f": "fit"}'

Note: Crawl4AI handles JS rendering automatically - no need to try WebFetch first
```

---

## Layer Comparison Matrix

| Feature | Layer 1.5 (Crawl4AI) **PREFERRED** | Layer 1 (Built-in) | Layer 2 (BrightData) |
|---------|-----------------------------------|-------------------|----------------------|
| **When to Use** | **DEFAULT for most requests** | Speed-only, trivial fetches | CAPTCHA/bot detection |
| **Speed** | Fast (5-15s) | Fastest (< 5s) | Medium (10-30s) |
| **Output Quality** | **Sanitized, LLM-optimized** | Raw, may include noise | Clean markdown |
| **JavaScript Rendering** | Full | Limited | Full |
| **Bot Detection Bypass** | Limited | No | Yes |
| **CAPTCHA Handling** | No | No | Yes |
| **Residential Proxies** | No | No | Yes |
| **Batch Operations** | Up to 100 | Manual | Up to 10 |
| **Search Integration** | No | Basic | Multi-engine |
| **Cost** | Free (self-hosted) | Free | Paid |
| **Best For** | **Quality content extraction** | Quick checks | Protected sites |

---

## Error Handling & Escalation

**Crawl4AI (Layer 1.5) Errors → Escalate to Layer 2:**
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

**Note:** Since Crawl4AI is the default, you typically won't need to "escalate" from Layer 1. Only use Layer 1 (WebFetch) when you explicitly need speed over quality.

---

## Quick Reference Card

**START with Crawl4AI (Layer 1.5) - DEFAULT:**
- **Any content retrieval request** (this is the default)
- Need sanitized, clean markdown
- Want LLM-optimized output
- JavaScript-heavy sites (SPA, React, Vue)
- Batch crawling (up to 100 URLs)
- Quality matters

**Use WebFetch (Layer 1) ONLY for:**
- Trivial one-off fetches (speed critical)
- Quick checks where quality doesn't matter
- Simple static HTML pages

**Use BrightData (Layer 2) for:**
- Bot detection blocking Crawl4AI
- CAPTCHA protection
- Need residential proxy network
- Search engine results needed

**Remember:**
- **Crawl4AI is the preferred choice** - sanitized, LLM-ready output
- WebFetch only when speed matters more than quality
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
