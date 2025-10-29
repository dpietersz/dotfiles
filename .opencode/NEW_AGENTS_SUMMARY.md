# New Agents Summary - Custom Scripts & Documentation

## Overview

Two additional specialized agents have been created to extend the OpenCode system:

1. **@custom-scripts** - For managing custom shell scripts in `dot_local/bin/scripts/`
2. **@documentation** - For creating comprehensive documentation using Diátaxis framework

---

## Agent 1: @custom-scripts

### Purpose
Create and maintain custom shell scripts in `dot_local/bin/scripts/` for personal utilities and automation.

### Location
- **Agent Definition**: `.opencode/agent/custom-scripts.md`
- **Scripts Directory**: `dot_local/bin/scripts/`

### Capabilities

✅ **Script Creation**
- Create new custom utility scripts
- Design script functionality and flow
- Handle dependencies and edge cases

✅ **Script Maintenance**
- Update existing scripts
- Improve error handling
- Add new features

✅ **Quality Assurance**
- Validate bash syntax with `bash -n`
- Test script functionality
- Verify error handling
- Check for edge cases

✅ **Best Practices**
- Use `#!/bin/bash` (not `#!/usr/bin/env bash`)
- Use `set -euo pipefail` for error handling
- 2-space indentation
- Clear comments explaining logic
- Usage information included
- Proper naming convention (executable_ prefix)

### Example Interactions

```
"Create a script to backup my dotfiles"
→ @custom-scripts creates dot_local/bin/scripts/executable_backup
→ Validates bash syntax
→ Returns summary with usage

"Improve error handling in the backup script"
→ @custom-scripts reviews existing script
→ Adds better error messages and recovery
→ Validates bash syntax
→ Returns summary of improvements

"Add a new utility script for file management"
→ @custom-scripts creates new script
→ Implements functionality
→ Validates and tests
→ Returns summary
```

### Script Structure

All scripts follow this pattern:

```bash
#!/bin/bash
set -euo pipefail

# Script: script-name
# Purpose: What this script does
# Usage: script-name [options] [arguments]
# Dependencies: List any required tools

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

# Script functions
usage() {
  cat << EOF
Usage: $(basename "$0") [OPTIONS]
...
EOF
}

# Main logic
main() {
  # Parse arguments
  # Implement functionality
  # Handle errors
}

# Run main function
main "$@"
```

### Naming Convention

Scripts use the `executable_` prefix for chezmoi:
- `executable_ai` - AI integration
- `executable_backup` - Backup utility
- `executable_extract` - Archive extraction
- `executable_myip` - IP address utility
- `executable_[your-script-name]` - Your custom scripts

---

## Agent 2: @documentation

### Purpose
Create comprehensive documentation using the Diátaxis framework, with special focus on keybindings, aliases, and environment-specific content.

### Location
- **Agent Definition**: `.opencode/agent/documentation.md`
- **Documentation Directory**: `docs/`
- **Reference**: `docs/DIATAXIS_GUID.md`

### Capabilities

✅ **Diátaxis Framework**
- **Tutorials**: Learning-oriented, step-by-step (acquisition + action)
- **How-To Guides**: Goal-oriented, solve specific problems (application + action)
- **Reference**: Information-oriented, quick lookup (application + cognition)
- **Explanation**: Understanding-oriented, context and why (acquisition + cognition)

✅ **Quick Reference Guides**
- Extract keybindings into organized tables
- Extract aliases into reference lists
- Extract functions and their descriptions
- Organize by category for easy scanning

✅ **Environment Distinction**
- Separate documentation for host machines (Fedora, Bluefin-dx, macOS)
- Separate documentation for remote environments (Docker, Distrobox, DevContainers, VMs)
- Clear labeling of environment scope

✅ **Git History Awareness**
- Reflect current repository state
- Reference git history for context
- Explain design decisions and changes
- Document workflows and patterns

### Example Interactions

```
"Document the neovim keybindings"
→ @documentation extracts keybindings from lua/config/keymaps.lua
→ Creates docs/REFERENCE_NVIM_KEYBINDINGS.md
→ Formats as organized tables by category
→ Includes leader key, normal mode, insert mode, etc.

"Create a reference guide for shell aliases"
→ @documentation extracts aliases from dot_config/shell/40-aliases.sh
→ Creates docs/REFERENCE_SHELL_ALIASES.md
→ Organizes by category (git, file management, navigation, etc.)
→ Includes descriptions and usage

"Document the installation process"
→ @documentation creates docs/TUTORIAL_INSTALLATION.md
→ Step-by-step learning-oriented guide
→ Includes what you'll learn and expected results

"Create a quick reference for waybar shortcuts"
→ @documentation extracts keybindings from dot_config/waybar/
→ Creates docs/REFERENCE_WAYBAR_KEYBINDINGS.md
→ Formats as quick lookup table
```

### File Naming Convention

```
docs/
├── TUTORIAL_*.md              # Learning-oriented
├── HOWTO_*.md                 # Goal-oriented
├── REFERENCE_*.md             # Information-oriented
├── EXPLANATION_*.md           # Understanding-oriented
├── REFERENCE_KEYBINDINGS_*.md # Quick keybinding refs
├── REFERENCE_ALIASES_*.md     # Quick alias refs
└── INDEX.md                   # Navigation guide
```

### Quick Reference Format

**Keybindings Reference**:
```markdown
# Neovim Keybindings Reference

## Normal Mode

| Keybinding | Action | Category |
|------------|--------|----------|
| `<leader>ff` | Find files | Navigation |
| `<leader>fg` | Find grep | Search |
| `<C-h>` | Move to left pane | Pane Navigation |
```

**Aliases Reference**:
```markdown
# Shell Aliases Reference

## Git Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `gs` | `git status` | Show git status |
| `ga` | `git add` | Stage changes |
| `gc` | `git commit` | Commit changes |
```

### Environment Distinction

```markdown
## Host Machines Only

This applies to: Fedora, Bluefin-dx, macOS

[Content specific to local machines]

---

## Remote Environments

This applies to: Docker, Distrobox, DevContainers, VMs

[Content specific to remote environments]

---

## All Environments

This applies to: All machines (local and remote)

[Content that works everywhere]
```

---

## Integration with Primary Agent

Both new agents are fully integrated with `@dotfiles-manager`:

```
User Request
    ↓
@dotfiles-manager
    ├─ Routes to @custom-scripts for script requests
    └─ Routes to @documentation for documentation requests
```

---

## Total Agent Count

The OpenCode system now includes:

- **1 Primary Agent**: dotfiles-manager
- **4 Config Agents**: nvim-config, shell-config, ui-config, app-config
- **3 Install Agents**: app-installer, mise-manager, script-creator
- **1 Utility Agent**: custom-scripts
- **2 Security Agents**: key-encryptor, key-validator
- **1 Documentation Agent**: documentation

**Total: 12 specialized agents**

---

## Updated Documentation

All documentation files have been updated to include the new agents:

- ✅ `.opencode/README.md` - Updated agent list
- ✅ `.opencode/AGENT_ARCHITECTURE.md` - Updated hierarchy diagram
- ✅ `.opencode/WORKFLOW_GUIDE.md` - Added new tasks
- ✅ `.opencode/INDEX.md` - Added navigation for new agents
- ✅ `.opencode/GETTING_STARTED.md` - Added new tasks
- ✅ `.opencode/IMPLEMENTATION_SUMMARY.md` - Updated agent count
- ✅ `.opencode/REQUIREMENTS_ANALYSIS.md` - Added new requirements
- ✅ `.opencode/settings.json` - Updated agent list

---

## Getting Started with New Agents

### For Custom Scripts

1. Ask: "Create a script to [do something]"
2. @custom-scripts creates the script
3. Review the script
4. Commit with provided message

### For Documentation

1. Ask: "Document [config] keybindings" or "Create reference for [aliases]"
2. @documentation creates the documentation
3. Review the documentation
4. Commit with provided message

---

## Next Steps

1. **Try creating a custom script**: Ask @custom-scripts to create a utility
2. **Try creating documentation**: Ask @documentation to document keybindings
3. **Review the results**: Understand the output format
4. **Commit and test**: Use `chezmoi apply` to verify

---

## Summary

Your OpenCode agent system is now **complete with 12 specialized agents** covering:

✅ Configuration management (4 agents)
✅ Application installation (3 agents)
✅ Custom script creation (1 agent)
✅ Security and encryption (2 agents)
✅ Comprehensive documentation (1 agent)
✅ Primary orchestration (1 agent)

**You can now maintain your entire dotfiles repository with agents!**

