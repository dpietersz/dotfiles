# Playwright MCP Setup Guide

## Overview

This guide explains how Playwright MCP is configured in this dotfiles repository for use with OpenCode. The setup is fully automated via chezmoi and systemd, making it reproducible across Bluefin machines.

## What is Playwright MCP?

Playwright MCP (Model Context Protocol) is a server that provides browser automation capabilities to AI assistants. It enables:

- **Web page interaction** - Click, type, navigate, fill forms
- **Screenshot capture** - Take screenshots and accessibility snapshots
- **Web scraping** - Extract data from web pages
- **Testing automation** - Verify page state and content
- **Form filling** - Automate data entry tasks

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ OpenCode (Claude Code)                                  │
│ ├─ MCP Servers                                          │
│ │  ├─ context7 (remote)                                │
│ │  ├─ grep_app (remote)                                │
│ │  ├─ brave (local)                                    │
│ │  ├─ perplexity (local)                               │
│ │  ├─ sequential-thinking (local)                      │
│ │  └─ playwright (remote) ← HTTP endpoint              │
│ └─ Agents can use Playwright tools                     │
└─────────────────────────────────────────────────────────┘
                          ↓
                    HTTP Request
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Playwright MCP Server                                   │
│ Listening on: http://localhost:8931/mcp                │
│ Managed by: systemd (playwright-mcp.service)           │
└─────────────────────────────────────────────────────────┘
                          ↓
                    distrobox exec
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Playwright Distrobox                                    │
│ Name: playwright                                        │
│ Image: localhost/playwright-toolbox:test               │
│ Browsers: Chromium, Firefox, WebKit                    │
└─────────────────────────────────────────────────────────┘
```

## Files Involved

### 1. OpenCode Configuration
**File:** `dot_config/opencode/opencode.jsonc`

Defines the Playwright MCP endpoint:
```jsonc
"playwright": {
  "type": "remote",
  "url": "http://localhost:8931/mcp"
}
```

### 2. Systemd Service
**File:** `dot_config/systemd/user/playwright-mcp.service`

Manages the Playwright MCP server lifecycle:
- Starts the server on boot
- Restarts on failure
- Logs to systemd journal
- Runs in the playwright distrobox

### 3. Chezmoi Hook Script
**File:** `.chezmoiscripts/run_onchange_after_12-enable-playwright-mcp-service.sh.tmpl`

Automatically:
- Checks if distrobox is installed
- Verifies playwright distrobox exists
- Enables the systemd service
- Starts the service
- Verifies the endpoint is listening

## Setup Process

### Automatic Setup (Recommended)

Simply run:
```bash
chezmoi apply
```

This will:
1. Deploy the systemd service file
2. Deploy the OpenCode configuration
3. Run the chezmoi hook script which:
   - Enables the systemd service
   - Starts the Playwright MCP server
   - Verifies it's listening on port 8931

### Manual Setup

If you need to set up manually:

```bash
# 1. Copy systemd service file
mkdir -p ~/.config/systemd/user
cp dot_config/systemd/user/playwright-mcp.service ~/.config/systemd/user/

# 2. Reload systemd
systemctl --user daemon-reload

# 3. Enable and start the service
systemctl --user enable playwright-mcp.service
systemctl --user start playwright-mcp.service

# 4. Verify it's running
systemctl --user status playwright-mcp.service
```

## Verification

### Check Service Status

```bash
systemctl --user status playwright-mcp.service
```

Expected output:
```
● playwright-mcp.service - Playwright MCP Server
     Loaded: loaded (/home/user/.config/systemd/user/playwright-mcp.service; enabled; preset: disabled)
    Active: active (running) since ...
```

### Check Port Listening

```bash
lsof -i :8931
```

Expected output:
```
COMMAND   PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345 pietersz   21u  IPv6 279386      0t0  TCP localhost:8931 (LISTEN)
```

### Check Service Logs

```bash
journalctl --user -u playwright-mcp.service -n 20
```

### Test MCP Endpoint

```bash
curl -s http://localhost:8931/mcp
```

Expected response: `Invalid request` (this is normal - it means the server is responding)

## Troubleshooting

### Service Won't Start

**Check logs:**
```bash
journalctl --user -u playwright-mcp.service -n 50
```

**Common issues:**

1. **Port 8931 already in use:**
   ```bash
   lsof -i :8931
   kill -9 <PID>
   systemctl --user restart playwright-mcp.service
   ```

2. **Playwright distrobox not running:**
   ```bash
   distrobox list
   distrobox enter playwright
   ```

3. **distrobox not installed:**
   ```bash
   # Install distrobox
   sudo dnf install distrobox
   ```

### Service Keeps Restarting

Check the logs for errors:
```bash
journalctl --user -u playwright-mcp.service --no-pager | tail -50
```

Common causes:
- Playwright distrobox is not running
- Node.js or npm not available in distrobox
- Port 8931 is in use

### OpenCode Can't Connect

1. Verify the service is running:
   ```bash
   systemctl --user is-active playwright-mcp.service
   ```

2. Verify the port is listening:
   ```bash
   lsof -i :8931
   ```

3. Restart OpenCode after the service starts

## Usage in OpenCode

Once set up, you can use Playwright MCP in OpenCode agents:

```
@opencode: Visit https://example.com and take a screenshot
```

The agent will:
1. Use the Playwright MCP tool
2. Connect to http://localhost:8931/mcp
3. Execute the browser automation task
4. Return the results

## Service Management

### Start the Service

```bash
systemctl --user start playwright-mcp.service
```

### Stop the Service

```bash
systemctl --user stop playwright-mcp.service
```

### Restart the Service

```bash
systemctl --user restart playwright-mcp.service
```

### View Logs

```bash
journalctl --user -u playwright-mcp.service -f
```

### Disable Auto-Start

```bash
systemctl --user disable playwright-mcp.service
```

### Enable Auto-Start

```bash
systemctl --user enable playwright-mcp.service
```

## Configuration Options

The Playwright MCP server supports many options. To modify them, edit:

```bash
~/.config/systemd/user/playwright-mcp.service
```

Change the `ExecStart` line. Common options:

- `--headless` - Run in headless mode (default)
- `--headed` - Run with visible browser
- `--browser chromium` - Use specific browser
- `--port 8931` - Change port
- `--user-data-dir /path` - Persistent profile location
- `--isolated` - Use isolated context (no persistence)

Example for headed mode:
```ini
ExecStart=/usr/bin/distrobox enter playwright -- npx @playwright/mcp@latest --headed --port 8931
```

Then reload and restart:
```bash
systemctl --user daemon-reload
systemctl --user restart playwright-mcp.service
```

## Reproducibility Across Bluefin Machines

This setup is fully reproducible because:

1. **Chezmoi manages all files** - Service file and hook script are in version control
2. **Systemd is standard** - Available on all Linux systems
3. **Distrobox is pre-installed** - Comes with Bluefin
4. **No manual steps required** - `chezmoi apply` handles everything
5. **Automatic verification** - Hook script checks prerequisites

To set up on a new Bluefin machine:

```bash
# 1. Clone dotfiles
chezmoi init https://github.com/yourusername/dotfiles.git

# 2. Apply configuration
chezmoi apply

# 3. Done! Service is running
systemctl --user status playwright-mcp.service
```

## Performance Considerations

- **Memory:** Playwright uses ~200-300MB per browser instance
- **CPU:** Minimal when idle, increases during automation
- **Disk:** Browser cache stored in `~/.cache/ms-playwright/`
- **Network:** Only localhost traffic (no external bandwidth)

## Security Considerations

- **Localhost only** - Not exposed to network
- **Distrobox isolation** - Runs in isolated container
- **User-level service** - Runs as regular user, not root
- **No credentials** - No API keys or authentication needed
- **Local storage** - All data stored locally

## References

- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [OpenCode Documentation](https://opencode.ai/docs/)
- [Systemd User Services](https://wiki.archlinux.org/title/Systemd/User)
- [Distrobox Documentation](https://distrobox.it/)
