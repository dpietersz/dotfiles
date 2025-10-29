# Custom Commands Implementation Summary

## Overview

Custom OpenCode commands have been added to streamline dotfiles maintenance workflows. These commands provide quick shortcuts for common tasks and are integrated with the agent system.

---

## What Was Added

### 7 Custom Commands

All commands are configured in `opencode.json` and defined as markdown files in `.opencode/command/`.

#### 1. **`/apply-dotfiles`**
- **Agent**: @dotfiles-manager
- **Purpose**: Apply dotfiles changes with chezmoi
- **File**: `.opencode/command/apply-dotfiles.md`

#### 2. **`/validate-config`**
- **Agent**: @dotfiles-manager
- **Purpose**: Validate all configuration files for syntax errors
- **File**: `.opencode/command/validate-config.md`

#### 3. **`/keybindings-summary`**
- **Agent**: @documentation
- **Purpose**: Generate keybindings summary from configs
- **File**: `.opencode/command/keybindings-summary.md`

#### 4. **`/check-environment`**
- **Agent**: @dotfiles-manager
- **Purpose**: Check dotfiles compatibility with current environment
- **File**: `.opencode/command/check-environment.md`

#### 5. **`/review-changes`**
- **Agent**: @dotfiles-manager
- **Purpose**: Review uncommitted changes in dotfiles
- **File**: `.opencode/command/review-changes.md`

#### 6. **`/check-mise`**
- **Agent**: @mise-manager
- **Purpose**: Validate and check mise tool configuration
- **File**: `.opencode/command/check-mise.md`

#### 7. **`/generate-docs`**
- **Agent**: @documentation
- **Purpose**: Generate comprehensive documentation from configs
- **File**: `.opencode/command/generate-docs.md`

---

## File Structure

```
/var/home/pietersz/dotfiles/
├── opencode.json                    ← Updated with commands
└── .opencode/
    ├── command/
    │   ├── apply-dotfiles.md        ← New
    │   ├── validate-config.md       ← New
    │   ├── keybindings-summary.md   ← New
    │   ├── check-environment.md     ← New
    │   ├── review-changes.md        ← New
    │   ├── check-mise.md            ← New
    │   └── generate-docs.md         ← New
    └── CUSTOM_COMMANDS_GUIDE.md     ← New
```

---

## Configuration

### opencode.json Updates

Added `command` section with 7 commands:

```json
"command": {
  "apply-dotfiles": {
    "description": "Apply dotfiles changes with chezmoi",
    "agent": "dotfiles-manager"
  },
  "validate-config": {
    "description": "Validate all configuration files for syntax errors",
    "agent": "dotfiles-manager"
  },
  "keybindings-summary": {
    "description": "Generate keybindings summary from configs",
    "agent": "documentation"
  },
  "check-environment": {
    "description": "Check dotfiles compatibility with current environment",
    "agent": "dotfiles-manager"
  },
  "review-changes": {
    "description": "Review uncommitted changes in dotfiles",
    "agent": "dotfiles-manager"
  },
  "check-mise": {
    "description": "Validate and check mise tool configuration",
    "agent": "mise-manager"
  },
  "generate-docs": {
    "description": "Generate comprehensive documentation from configs",
    "agent": "documentation"
  }
}
```

---

## Command Markdown Format

Each command is defined as a markdown file with YAML frontmatter:

```yaml
---
description: What this command does
agent: agent-name
---

Command template/prompt content...
```

**Example** (apply-dotfiles.md):
```yaml
---
description: Apply dotfiles changes with chezmoi
agent: dotfiles-manager
---

Apply the current dotfiles changes to the system using chezmoi.

Before applying, verify:
1. All changes have been committed with @git-manager
2. No uncommitted changes remain
3. The changes are appropriate for the current environment

Run `chezmoi apply` to apply the changes and report the results.
```

---

## How Commands Work

### Execution Flow

1. **User types command** in OpenCode TUI
   ```
   /apply-dotfiles
   ```

2. **OpenCode reads command definition** from `.opencode/command/apply-dotfiles.md`

3. **Extracts configuration**:
   - Description: "Apply dotfiles changes with chezmoi"
   - Agent: @dotfiles-manager
   - Template: The markdown content

4. **Routes to agent** (@dotfiles-manager)

5. **Agent executes** with the template as prompt

6. **Results returned** to user

---

## Command Categories

### Configuration Management (3 commands)
- `/validate-config` - Check syntax
- `/check-environment` - Verify compatibility
- `/check-mise` - Validate tool config

### Change Management (2 commands)
- `/review-changes` - Review uncommitted changes
- `/apply-dotfiles` - Apply changes to system

### Documentation (2 commands)
- `/keybindings-summary` - Generate keybindings reference
- `/generate-docs` - Generate comprehensive docs

---

## Typical Workflow

```
1. Make configuration changes
   ↓
2. /review-changes
   (Review what changed)
   ↓
3. /validate-config
   (Check for syntax errors)
   ↓
4. /check-environment
   (Verify compatibility)
   ↓
5. @git-manager
   (Commit changes with conventional commits)
   ↓
6. /apply-dotfiles
   (Apply to system)
   ↓
7. /generate-docs
   (Update documentation)
```

---

## Integration with Agents

Commands are integrated with the agent system:

- **@dotfiles-manager** - Handles most commands (4)
- **@documentation** - Handles documentation commands (2)
- **@mise-manager** - Handles mise validation (1)

Commands route to appropriate agents based on task type.

---

## Benefits

✅ **Quick Access**: Type `/` to see all available commands
✅ **Consistent**: All commands follow same format
✅ **Integrated**: Commands work with agent system
✅ **Extensible**: Easy to add new commands
✅ **Documented**: Each command has clear description
✅ **Workflow**: Commands support typical maintenance workflows

---

## Documentation

- **CUSTOM_COMMANDS_GUIDE.md** - Complete guide for using commands
- **Command markdown files** - Individual command definitions
- **opencode.json** - Command configuration

---

## Next Steps

1. **Use commands in OpenCode TUI**
   - Type `/` to see available commands
   - Select command and execute

2. **Integrate into workflow**
   - Use `/review-changes` before committing
   - Use `/validate-config` to catch errors
   - Use `/generate-docs` to update documentation

3. **Extend as needed**
   - Add new commands for recurring tasks
   - Update existing commands based on feedback
   - Document new commands

---

## Summary

Your OpenCode setup now includes:

✅ **13 specialized agents** (1 primary + 12 subagents)
✅ **7 custom commands** for common tasks
✅ **Integrated workflow** combining agents and commands
✅ **Complete documentation** for all features
✅ **Production-ready** system for dotfiles maintenance

**Your OpenCode setup is now complete and ready to use!**

