---
name: playwright
description: Browser automation and web scraping using Playwright. Navigate pages, take screenshots, extract content, fill forms, and interact with web elements. Available via MCP server (http://localhost:8931/mcp) and CLI tools (playwright, playwright-test, playwright-codegen). USE WHEN user needs browser automation, screenshots, web scraping, form filling, or testing web pages.
---

# Playwright Skill

Browser automation system for web interaction, screenshots, content extraction, and testing.

## When to Use This Skill

**USE this skill when:**
- User needs to take a screenshot of a webpage
- User wants to scrape/extract content from a website
- User needs to fill out a form or interact with web elements
- User wants to test a web page or check if a site is working
- User needs to navigate through multiple pages
- User asks to "open a browser" or "go to a website"
- User wants to automate browser interactions
- User needs to generate test code for a website

**DO NOT use this skill when:**
- User just needs to fetch static content → Use `webfetch` tool directly
- User needs API data → Use appropriate API tools
- User wants general web research → Use `research` skill

---

## System Architecture

This system has Playwright installed in a distrobox container with browsers pre-installed. Tools are exported to the host via `distrobox-export`.

### Available Interfaces

| Interface | Purpose | When to Use |
|-----------|---------|-------------|
| **MCP Server** | OpenCode integration | Default for all browser automation |
| **CLI: playwright** | Direct command-line access | Screenshots, debugging, manual testing |
| **CLI: playwright-test** | Run Playwright tests | Test automation |
| **CLI: playwright-codegen** | Record browser interactions | Generate test code |

### MCP Server Details

- **URL:** `http://localhost:8931/mcp`
- **Browser:** Chromium (headless)
- **Profile:** `/opt/playwright-browsers/mcp-chromium`
- **Service:** `systemctl --user status playwright-mcp`

---

## Workflow Routing

### Screenshot Workflow
**Trigger:** "take a screenshot", "capture this page", "screenshot of URL"
→ **LOAD:** `workflows/screenshot.md`
→ **EXECUTE:** Navigate to URL, capture screenshot, return image

### Content Extraction Workflow
**Trigger:** "scrape this page", "extract content from", "get the text from"
→ **LOAD:** `workflows/scrape.md`
→ **EXECUTE:** Navigate, extract content, return structured data

### Form Interaction Workflow
**Trigger:** "fill out this form", "submit this form", "enter data into"
→ **LOAD:** `workflows/interact.md`
→ **EXECUTE:** Navigate, locate elements, fill/click, verify

### Test Generation Workflow
**Trigger:** "generate tests for", "create test code", "record interactions"
→ **LOAD:** `workflows/codegen.md`
→ **EXECUTE:** Use playwright-codegen CLI to record and generate code

### Authentication Setup Workflow
**Trigger:** "authentication setup", "login session", "storageState", "multi-role testing"
→ **LOAD:** `workflows/auth.md`
→ **EXECUTE:** Configure globalSetup, storageState, and multi-role authentication

### Visual Regression Workflow
**Trigger:** "visual regression", "screenshot comparison", "visual testing", "baseline"
→ **LOAD:** `workflows/visual-regression.md`
→ **EXECUTE:** Set up toHaveScreenshot(), masking, thresholds, and CI integration

### E2E Testing Best Practices Workflow
**Trigger:** "e2e testing", "test structure", "page objects", "fixtures", "CI/CD"
→ **LOAD:** `workflows/e2e-testing.md`
→ **EXECUTE:** Project structure, POM pattern, fixtures, parallel execution, debugging

---

## MCP Tools Reference

The Playwright MCP server provides these tools:

### Navigation
| Tool | Purpose | Example |
|------|---------|---------|
| `browser_navigate` | Go to a URL | `browser_navigate(url: "https://example.com")` |
| `browser_go_back` | Navigate back | `browser_go_back()` |
| `browser_go_forward` | Navigate forward | `browser_go_forward()` |

### Content & Screenshots
| Tool | Purpose | Example |
|------|---------|---------|
| `browser_snapshot` | Get page accessibility tree | `browser_snapshot()` |
| `browser_take_screenshot` | Capture screenshot | `browser_take_screenshot(filename: "page.png")` |
| `browser_screen_capture` | Capture visible area | `browser_screen_capture()` |

### Interaction
| Tool | Purpose | Example |
|------|---------|---------|
| `browser_click` | Click an element | `browser_click(element: "Submit button", ref: "e5")` |
| `browser_type` | Type into an element | `browser_type(element: "Search input", text: "query", ref: "e3")` |
| `browser_select_option` | Select dropdown option | `browser_select_option(element: "Country", values: ["US"])` |
| `browser_hover` | Hover over element | `browser_hover(element: "Menu", ref: "e2")` |
| `browser_drag` | Drag and drop | `browser_drag(startElement: "Item", endElement: "Target")` |

### Tabs & Session
| Tool | Purpose | Example |
|------|---------|---------|
| `browser_tab_list` | List open tabs | `browser_tab_list()` |
| `browser_tab_new` | Open new tab | `browser_tab_new(url: "https://example.com")` |
| `browser_tab_select` | Switch to tab | `browser_tab_select(index: 0)` |
| `browser_tab_close` | Close current tab | `browser_tab_close()` |
| `browser_close` | Close browser | `browser_close()` |

### Advanced
| Tool | Purpose | Example |
|------|---------|---------|
| `browser_press_key` | Press keyboard key | `browser_press_key(key: "Enter")` |
| `browser_wait` | Wait for condition | `browser_wait(time: 2000)` |
| `browser_file_upload` | Upload a file | `browser_file_upload(paths: ["/path/to/file"])` |
| `browser_handle_dialog` | Handle alert/confirm | `browser_handle_dialog(accept: true)` |
| `browser_network_requests` | Get network activity | `browser_network_requests()` |
| `browser_console_messages` | Get console logs | `browser_console_messages()` |
| `browser_install` | Install browser | `browser_install()` |

---

## CLI Tools Reference

### playwright (General CLI)

```bash
# Take a screenshot
playwright screenshot https://example.com screenshot.png

# Open browser for debugging
playwright open https://example.com

# Generate PDF
playwright pdf https://example.com page.pdf

# Check version
playwright --version
```

### playwright-codegen (Record Tests)

```bash
# Record interactions and generate test code
playwright-codegen https://example.com

# Save to file
playwright-codegen https://example.com -o test.spec.ts

# Record with specific viewport
playwright-codegen --viewport-size=1280,720 https://example.com
```

### playwright-test (Run Tests)

```bash
# Run all tests
playwright-test

# Run specific test file
playwright-test tests/example.spec.ts

# Run with UI mode
playwright-test --ui

# Run headed (visible browser)
playwright-test --headed
```

---

## Common Patterns

### Pattern 1: Screenshot a Page

```
1. browser_navigate(url: "https://example.com")
2. browser_take_screenshot(filename: "example.png")
```

### Pattern 2: Extract Page Content

```
1. browser_navigate(url: "https://example.com")
2. browser_snapshot()  # Returns accessibility tree with element refs
3. Parse the snapshot for needed content
```

### Pattern 3: Fill and Submit Form

```
1. browser_navigate(url: "https://example.com/login")
2. browser_snapshot()  # Get element refs
3. browser_type(element: "Username", text: "user@example.com", ref: "e3")
4. browser_type(element: "Password", text: "password", ref: "e5")
5. browser_click(element: "Login button", ref: "e7")
6. browser_snapshot()  # Verify result
```

### Pattern 4: Navigate Through Pages

```
1. browser_navigate(url: "https://example.com")
2. browser_snapshot()  # Find link refs
3. browser_click(element: "Products link", ref: "e4")
4. browser_snapshot()  # New page content
```

---

## Element References

The `browser_snapshot()` tool returns an accessibility tree with `ref` attributes:

```yaml
- generic [ref=e1]:
  - heading "Welcome" [level=1] [ref=e2]
  - textbox "Email" [ref=e3]
  - textbox "Password" [ref=e4]
  - button "Login" [ref=e5]
```

**Use refs for precise targeting:**
- `browser_click(ref: "e5")` - Click the Login button
- `browser_type(ref: "e3", text: "user@example.com")` - Type in Email field

---

## Troubleshooting

### Browser Not Found
```bash
# Check if service is running
systemctl --user status playwright-mcp

# Restart service
systemctl --user restart playwright-mcp

# Check browsers are installed
distrobox enter playwright -- ls /opt/playwright-browsers/
```

### Browser Profile Locked
```bash
# Stop service and clear lock
systemctl --user stop playwright-mcp
rm -rf /opt/playwright-browsers/mcp-chromium/SingletonLock
systemctl --user start playwright-mcp
```

### MCP Connection Failed
```bash
# Check if port is listening
lsof -i :8931

# Check service logs
journalctl --user -u playwright-mcp -n 50
```

### CLI Tools Not Working
```bash
# Re-export tools from distrobox
distrobox enter playwright -- /usr/local/bin/setup-host-integration
```

---

## Key Principles

1. **Always snapshot first** - Get element refs before interacting
2. **Use refs for precision** - Element descriptions can be ambiguous
3. **Wait when needed** - Use `browser_wait` for dynamic content
4. **Check results** - Snapshot after actions to verify success
5. **Close when done** - Use `browser_close` to free resources
6. **Prefer MCP for automation** - CLI for debugging/manual tasks
