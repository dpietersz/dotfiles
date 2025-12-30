# How to Set Up OpenCode Antigravity Authentication

This guide explains how to set up and configure the `opencode-antigravity-auth` plugin to use Google Gemini models within OpenCode via Antigravity OAuth.

## Prerequisites

- **OpenCode** installed and configured.
- A **Google Account** with access to Gemini.
- The `opencode-antigravity-auth` plugin enabled in your `opencode.jsonc`.

## Step 1: Plugin Installation

Ensure the `opencode-antigravity-auth` plugin is listed in your `~/.config/opencode/opencode.jsonc` file:

```json
{
  "plugin": [
    "opencode-antigravity-auth",
    // ... other plugins
  ]
}
```

## Step 2: Authenticate with Antigravity

Run the following command to start the authentication process:

```bash
opencode auth login google
```

### CRITICAL: Skip the Project ID
During the login process, you will be prompted for a **Google Cloud Project ID**.

> [!CAUTION]
> **DO NOT enter a Project ID.** Simply press **Enter** to skip this step.
>
> Entering a Project ID requires a paid Gemini Code Assist license and will result in `403 Forbidden` or `404 Not Found` errors if you don't have one. Skipping it allows you to use standard Gemini models via Antigravity OAuth.

## Step 3: Configure Models in opencode.jsonc

Once authenticated, you need to define the Antigravity models in your `provider.google.models` section of `opencode.jsonc`.

Note that Antigravity uses **specific model names**, which differ from the standard Google Vertex/AI names.

```jsonc
"provider": {
  "google": {
    "models": {
      "gemini-3-pro-high": {
        "name": "Gemini 3 Pro High (Antigravity)",
        "limit": { "context": 1048576, "output": 65535 },
        "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
      },
      "gemini-3-flash": {
        "name": "Gemini 3 Flash (Antigravity)",
        "limit": { "context": 1048576, "output": 65536 },
        "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
      }
    }
  }
}
```

## Step 4: Use Models in Agents

To use an Antigravity model in an agent, reference it in the agent's markdown frontmatter using the format `google/[model-id]`.

Example for `dot_config/opencode/agent/frontend-ui-ux-engineer.md`:

```yaml
---
description: A designer-turned-developer...
model: google/gemini-3-pro-high
# ...
---
```

## Available Antigravity Models

| Model ID | Name | Best For |
|----------|------|----------|
| `gemini-3-pro-high` | Gemini 3 Pro High | **Complex reasoning**, frontend work, agentic coding (High thinking). |
| `gemini-3-pro-low` | Gemini 3 Pro Low | Faster responses with moderate reasoning (Low thinking). |
| `gemini-3-flash` | Gemini 3 Flash | Fast model for quick, straightforward tasks. |
| `gemini-2.5-pro` | Gemini 2.5 Pro | Stable reasoning model (fallback). |
| `gemini-2.5-flash` | Gemini 2.5 Flash | Stable fast model (fallback). |

## Troubleshooting

### Error: 404 Entity Not Found
This usually means the **Google Cloud Project ID** was incorrectly configured during authentication. 

**Solution**: Re-authenticate and ensure you skip the Project ID prompt by pressing Enter.

### Error: 403 Gemini Code Assist License Required
This happens if you entered a Project ID during login. Antigravity assumes you want to use the Enterprise/Code Assist features tied to that project.

**Solution**: Run `opencode auth login google` again and **skip** the Project ID prompt.

### Re-authentication
If you are experiencing persistent connection issues or "Unauthorized" errors:

1. Run `opencode auth login google`.
2. Follow the browser prompt to authorize.
3. **Skip the Project ID prompt** in the terminal.

## Verification

You can verify your setup by running a simple prompt using one of the models:

```bash
opencode run -m google/gemini-3-flash -p "Hello, are you working via Antigravity?"
```

If you get a response, your authentication and model configuration are correct.

---

**Last Updated**: December 30, 2025
