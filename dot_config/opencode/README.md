# OpenCode Configuration

## Overview

OpenCode is configured with Claude Haiku 4.5 as the default model and integrates with multiple AI providers and MCP servers.

## Models

### Primary Model
- **Default:** `anthropic/claude-haiku-4-5` (fast, cost-effective)
- **Small Model:** `anthropic/claude-3-5-haiku-latest` (for quick tasks like title generation)

### Available Providers

Since you have environment variables set up for Claude, OpenAI, and Gemini, all models from these providers are available:

**Anthropic/Claude:**
- `anthropic/claude-haiku-4-5` (default)
- `anthropic/claude-sonnet-4-5`
- `anthropic/claude-opus-4-1`
- `anthropic/claude-3-5-sonnet-20241022`

**OpenAI:**
- `openai/gpt-4o`
- `openai/gpt-4-turbo`
- `openai/o1`
- `openai/gpt-4`

**Google/Gemini:**
- `google/gemini-2.0-flash`
- `google/gemini-pro`

### Switching Models

You can switch models in several ways:

1. **In the UI:** Press `Ctrl+x m` (leader + m) to select a different model
2. **CLI flag:** `opencode -m anthropic/claude-sonnet-4-5`
3. **Edit config:** Change the `model` field in `opencode.json`

## MCP Servers

MCP (Model Context Protocol) servers provide additional capabilities to OpenCode. All servers are managed through Smithery CLI:

### Enabled Servers

**Sequential Thinking** (`@smithery-ai/server-sequential-thinking`)
- Enables step-by-step reasoning and planning
- Helps break down complex problems
- Improves logical consistency in responses

**Context7** (`@upstash/context7-mcp`)
- Advanced context management
- Maintains conversation context across sessions
- Powered by Upstash

**Perplexity Search** (`@arjunkmrm/perplexity-search`)
- Web search integration via Perplexity API
- Real-time information retrieval
- Useful for research and fact-checking

**Mem0 Memory** (`@mem0ai/mem0-memory-mcp`)
- Persistent memory across conversations
- Learns from past interactions
- Provides personalized responses

**Playwright** (`@microsoft/playwright-mcp`)
- Browser automation capabilities
- Web scraping and testing
- Interact with web applications

**Brave Search** (`brave`)
- Web search via Brave Search API
- Privacy-focused alternative to Google
- Fast and comprehensive results

### Adding New MCP Servers

To add a new MCP server via Smithery:

```json
{
  "mcp": {
    "server-name": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        "@namespace/server-name",
        "--key",
        "2c0931f8-8580-4518-8069-665d93de9292",
        "--profile",
        "linguistic-mosquito-amXSsz"
      ],
      "enabled": true
    }
  }
}
```

Browse available MCP servers at [Smithery.ai](https://smithery.ai/)

## Agents

Agents are specialized AI assistants with specific roles and capabilities. They are defined as markdown files in the `agents/` directory.

### Available Agents

**Review Agent** (`agents/review.md`)
- **Purpose:** Code review and quality analysis
- **Model:** Claude Sonnet 4 (optimized for code analysis)
- **Mode:** Subagent (can be called by the main agent)
- **Temperature:** 0.1 (very focused and consistent)
- **Capabilities:**
  - Code quality assessment
  - Best practices validation
  - Bug detection
  - Performance analysis
  - Security review
- **Restrictions:** Read-only (cannot write, edit, or run commands)

### Using Agents

To invoke the review agent in OpenCode:

```bash
# In OpenCode, use the agent command
@review [file or code to review]
```

Or configure it in your workflow:

```markdown
Please review the authentication logic in src/auth.ts using the @review agent
```

### Creating Custom Agents

Create a new markdown file in `agents/` directory:

```markdown
---
description: Brief description of agent purpose
mode: subagent
model: anthropic/claude-sonnet-4-5
temperature: 0.5
tools:
  write: true
  edit: true
  bash: false
---

Your custom agent instructions here.
```

**Agent Modes:**
- `subagent` - Can be called by the main agent
- `build` - Optimized for code generation
- `plan` - Optimized for planning and architecture

**Available Tools:**
- `write` - Create new files
- `edit` - Modify existing files
- `bash` - Execute shell commands
- `read` - Read files (always available)
- `list` - List directory contents (always available)
- `grep` - Search file contents (always available)

## Theme

**Current Theme:** `kanagawa`

If the kanagawa theme is not available in OpenCode, it will fall back to the default theme. You can check available themes by pressing `Ctrl+x t` in the OpenCode UI.

Alternative dark themes that might be available:
- `gruvbox-dark`
- `tokyo-night`
- `catppuccin-mocha`
- `nord`

## Environment Variables

Ensure these environment variables are set for full functionality:

```bash
# Required for Claude models
export ANTHROPIC_API_KEY="sk-ant-..."

# Required for OpenAI models
export OPENAI_API_KEY="sk-..."

# Required for Gemini models
export GOOGLE_API_KEY="..."

# Required for GitHub MCP server
export GITHUB_TOKEN="ghp_..."

# Optional for Brave Search MCP server
export BRAVE_API_KEY="..."
```

## Keybindings

OpenCode uses a leader key pattern (default: `Ctrl+x`):

- `Ctrl+x h` - Help
- `Ctrl+x m` - Switch model
- `Ctrl+x t` - Switch theme
- `Ctrl+x n` - New session
- `Ctrl+x l` - List sessions
- `Ctrl+x e` - Open in external editor
- `Ctrl+x d` - Toggle tool details
- `Ctrl+x b` - Toggle thinking blocks

## Usage

```bash
# Start OpenCode with default model (Haiku 4.5)
opencode

# Start with a specific model
opencode -m anthropic/claude-sonnet-4-5

# Continue last session
opencode -c

# Run with a message
opencode run "explain this code"
```

## Configuration Location

- **Dotfiles:** `dot_config/opencode/opencode.json`
- **Applied to:** `~/.config/opencode/opencode.json`
