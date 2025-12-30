---
description: Extract content from web pages using Playwright MCP. Navigate pages, get accessibility tree snapshots, and extract structured data including text, links, and page elements.
globs: ""
alwaysApply: false
---

# Scrape Workflow

Extract content and structured data from web pages using Playwright browser automation. Uses the accessibility tree snapshot for reliable content extraction from JavaScript-heavy sites.

## When to Use This Workflow

**USE this workflow when:**
- User needs to extract content from a JavaScript-heavy site (SPA, React, Vue)
- User wants structured data from a page (links, headings, form fields)
- User needs to scrape content that requires browser rendering
- User says "scrape", "extract", "get content from", "get the text"
- WebFetch or Crawl4AI failed to get the content

**DO NOT use this workflow when:**
- Simple static page → Use WebFetch or Crawl4AI (faster)
- Need CAPTCHA bypass → Use BrightData MCP
- Just need a screenshot → Use `screenshot.md` workflow
- Need to fill forms → Use `interact.md` workflow

**Prefer Crawl4AI/WebFetch when:**
- Page is static HTML (no JavaScript required)
- Speed is more important than precision
- You need sanitized markdown output

---

## Core Concept: Accessibility Tree Snapshots

The `browser_snapshot()` tool returns the page's accessibility tree - a structured representation of all interactive and content elements:

```yaml
- generic [ref=e1]:
  - heading "Welcome to Example" [level=1] [ref=e2]
  - paragraph [ref=e3]:
    - text "This is the main content..."
  - link "Learn More" [ref=e4]
  - textbox "Email" [ref=e5]
  - button "Subscribe" [ref=e6]
```

**Key benefits:**
- Works on JavaScript-rendered content
- Provides element references for interaction
- Structured format for parsing
- Includes semantic information (headings, links, buttons)

---

## Basic Scraping Workflow

### Step 1: Navigate to the Page

```
browser_navigate(url: "https://example.com")
```

### Step 2: Wait for Content (if needed)

```
browser_wait(time: 2000)  # Wait for dynamic content
```

### Step 3: Get Accessibility Snapshot

```
browser_snapshot()
```

### Step 4: Parse the Snapshot

Extract the information you need from the accessibility tree output.

### Step 5: Clean Up

```
browser_close()
```

---

## Content Extraction Patterns

### Pattern 1: Extract All Text Content

**Goal:** Get all readable text from a page

```
1. browser_navigate(url: "https://example.com/article")
2. browser_wait(time: 2000)
3. browser_snapshot()
4. Parse snapshot for text content in paragraphs, headings, lists
5. browser_close()
```

**From snapshot, extract:**
- All `heading` elements (titles, subtitles)
- All `paragraph` elements (body text)
- All `listitem` elements (bullet points)
- All `text` nodes

### Pattern 2: Extract Links

**Goal:** Get all links from a page

```
1. browser_navigate(url: "https://example.com")
2. browser_snapshot()
3. Parse snapshot for all `link` elements
4. Extract link text and href attributes
5. browser_close()
```

**From snapshot, identify:**
- Elements with `link` role
- Their text content
- Their `ref` for potential clicking

### Pattern 3: Extract Structured Data

**Goal:** Get specific data like product info, article metadata

```
1. browser_navigate(url: "https://shop.example.com/product")
2. browser_wait(time: 2000)
3. browser_snapshot()
4. Identify relevant elements by their labels/structure
5. Extract: title, price, description, reviews
6. browser_close()
```

### Pattern 4: Extract Table Data

**Goal:** Get data from HTML tables

```
1. browser_navigate(url: "https://example.com/data-table")
2. browser_snapshot()
3. Look for `table`, `row`, `cell` elements in snapshot
4. Parse into structured format
5. browser_close()
```

---

## Handling Pagination

### Multi-Page Scraping

```
1. browser_navigate(url: "https://example.com/results?page=1")
2. browser_snapshot()  # Get page 1 content
3. Store extracted data

4. browser_navigate(url: "https://example.com/results?page=2")
5. browser_snapshot()  # Get page 2 content
6. Store extracted data

7. Repeat for remaining pages
8. browser_close()
```

### Click-Based Pagination

```
1. browser_navigate(url: "https://example.com/results")
2. browser_snapshot()  # Get content + find "Next" button ref
3. Store extracted data

4. browser_click(element: "Next", ref: "e15")  # Click next page
5. browser_wait(time: 2000)
6. browser_snapshot()  # Get next page content
7. Store extracted data

8. Repeat until no "Next" button
9. browser_close()
```

### Infinite Scroll

```
1. browser_navigate(url: "https://example.com/feed")
2. browser_snapshot()  # Get initial content
3. Store extracted data

4. browser_press_key(key: "End")  # Scroll to bottom
5. browser_wait(time: 2000)  # Wait for new content
6. browser_snapshot()  # Get new content
7. Store new data

8. Repeat scroll cycle as needed
9. browser_close()
```

---

## Advanced Extraction

### Waiting for Specific Content

If content loads asynchronously:

```
1. browser_navigate(url: "https://example.com")
2. browser_wait(time: 3000)  # Initial wait
3. browser_snapshot()

4. If expected content not in snapshot:
   - browser_wait(time: 2000)  # Wait more
   - browser_snapshot()  # Try again
```

### Triggering Content Load

Some content requires interaction to appear:

```
1. browser_navigate(url: "https://example.com")
2. browser_snapshot()  # Find "Load More" button

3. browser_click(element: "Load More", ref: "e10")
4. browser_wait(time: 2000)
5. browser_snapshot()  # Get expanded content
```

### Handling Tabs/Accordions

```
1. browser_navigate(url: "https://example.com/faq")
2. browser_snapshot()  # Find tab/accordion refs

3. browser_click(element: "Tab 2", ref: "e5")
4. browser_wait(time: 500)
5. browser_snapshot()  # Get Tab 2 content

6. browser_click(element: "Tab 3", ref: "e7")
7. browser_wait(time: 500)
8. browser_snapshot()  # Get Tab 3 content
```

---

## Error Handling

### Page Load Failures

**Symptom:** Navigation fails or times out

**Solution:**
```
1. Verify URL is correct and accessible
2. Check if site blocks automated browsers
3. Try with longer timeout
4. Consider using BrightData MCP for protected sites
```

### Empty Snapshot

**Symptom:** Snapshot returns minimal content

**Solution:**
```
1. Increase wait time: browser_wait(time: 5000)
2. Check for JavaScript errors: browser_console_messages()
3. Verify page loaded: browser_take_screenshot() to see current state
4. Some sites may require login or specific headers
```

### Content Behind Login

**Symptom:** Snapshot shows login page instead of content

**Solution:**
```
1. Use interact.md workflow to log in first
2. Then proceed with scraping
3. Consider if scraping requires authentication
```

### Rate Limiting

**Symptom:** Site blocks after multiple requests

**Solution:**
```
1. Add delays between requests: browser_wait(time: 5000)
2. Reduce scraping frequency
3. Consider using BrightData MCP for residential proxies
```

---

## Output Formatting

### Structured JSON Output

After extracting from snapshot, format as:

```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "content": "Main article text...",
  "links": [
    {"text": "Related Article", "href": "/related"},
    {"text": "Source", "href": "https://source.com"}
  ],
  "metadata": {
    "author": "John Doe",
    "date": "2025-01-15"
  }
}
```

### Markdown Output

```markdown
# Article Title

Main article text extracted from the page...

## Links Found
- [Related Article](/related)
- [Source](https://source.com)

## Metadata
- **Author:** John Doe
- **Date:** 2025-01-15
```

---

## Example Scenarios

### Scenario 1: Extract Article Content

**User request:** "Get the article content from https://blog.example.com/post"

```
1. browser_navigate(url: "https://blog.example.com/post")
2. browser_wait(time: 2000)
3. browser_snapshot()
4. From snapshot, extract:
   - heading [level=1] → Article title
   - paragraph elements → Article body
   - time/date elements → Publication date
   - link elements → Related links
5. browser_close()
6. Return formatted content
```

### Scenario 2: Scrape Product Listings

**User request:** "Get all products from this category page"

```
1. browser_navigate(url: "https://shop.example.com/category")
2. browser_wait(time: 3000)
3. browser_snapshot()
4. From snapshot, identify product cards:
   - Product name (heading or link text)
   - Price (text with currency)
   - Image alt text
   - Product link ref
5. If pagination exists:
   - Click "Next" and repeat
6. browser_close()
7. Return product list
```

### Scenario 3: Extract Search Results

**User request:** "Get the top 10 search results for 'python tutorial'"

```
1. browser_navigate(url: "https://search.example.com")
2. browser_snapshot()  # Find search input ref
3. browser_type(element: "Search", text: "python tutorial", ref: "e3")
4. browser_press_key(key: "Enter")
5. browser_wait(time: 3000)
6. browser_snapshot()
7. From snapshot, extract result items:
   - Title (link text)
   - URL (link href)
   - Description (paragraph text)
8. browser_close()
9. Return top 10 results
```

### Scenario 4: Scrape Dynamic Dashboard

**User request:** "Extract data from my analytics dashboard"

```
1. browser_navigate(url: "https://analytics.example.com/login")
2. browser_snapshot()
3. browser_type(element: "Email", text: "user@example.com", ref: "e3")
4. browser_type(element: "Password", text: "password", ref: "e5")
5. browser_click(element: "Login", ref: "e7")
6. browser_wait(time: 5000)  # Wait for dashboard
7. browser_snapshot()
8. Extract metrics from dashboard elements
9. browser_close()
10. Return dashboard data
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Navigate | `browser_navigate(url: "URL")` |
| Wait | `browser_wait(time: 2000)` |
| Get content | `browser_snapshot()` |
| Click element | `browser_click(element: "Name", ref: "eN")` |
| Type text | `browser_type(element: "Name", text: "value", ref: "eN")` |
| Press key | `browser_press_key(key: "Enter")` |
| Scroll down | `browser_press_key(key: "End")` |
| Close browser | `browser_close()` |

---

## Comparison: Playwright vs Other Tools

| Feature | Playwright Scrape | WebFetch | Crawl4AI | BrightData |
|---------|-------------------|----------|----------|------------|
| JavaScript rendering | Yes | Limited | Yes | Yes |
| Structured output | Accessibility tree | Markdown | Markdown | Markdown |
| Interaction support | Full | No | Limited | No |
| Speed | Medium | Fast | Fast | Medium |
| CAPTCHA bypass | No | No | No | Yes |
| Best for | SPAs, dynamic content | Static pages | Quality markdown | Protected sites |
