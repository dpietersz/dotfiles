# OpenCode Configuration Format Guide

## Overview

Your OpenCode configuration now uses **JSONC** (JSON with Comments) instead of plain JSON. This provides better readability and maintainability while keeping the same functionality.

## What is JSONC?

**JSONC** is JSON with support for:
- `// Single-line comments`
- `/* Multi-line comments */`
- Trailing commas in arrays and objects

This makes configuration files much more readable and self-documenting.

## File Structure

```
dot_config/opencode/
├── opencode.jsonc          ← Main configuration (JSONC format)
├── agent/                  ← Agent definitions (Markdown)
│   ├── second-brain.md
│   ├── note-clarifier.md
│   ├── note-processor.md
│   ├── link-strategist.md
│   ├── quality-checker.md
│   ├── moc-architect.md
│   ├── naming-specialist.md
│   ├── review-coordinator.md
│   └── pitfall-detector.md
└── command/                ← Command definitions (Markdown)
    ├── daily-review.md
    ├── weekly-review.md
    ├── monthly-review.md
    ├── create-fleeting.md
    ├── process-fleeting.md
    ├── validate-note.md
    ├── find-links.md
    ├── find-orphans.md
    ├── create-moc.md
    ├── check-pitfalls.md
    └── fix-naming.md
```

## Configuration Hierarchy

### 1. Main Config (JSONC)
**File**: `opencode.jsonc`
**Purpose**: Define agents, commands, workspace paths, and global settings
**Format**: JSONC (JSON with comments)

```jsonc
{
  // Workspace paths - where agents can read/write
  "workspace": {
    "paths": ["{env:HOME}/dev/Notes"]
  },
  
  // Agent definitions
  "agent": {
    "second-brain": { /* ... */ },
    "note-clarifier": { /* ... */ }
  },
  
  // Command definitions
  "command": {
    "daily-review": { /* ... */ }
  }
}
```

### 2. Agent Definitions (Markdown)
**Location**: `.opencode/agent/*.md`
**Purpose**: Full system prompts and detailed agent behavior
**Format**: Markdown with YAML frontmatter

```markdown
---
description: Agent description
mode: subagent
temperature: 0.3
tools:
  read: true
  edit: true
permission:
  edit: allow
---

# Agent System Prompt

Full instructions for the agent...
```

### 3. Command Definitions (Markdown)
**Location**: `.opencode/command/*.md`
**Purpose**: Quick command templates and descriptions
**Format**: Markdown with YAML frontmatter

```markdown
---
description: Command description
agent: agent-name
template: Template text for the command
---

Additional documentation...
```

## Key Sections in opencode.jsonc

### Workspace Configuration
```jsonc
"workspace": {
  "paths": [
    "{env:HOME}/dev/Notes"  // Cross-machine compatible path
  ]
}
```

### Primary Agent
```jsonc
"second-brain": {
  "description": "...",
  "mode": "primary",        // Main agent you interact with
  "temperature": 0.4,       // 0.0-1.0 (lower = more focused)
  "tools": {
    "read": true,           // Can read files
    "edit": true,           // Can create/edit files
    "bash": true            // Can run bash commands
  },
  "permission": {
    "edit": "allow",        // Allow edits without asking
    "bash": "allow"         // Allow bash without asking
  }
}
```

### Subagents
```jsonc
"note-clarifier": {
  "description": "...",
  "mode": "subagent",       // Specialized assistant
  "temperature": 0.5,       // Specific to this agent
  "tools": { /* ... */ },
  "permission": { /* ... */ }
}
```

### Commands
```jsonc
"daily-review": {
  "description": "...",
  "agent": "review-coordinator",  // Which agent handles this
  "template": "..."               // Template text for the command
}
```

## Temperature Settings

Temperature controls randomness and creativity:

| Range | Behavior | Use Case |
|-------|----------|----------|
| 0.0-0.2 | Very focused, deterministic | Analysis, validation, naming |
| 0.3-0.5 | Balanced | General tasks, processing |
| 0.6-1.0 | Creative, varied | Brainstorming, exploration |

**Current Setup**:
- `second-brain`: 0.4 (balanced orchestration)
- `note-clarifier`: 0.5 (thoughtful questions)
- `note-processor`: 0.3 (consistent formatting)
- `link-strategist`: 0.4 (balanced linking)
- `quality-checker`: 0.2 (strict validation)
- `moc-architect`: 0.4 (balanced organization)
- `naming-specialist`: 0.2 (strict consistency)
- `review-coordinator`: 0.3 (consistent guidance)
- `pitfall-detector`: 0.3 (consistent detection)

## Tool Access

### Available Tools
- `read`: Read files and directories
- `edit`: Create and modify files
- `bash`: Execute bash commands
- `webfetch`: Fetch web content

### Permission Levels
- `"allow"`: Execute without asking
- `"ask"`: Prompt for approval
- `"deny"`: Disable the tool

## Cross-Machine Compatibility

The configuration uses `{env:HOME}` for paths:

```jsonc
"workspace": {
  "paths": ["{env:HOME}/dev/Notes"]
}
```

This automatically expands to:
- **Linux**: `/home/username/dev/Notes`
- **macOS**: `/Users/username/dev/Notes`
- **Remote**: `/root/dev/Notes` or `/home/user/dev/Notes`

## Editing the Configuration

### When to Edit JSONC
- Add new agents
- Modify workspace paths
- Change global permissions
- Add new commands

### When to Edit Markdown Files
- Update agent system prompts
- Modify command templates
- Change agent descriptions
- Add detailed instructions

## Validation

To validate your JSONC file:

```bash
# Check syntax (requires jq or similar)
cat dot_config/opencode/opencode.jsonc | jq . > /dev/null && echo "Valid JSONC"

# Or use OpenCode's built-in validation
opencode config validate
```

## Comments Best Practices

```jsonc
{
  // Use comments to explain WHY, not WHAT
  // WHAT is obvious from the code
  // WHY helps future maintainers
  
  "agent": {
    "second-brain": {
      // Temperature 0.4 balances focused guidance with creative thinking
      // Lower (0.2) would be too rigid, higher (0.6) too unpredictable
      "temperature": 0.4
    }
  }
}
```

## Next Steps

1. **Apply to your system**:
   ```bash
   chezmoi apply
   ```

2. **Verify installation**:
   ```bash
   cat ~/.config/opencode/opencode.jsonc | head -20
   ```

3. **Start using**:
   ```bash
   opencode
   @second-brain I want to start building my second brain
   ```

## References

- [OpenCode Documentation](https://opencode.ai/docs/agents/)
- [JSONC Specification](https://github.com/microsoft/vscode/issues/2571)
- [Agent Configuration Guide](./FINAL_SETUP_SUMMARY.md)

