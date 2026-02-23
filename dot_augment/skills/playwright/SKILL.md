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
- User just needs to fetch static content → Use web fetch tool directly
- User needs API data → Use appropriate API tools
- User wants general web research → Use `research` skill

---

## System Architecture

Playwright is installed in a distrobox container with browsers pre-installed. Tools are exported to the host via `distrobox-export`.

### Available Interfaces

| Interface | Purpose | When to Use |
|-----------|---------|-------------|
| **MCP Server** | Auggie integration | Default for all browser automation |
| **CLI: playwright** | Direct command-line access | Screenshots, debugging, manual testing |
| **CLI: playwright-test** | Run Playwright tests | Test automation |
| **CLI: playwright-codegen** | Record browser interactions | Generate test code |

### MCP Server Details

- **URL:** `http://localhost:8931/mcp`
- **Browser:** Chromium (headless)
- **Service:** `systemctl --user status playwright-mcp`

---

## Workflow Routing

### Screenshot Workflow
**Trigger:** "take a screenshot", "capture this page", "screenshot of URL"
→ Navigate to URL, capture screenshot, return image

### Content Extraction Workflow
**Trigger:** "scrape this page", "extract content from", "get the text from"
→ Navigate, extract content, return structured data

### Form Interaction Workflow
**Trigger:** "fill out this form", "submit this form", "enter data into"
→ Navigate, locate elements, fill/click, verify

### Test Generation Workflow
**Trigger:** "generate tests for", "create test code", "record interactions"
→ Use playwright-codegen CLI to record and generate code

---

## MCP Tools Reference

### Navigation
| Tool | Purpose |
|------|---------|
| `browser_navigate` | Go to a URL |
| `browser_go_back` | Navigate back |
| `browser_go_forward` | Navigate forward |

### Content & Screenshots
| Tool | Purpose |
|------|---------|
| `browser_snapshot` | Get page accessibility tree |
| `browser_take_screenshot` | Capture screenshot |

### Interaction
| Tool | Purpose |
|------|---------|
| `browser_click` | Click an element |
| `browser_type` | Type into an element |
| `browser_select_option` | Select dropdown option |
| `browser_hover` | Hover over element |
| `browser_drag` | Drag and drop |

### Tabs & Session
| Tool | Purpose |
|------|---------|
| `browser_tabs` | List/create/close/select tabs |
| `browser_close` | Close browser |

### Advanced
| Tool | Purpose |
|------|---------|
| `browser_press_key` | Press keyboard key |
| `browser_wait_for` | Wait for condition |
| `browser_file_upload` | Upload a file |
| `browser_handle_dialog` | Handle alert/confirm |
| `browser_network_requests` | Get network activity |
| `browser_console_messages` | Get console logs |

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

---

## Troubleshooting

### Browser Not Found
```bash
# Check if service is running
systemctl --user status playwright-mcp

# Restart service
systemctl --user restart playwright-mcp
```

### MCP Connection Failed
```bash
# Check if port is listening
lsof -i :8931

# Check service logs
journalctl --user -u playwright-mcp -n 50
```

---

## Key Principles

1. **Always snapshot first** — Get element refs before interacting
2. **Use refs for precision** — Element descriptions can be ambiguous
3. **Wait when needed** — Use `browser_wait_for` for dynamic content
4. **Check results** — Snapshot after actions to verify success
5. **Prefer MCP for automation** — CLI for debugging/manual tasks
