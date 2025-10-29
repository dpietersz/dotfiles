# OpenCode Agent System for Dotfiles Repository

## Overview

This directory contains the OpenCode agent configuration for managing your dotfiles repository across multiple environments (Fedora, Bluefin-dx, macOS, Docker, Distrobox, DevContainers, VMs).

The system uses a **primary agent** (`dotfiles-manager`) that orchestrates **9 specialized subagents** to handle different aspects of dotfiles maintenance.

---

## Quick Start

### Start Here

1. **Read**: `.opencode/WORKFLOW_GUIDE.md` - Learn how to use the agents
2. **Understand**: `.opencode/AGENT_ARCHITECTURE.md` - Understand the agent hierarchy
3. **Ask**: Start with `@dotfiles-manager` for any dotfiles-related request

### Example Interaction

```
You: "Add Rust treesitter support to neovim"

@dotfiles-manager:
  → Routes to @nvim-config
  → Modifies dot_config/nvim/lua/plugins/treesitter.lua
  → Validates Lua syntax
  → Returns: "Added Rust to treesitter ensure_installed"

You: Review changes and approve
```

---

## Agent System

### Primary Agent

**`dotfiles-manager`** - Orchestrates all subagents, understands user intent, ensures consistency

### Config Agents (Modify Configurations)

- **`nvim-config`** - Neovim configuration (LazyVim)
- **`shell-config`** - Shell configs (bash, zsh, shared)
- **`ui-config`** - UI configs (niri, waybar, alacritty, kitty)
- **`app-config`** - App configs (starship, git, k9s, etc.)

### Install Agents (Install Applications)

- **`app-installer`** - Coordinates application installation
- **`mise-manager`** - Manages tool versions in mise
- **`script-creator`** - Creates chezmoi installation scripts

### Utility Agents (Custom Scripts)

- **`custom-scripts`** - Creates and maintains custom shell scripts in `dot_local/bin/scripts/`

### Security Agents (Manage Encryption)

- **`key-encryptor`** - Encrypts private keys with age
- **`key-validator`** - Validates encrypted keys

### Documentation Agents (Create Documentation)

- **`documentation`** - Creates comprehensive documentation using Diátaxis framework

### Git Agents (Manage Git Operations)

- **`git-manager`** - Manages all git operations with conventional commits

---

## What You Can Do

### 1. Modify Neovim Configuration
```
"Add Rust treesitter support"
"Configure LSP for Python"
"Add keybinding for buffer navigation"
```

### 2. Modify Shell Configuration
```
"Add a shell function for git operations"
"Add an alias for common commands"
"Configure environment variables"
```

### 3. Modify UI Configuration
```
"Fix waybar configuration for Bluefin"
"Add keybinding to niri"
"Change terminal colors in alacritty"
```

### 4. Modify Application Configuration
```
"Change starship prompt theme"
"Configure git aliases"
"Customize k9s appearance"
```

### 5. Install Applications
```
"Install lazydocker on all machines"
"Install a custom tool via script"
"Add Python package to environment"
```

### 6. Manage Encrypted Keys
```
"Add my SSH key to the repo"
"Encrypt my cosign key"
"Validate all encrypted keys"
```

---

## File Structure

```
.opencode/
├── README.md                    # This file
├── AGENT_ARCHITECTURE.md        # Agent hierarchy and design
├── WORKFLOW_GUIDE.md            # How to use the agents
├── settings.json                # Configuration and metadata
└── agent/
    ├── dotfiles-manager.md      # Primary agent
    ├── nvim-config.md           # Neovim config agent
    ├── shell-config.md          # Shell config agent
    ├── ui-config.md             # UI config agent
    ├── app-config.md            # App config agent
    ├── app-installer.md         # Installation coordinator
    ├── mise-manager.md          # Mise tool manager
    ├── script-creator.md        # Script creation agent
    ├── key-encryptor.md         # Key encryption agent
    └── key-validator.md         # Key validation agent
```

---

## Key Concepts

### Environment Awareness

The system understands two environment types:

**Local** (Fedora, Bluefin-dx, macOS):
- Full features available
- SSH, GPG, GUI applications supported
- System package installation available

**Remote** (Docker, Distrobox, DevContainers, VMs):
- Limited features
- CLI tools only
- No SSH/GPG setup
- No GUI applications

Agents automatically handle environment detection using `{{ if .remote }}` in templates.

### Quality Assurance

Every agent follows these standards:

1. **Syntax Validation** - All code/config validated before completion
2. **Environment Compatibility** - Changes work across all environments
3. **Consistency Checking** - Changes don't break existing functionality
4. **Documentation** - All changes clearly documented
5. **Testing** - Changes tested when possible

---

## Common Workflows

### Workflow 1: Modify Configuration

1. Ask: "Modify [config] to [change]"
2. Agent routes to appropriate config agent
3. Config agent modifies files and validates
4. Review changes
5. Commit with provided message

### Workflow 2: Install Application

1. Ask: "Install [app] on [environment]"
2. Agent determines installation method (mise or script)
3. Agent routes to appropriate installer
4. Installer modifies config or creates script
5. Review changes
6. Commit with provided message

### Workflow 3: Add Encrypted Key

1. Ask: "Add [key] to the repo"
2. Agent routes to @key-encryptor
3. Encryptor encrypts key with age
4. Agent routes to @key-validator
5. Validator verifies encryption
6. Agent routes to @script-creator
7. Script creator updates bootstrap script
8. Review all changes
9. Commit with provided message

---

## Documentation

- **WORKFLOW_GUIDE.md** - How to use the agents with examples
- **AGENT_ARCHITECTURE.md** - Agent hierarchy and responsibilities
- **settings.json** - Configuration and metadata
- **docs/OPENCODE_AGENT_BEST_PRACTICES.md** - Best practices reference
- **docs/ADDING_ENCRYPTED_KEYS_TO_DOTFILES.md** - Key encryption procedures
- **AGENTS.md** - Project-level guidelines

---

## Tips & Best Practices

1. **Be specific**: "Add Rust treesitter" is better than "Update neovim"
2. **Provide context**: "Add keybinding for tmux navigation" is clearer
3. **Review changes**: Always review before committing
4. **Test locally**: Run `chezmoi apply` to verify changes work
5. **Commit frequently**: Small, focused commits are easier to manage
6. **Document decisions**: Explain why in commit messages

---

## Getting Started

1. **Read WORKFLOW_GUIDE.md** - Understand how to interact with agents
2. **Try a simple task** - Ask to add a shell alias
3. **Review the changes** - Understand what was modified
4. **Commit the changes** - Use provided commit message
5. **Test on your machine** - Run `chezmoi apply` to verify
6. **Explore more complex tasks** - As you get comfortable

---

## Support

If you need help:

1. **Ask the agent**: "What would happen if I...?"
2. **Request explanation**: "Explain why you chose this approach"
3. **Ask for alternatives**: "What are other ways to do this?"
4. **Request validation**: "Is this configuration correct?"

The agents are designed to be helpful and provide clear explanations.

---

## Version

- **Created**: October 2025
- **System**: OpenCode Agent Framework
- **Repository**: dotfiles (chezmoi-managed)
- **Environments**: Fedora, Bluefin-dx, macOS, Docker, Distrobox, DevContainers, VMs

