---
description: Capture screenshots of web pages using Playwright MCP or CLI. Supports full-page, viewport, and element-specific captures with optional delays for dynamic content.
globs: ""
alwaysApply: false
---

# Screenshot Workflow

Capture high-quality screenshots of web pages using Playwright browser automation. Supports full-page captures, viewport-only screenshots, and element-specific targeting.

## When to Use This Workflow

**USE this workflow when:**
- User wants to capture a screenshot of a webpage
- User needs visual documentation of a site
- User wants to capture a specific element or section
- User needs screenshots for testing or comparison
- User says "screenshot", "capture", "take a picture of"

**DO NOT use this workflow when:**
- User just needs text content → Use `scrape.md` workflow
- User needs to interact with the page → Use `interact.md` workflow
- User wants to generate test code → Use `codegen.md` workflow

---

## Two Methods Available

| Method | Best For | Output |
|--------|----------|--------|
| **MCP Tools** | Integration with OpenCode, programmatic control | Screenshot saved to file |
| **CLI** | Quick one-off captures, debugging | Screenshot saved to file |

---

## Method 1: MCP Tools (Recommended)

### Basic Screenshot

**Step 1: Navigate to the page**
```
browser_navigate(url: "https://example.com")
```

**Step 2: Wait for page to load (optional)**
```
browser_wait(time: 2000)  # Wait 2 seconds for dynamic content
```

**Step 3: Take screenshot**
```
browser_take_screenshot(filename: "screenshot.png")
```

### Full Workflow Example

```
1. browser_navigate(url: "https://example.com")
2. browser_wait(time: 2000)  # Optional: wait for dynamic content
3. browser_take_screenshot(filename: "example-screenshot.png")
4. browser_close()  # Clean up when done
```

### Capturing Specific Elements

**Step 1: Navigate and get element refs**
```
browser_navigate(url: "https://example.com")
browser_snapshot()  # Get accessibility tree with refs
```

**Step 2: Identify target element from snapshot**
Look for the element you want to capture in the accessibility tree output.

**Step 3: Use browser_screen_capture for visible area**
```
browser_screen_capture()  # Captures current viewport
```

### Handling Dynamic Content

For pages with lazy-loaded content or animations:

```
1. browser_navigate(url: "https://example.com")
2. browser_wait(time: 3000)  # Wait for animations/lazy loading
3. browser_snapshot()  # Verify content is loaded
4. browser_take_screenshot(filename: "dynamic-page.png")
```

For infinite scroll pages:
```
1. browser_navigate(url: "https://example.com")
2. browser_press_key(key: "End")  # Scroll to bottom
3. browser_wait(time: 2000)  # Wait for content to load
4. browser_take_screenshot(filename: "scrolled-page.png")
```

---

## Method 2: CLI (Quick Captures)

### Basic Screenshot

```bash
playwright screenshot https://example.com screenshot.png
```

### With Options

```bash
# Full page screenshot
playwright screenshot --full-page https://example.com full-page.png

# Specific viewport size
playwright screenshot --viewport-size=1920,1080 https://example.com desktop.png

# Mobile viewport
playwright screenshot --viewport-size=375,812 https://example.com mobile.png

# Wait for network idle
playwright screenshot --wait-for-timeout=5000 https://example.com loaded.png
```

### Generate PDF Instead

```bash
playwright pdf https://example.com page.pdf
```

---

## Best Practices

### 1. Always Wait for Content

Dynamic pages need time to load:
```
browser_navigate(url: "https://spa-app.com")
browser_wait(time: 3000)  # SPAs often need 2-5 seconds
browser_take_screenshot(filename: "spa-screenshot.png")
```

### 2. Verify Before Capturing

Use snapshot to confirm page loaded correctly:
```
browser_navigate(url: "https://example.com")
browser_snapshot()  # Check if expected content is present
browser_take_screenshot(filename: "verified.png")
```

### 3. Handle Cookie Banners

Many sites show cookie consent dialogs:
```
browser_navigate(url: "https://example.com")
browser_snapshot()  # Find cookie banner button ref
browser_click(element: "Accept cookies", ref: "e5")  # Dismiss banner
browser_wait(time: 1000)
browser_take_screenshot(filename: "clean-screenshot.png")
```

### 4. Clean Up Resources

Always close the browser when done:
```
browser_close()
```

---

## Error Handling

### Page Load Timeout

**Symptom:** Navigation takes too long or fails

**Solution:**
```
1. Check if URL is correct and accessible
2. Try with longer wait time
3. Check network connectivity
4. Verify site isn't blocking automated browsers
```

### Screenshot Fails

**Symptom:** Screenshot command returns error

**Solution:**
```
1. Verify browser is still open (browser_tab_list)
2. Check if page navigation succeeded
3. Ensure filename path is valid
4. Try browser_screen_capture() as alternative
```

### Dynamic Content Not Loaded

**Symptom:** Screenshot shows loading spinners or empty areas

**Solution:**
```
1. Increase wait time: browser_wait(time: 5000)
2. Scroll to trigger lazy loading: browser_press_key(key: "End")
3. Check for JavaScript errors: browser_console_messages()
4. Verify network requests completed: browser_network_requests()
```

---

## Output Formats

| Format | Use Case | Command |
|--------|----------|---------|
| **PNG** | Default, lossless quality | `browser_take_screenshot(filename: "page.png")` |
| **PDF** | Multi-page documents | CLI: `playwright pdf URL output.pdf` |

---

## Example Scenarios

### Scenario 1: Simple Page Screenshot

**User request:** "Take a screenshot of https://example.com"

```
1. browser_navigate(url: "https://example.com")
2. browser_wait(time: 2000)
3. browser_take_screenshot(filename: "example.png")
4. browser_close()
```

### Scenario 2: Mobile Screenshot

**User request:** "Screenshot this page as it appears on mobile"

```bash
# Using CLI for viewport control
playwright screenshot --viewport-size=375,812 https://example.com mobile.png
```

### Scenario 3: After Login Screenshot

**User request:** "Screenshot my dashboard after logging in"

```
1. browser_navigate(url: "https://app.example.com/login")
2. browser_snapshot()  # Get form element refs
3. browser_type(element: "Email", text: "user@example.com", ref: "e3")
4. browser_type(element: "Password", text: "password", ref: "e5")
5. browser_click(element: "Login", ref: "e7")
6. browser_wait(time: 3000)  # Wait for dashboard to load
7. browser_take_screenshot(filename: "dashboard.png")
8. browser_close()
```

### Scenario 4: Multiple Page Screenshots

**User request:** "Screenshot the homepage and about page"

```
1. browser_navigate(url: "https://example.com")
2. browser_wait(time: 2000)
3. browser_take_screenshot(filename: "homepage.png")
4. browser_navigate(url: "https://example.com/about")
5. browser_wait(time: 2000)
6. browser_take_screenshot(filename: "about.png")
7. browser_close()
```

---

## Quick Reference

| Task | MCP Command |
|------|-------------|
| Navigate | `browser_navigate(url: "URL")` |
| Wait | `browser_wait(time: 2000)` |
| Screenshot | `browser_take_screenshot(filename: "name.png")` |
| Viewport capture | `browser_screen_capture()` |
| Close browser | `browser_close()` |

| Task | CLI Command |
|------|-------------|
| Basic screenshot | `playwright screenshot URL output.png` |
| Full page | `playwright screenshot --full-page URL output.png` |
| Custom viewport | `playwright screenshot --viewport-size=W,H URL output.png` |
| Generate PDF | `playwright pdf URL output.pdf` |
