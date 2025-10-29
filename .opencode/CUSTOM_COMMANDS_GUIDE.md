# Custom Commands Guide

## Overview

Custom commands provide quick shortcuts for common dotfiles maintenance tasks. They are configured in `opencode.json` and defined as markdown files in `.opencode/command/`.

---

## Available Commands

### 1. `/apply-dotfiles`

**Description**: Apply dotfiles changes with chezmoi

**Agent**: @dotfiles-manager

**When to use**:
- After making configuration changes
- When you want to apply changes to the system
- Before committing to verify changes work

**What it does**:
- Verifies all changes are committed
- Checks for uncommitted changes
- Runs `chezmoi apply`
- Reports results

**Example**:
```
/apply-dotfiles
```

---

### 2. `/validate-config`

**Description**: Validate all configuration files for syntax errors

**Agent**: @dotfiles-manager

**When to use**:
- After editing configuration files
- Before committing changes
- To catch syntax errors early

**What it checks**:
- Lua files in `dot_config/nvim/` (Neovim config)
- Shell scripts in `dot_config/shell/` and `dot_local/bin/scripts/`
- TOML files (mise configuration)
- YAML files
- JSON files

**Example**:
```
/validate-config
```

---

### 3. `/keybindings-summary`

**Description**: Generate keybindings summary from configs

**Agent**: @documentation

**When to use**:
- When you want a quick reference of all keybindings
- To document keybindings for sharing
- To create a keybindings cheat sheet

**What it generates**:
- Neovim keybindings from `dot_config/nvim/`
- Niri window manager keybindings from `dot_config/niri/`
- Shell aliases and functions from `dot_config/shell/`
- Custom script shortcuts from `dot_local/bin/scripts/`

**Output**: Markdown file with organized keybindings reference

**Example**:
```
/keybindings-summary
```

---

### 4. `/check-environment`

**Description**: Check dotfiles compatibility with current environment

**Agent**: @dotfiles-manager

**When to use**:
- When setting up dotfiles on a new machine
- To verify environment compatibility
- To check for missing dependencies

**What it checks**:
- Current OS (Fedora, Bluefin-dx, macOS, or remote)
- Required tools availability
- Mise configuration
- Environment-specific configurations
- Remote vs local detection

**Example**:
```
/check-environment
```

---

### 5. `/review-changes`

**Description**: Review uncommitted changes in dotfiles

**Agent**: @dotfiles-manager

**When to use**:
- Before committing changes
- To organize changes into logical commits
- To verify changes are correct

**What it shows**:
- Modified files (git diff)
- Untracked files
- Staged changes
- Summary of changes

**What it analyzes**:
- Are changes related to a single feature/fix?
- Do changes follow repository conventions?
- Are there potential issues or conflicts?
- Should changes be split into multiple commits?

**Example**:
```
/review-changes
```

---

### 6. `/check-mise`

**Description**: Validate and check mise tool configuration

**Agent**: @mise-manager

**When to use**:
- After modifying `dot_config/mise/config.toml`
- To check tool versions
- To find available updates

**What it checks**:
- Configuration syntax and validity
- All configured tools are available
- Tool version compatibility
- Missing tools
- Outdated tools

**Example**:
```
/check-mise
```

---

### 7. `/generate-docs`

**Description**: Generate comprehensive documentation from configs

**Agent**: @documentation

**When to use**:
- After making significant configuration changes
- To update documentation
- To create comprehensive guides

**What it generates**:
- Configuration overview
- Installation guide
- Environment setup guide
- Keybindings reference
- Aliases and functions reference
- Tool versions and dependencies
- Troubleshooting guide

**Framework**: Uses Diátaxis framework
- Tutorials: Getting started
- How-to guides: Common tasks
- Reference: Complete lists
- Explanation: Why things are configured

**Example**:
```
/generate-docs
```

---

## How to Use Commands

### In OpenCode TUI

1. Type `/` to see available commands
2. Type the command name (e.g., `/apply-dotfiles`)
3. Press Enter to execute

### Command Workflow Example

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
   (Commit changes)
   ↓
6. /apply-dotfiles
   (Apply to system)
   ↓
7. /generate-docs
   (Update documentation)
```

---

## Command Configuration

### File Structure

```
.opencode/
├── command/
│   ├── apply-dotfiles.md
│   ├── validate-config.md
│   ├── keybindings-summary.md
│   ├── check-environment.md
│   ├── review-changes.md
│   ├── check-mise.md
│   └── generate-docs.md
```

### Configuration in opencode.json

```json
"command": {
  "apply-dotfiles": {
    "description": "Apply dotfiles changes with chezmoi",
    "agent": "dotfiles-manager"
  },
  ...
}
```

---

## Creating New Commands

To add a new command:

1. **Create markdown file** in `.opencode/command/`
   ```
   .opencode/command/my-command.md
   ```

2. **Add YAML frontmatter**
   ```yaml
   ---
   description: What this command does
   agent: agent-name
   ---
   ```

3. **Add command template** (the prompt)
   ```markdown
   Do something specific...
   ```

4. **Update opencode.json**
   ```json
   "command": {
     "my-command": {
       "description": "What this command does",
       "agent": "agent-name"
     }
   }
   ```

---

## Tips & Best Practices

✅ **Do**:
- Use commands for repetitive tasks
- Keep command descriptions clear and concise
- Route commands to appropriate agents
- Document what each command does
- Use commands before committing

❌ **Don't**:
- Create commands for one-time tasks
- Make commands too complex
- Forget to update documentation
- Skip validation before applying

---

## Troubleshooting

### Command not found
- Check command name spelling
- Verify markdown file exists in `.opencode/command/`
- Verify command is defined in `opencode.json`

### Command fails
- Check agent has required permissions
- Verify agent has access to needed tools
- Review command template for errors

### Command output unclear
- Check agent temperature setting
- Review command description
- Verify agent has enough context

---

## Summary

Custom commands provide a powerful way to automate common dotfiles maintenance tasks:

✅ 7 specialized commands for different tasks
✅ Each command routes to appropriate agent
✅ Commands follow OpenCode standards
✅ Easy to extend with new commands
✅ Integrated with agent system

**Start using commands with `/` in OpenCode TUI!**

