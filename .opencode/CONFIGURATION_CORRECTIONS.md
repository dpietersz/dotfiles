# OpenCode Configuration Corrections

## Summary

The OpenCode agent system has been **corrected to follow official OpenCode documentation standards**. All agents are now properly configured with the correct file structure and YAML frontmatter format.

---

## What Was Fixed

### 1. ✅ Created `opencode.json` Configuration File

**Location**: `/var/home/pietersz/dotfiles/opencode.json`

This is the **primary configuration file** for all agents in the project. It defines:
- All 13 agents (1 primary + 12 subagents)
- Agent modes (primary vs subagent)
- Temperature settings for each agent
- Tool access (read, edit, bash)
- Permissions (ask, allow, deny)

**Format**: JSON following OpenCode schema

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "agent-name": {
      "description": "...",
      "mode": "primary|subagent",
      "temperature": 0.0-1.0,
      "tools": { "read": true, "edit": true, "bash": true },
      "permission": { "edit": "ask", "bash": "ask" }
    }
  }
}
```

### 2. ✅ Updated All Agent Markdown Files

**Location**: `.opencode/agent/*.md`

All 13 agent markdown files have been updated with **correct YAML frontmatter**:

**Before (Incorrect)**:
```yaml
---
name: agent-name
description: ...
temperature: 0.3
tools: read, edit, bash, grep
permissions:
  bash: ask
  read: allow
---
```

**After (Correct)**:
```yaml
---
description: ...
mode: subagent
temperature: 0.3
---
```

### 3. ✅ Removed Incorrect `settings.json`

**Deleted**: `.opencode/settings.json`

This file was not part of the OpenCode standard and has been removed. All configuration is now in `opencode.json`.

---

## Agent Configuration Details

### Primary Agent (1)

**`dotfiles-manager`**
- Mode: `primary`
- Temperature: 0.3
- Tools: read, edit, bash
- Permissions: edit (ask), bash (ask)

### Subagents (12)

**Configuration Agents** (4)
- `nvim-config` - Temperature: 0.3
- `shell-config` - Temperature: 0.3
- `ui-config` - Temperature: 0.3
- `app-config` - Temperature: 0.3

**Installation Agents** (3)
- `app-installer` - Temperature: 0.3
- `mise-manager` - Temperature: 0.2
- `script-creator` - Temperature: 0.3

**Utility Agents** (1)
- `custom-scripts` - Temperature: 0.3

**Security Agents** (2)
- `key-encryptor` - Temperature: 0.2
- `key-validator` - Temperature: 0.2

**Documentation Agents** (1)
- `documentation` - Temperature: 0.2

**Git Agents** (1)
- `git-manager` - Temperature: 0.2

---

## Temperature Settings Explained

Temperature controls the randomness/creativity of responses:

- **0.1-0.2** (Very Deterministic)
  - `mise-manager`, `script-creator`, `key-encryptor`, `key-validator`, `documentation`, `git-manager`
  - Used for precise, consistent operations

- **0.3** (Balanced)
  - `dotfiles-manager`, `nvim-config`, `shell-config`, `ui-config`, `app-config`, `app-installer`, `custom-scripts`
  - Used for general development tasks

---

## Tool Access Configuration

### All Agents Have:
- `read: true` - Can read files
- `bash: true` - Can execute bash commands (with permission: ask)

### Edit-Capable Agents:
- `edit: true` - Can modify files (with permission: ask)
- Agents: nvim-config, shell-config, ui-config, app-config, app-installer, mise-manager, script-creator, custom-scripts, key-encryptor, documentation, dotfiles-manager

### Read-Only Agents:
- `edit: false` - Cannot modify files
- Agents: key-validator

---

## File Structure

```
/var/home/pietersz/dotfiles/
├── opencode.json                    ← Main configuration file
└── .opencode/
    ├── agent/
    │   ├── dotfiles-manager.md      ← Primary agent
    │   ├── nvim-config.md           ← Subagent
    │   ├── shell-config.md          ← Subagent
    │   ├── ui-config.md             ← Subagent
    │   ├── app-config.md            ← Subagent
    │   ├── app-installer.md         ← Subagent
    │   ├── mise-manager.md          ← Subagent
    │   ├── script-creator.md        ← Subagent
    │   ├── custom-scripts.md        ← Subagent
    │   ├── key-encryptor.md         ← Subagent
    │   ├── key-validator.md         ← Subagent
    │   ├── documentation.md         ← Subagent
    │   └── git-manager.md           ← Subagent
    ├── INDEX.md
    ├── README.md
    ├── WORKFLOW_GUIDE.md
    └── ... (other documentation)
```

---

## How OpenCode Discovers Agents

1. **Primary Configuration**: Reads `opencode.json` in project root
2. **Agent Definitions**: Looks in `.opencode/agent/` for markdown files
3. **Agent Name**: Derived from markdown filename (e.g., `git-manager.md` → `@git-manager`)
4. **YAML Frontmatter**: Reads configuration from markdown frontmatter
5. **Agent Content**: Uses markdown content as system prompt

---

## Verification Checklist

✅ `opencode.json` exists in project root
✅ All 13 agents defined in `opencode.json`
✅ All agent markdown files in `.opencode/agent/`
✅ All markdown files have correct YAML frontmatter
✅ All markdown files have `mode: primary` or `mode: subagent`
✅ All markdown files have `description` field
✅ All markdown files have `temperature` field
✅ No `settings.json` file (removed)
✅ No `name` field in markdown frontmatter (defined in opencode.json)
✅ No `tools` field in markdown frontmatter (defined in opencode.json)
✅ No `permissions` field in markdown frontmatter (defined in opencode.json)

---

## Next Steps

1. **Verify Configuration**: OpenCode will automatically discover agents from `opencode.json` and `.opencode/agent/` directory
2. **Test Agents**: Use `@agent-name` to invoke agents in OpenCode
3. **Switch Primary Agent**: Use Tab key to switch between primary agents (currently only `dotfiles-manager`)
4. **Invoke Subagents**: Use `@subagent-name` to manually invoke subagents

---

## References

- **OpenCode Documentation**: https://opencode.ai/docs/agents/
- **Configuration File**: `opencode.json`
- **Agent Definitions**: `.opencode/agent/*.md`
- **Main Agent**: `@dotfiles-manager`

---

## Summary

Your OpenCode agent system is now **fully compliant with OpenCode standards**:

✅ Correct file structure
✅ Proper YAML frontmatter format
✅ Centralized configuration in `opencode.json`
✅ All 13 agents properly defined
✅ Ready to use with OpenCode

**You can now use your agents with OpenCode!**

