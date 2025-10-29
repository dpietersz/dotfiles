# OpenCode Agent Architecture for Dotfiles Repository

## Executive Summary

This document outlines the multi-agent system designed to manage the dotfiles repository across multiple environments (Fedora, Bluefin-dx, macOS, Docker, Distrobox, DevContainers, VMs).

**Key Capabilities:**
- Modify neovim and other configs in `dot_config/`
- Install applications via mise or chezmoi scripts
- Encrypt and add keys to the repository
- Maintain consistency across all environments
- Handle environment-specific configurations

---

## Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ PRIMARY AGENT: dotfiles-manager                             │
│ (Orchestrates all subagents, handles user requests)         │
└─────────────────────────────────────────────────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
    ▼                       ▼                       ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ CONFIG AGENTS    │ │ INSTALL AGENTS   │ │ SECURITY AGENTS  │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ • nvim-config    │ │ • app-installer  │ │ • key-encryptor  │
│ • shell-config   │ │ • mise-manager   │ │ • key-validator  │
│ • ui-config      │ │ • script-creator │ │                  │
│ • app-config     │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        │                   │                       │
        ▼                   ▼                       ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ UTILITY AGENTS   │ │ DOCS AGENTS      │ │ GIT AGENTS       │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ • custom-scripts │ │ • documentation  │ │ • git-manager    │
│                  │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## Agent Responsibilities

### PRIMARY AGENT: dotfiles-manager
- **Role**: Orchestrates all subagents, understands user intent
- **Responsibilities**:
  - Route requests to appropriate subagents
  - Validate environment compatibility
  - Ensure consistency across changes
  - Coordinate multi-step workflows
  - Provide status updates

### CONFIG AGENTS

#### nvim-config
- Modify neovim configuration in `dot_config/nvim/`
- Understand LazyVim structure
- Validate Lua syntax
- Test configuration changes

#### shell-config
- Modify shell configs in `dot_config/shell/`, `dot_config/bash/`, `dot_config/zsh/`
- Handle environment detection (remote vs local)
- Validate shell syntax
- Test sourcing and functionality

#### ui-config
- Modify UI configs: `dot_config/niri/`, `dot_config/waybar/`, `dot_config/alacritty/`, etc.
- Handle environment-specific UI (local only)
- Validate configuration syntax

#### app-config
- Modify application configs: `dot_config/starship.toml`, `dot_config/k9s/`, etc.
- Understand tool-specific configuration formats
- Validate configurations

### INSTALL AGENTS

#### app-installer
- Determine installation method (mise vs chezmoi scripts)
- Check `dot_config/mise/config.toml` for existing tools
- Create chezmoi scripts if needed
- Handle environment-specific installations

#### mise-manager
- Manage `dot_config/mise/config.toml`
- Add/update/remove tool versions
- Validate mise configuration
- Understand tool availability across platforms

#### script-creator
- Create chezmoi hook scripts in `.chezmoiscripts/`
- Understand chezmoi templating and lifecycle
- Handle environment detection ({{ if .remote }})
- Validate script syntax

### UTILITY AGENTS

#### custom-scripts
- Create and maintain custom shell scripts in `dot_local/bin/scripts/`
- Understand bash scripting best practices
- Handle error handling and user feedback
- Validate script syntax and functionality

### SECURITY AGENTS

#### key-encryptor
- Encrypt private keys using age
- Follow `docs/ADDING_ENCRYPTED_KEYS_TO_DOTFILES.md`
- Create encrypted files in `.encrypted/`
- Verify encryption integrity

#### key-validator
- Validate encrypted keys
- Check permissions
- Verify decryption works
- Test key functionality

### DOCUMENTATION AGENTS

#### documentation
- Create comprehensive documentation using Diátaxis framework
- Maintain documentation in `docs/` directory
- Create quick reference guides for keybindings and aliases
- Distinguish between host and remote environments
- Reflect current repository state via git history
- Organize content into tutorials, how-to guides, reference, and explanation

### GIT AGENTS

#### git-manager
- Manage all git operations (commit, push, pull, branch, merge, revert)
- Use conventional commits for automated changelog generation
- Validate commit message format
- Reference issues in commits
- Handle atomic commits
- ONLY agent authorized for git operations

---

## Workflow Examples

### Example 1: Install Application
```
User: "Install lazydocker on my machines"
  ↓
dotfiles-manager: Route to app-installer
  ↓
app-installer: Check mise/config.toml
  ↓
mise-manager: Add lazydocker to config
  ↓
dotfiles-manager: Verify and commit
```

### Example 2: Modify Neovim Config
```
User: "Add treesitter support for Rust"
  ↓
dotfiles-manager: Route to nvim-config
  ↓
nvim-config: Modify dot_config/nvim/lua/
  ↓
nvim-config: Validate Lua syntax
  ↓
dotfiles-manager: Verify and commit
```

### Example 3: Add Encrypted Key
```
User: "Add my cosign key to the repo"
  ↓
dotfiles-manager: Route to key-encryptor
  ↓
key-encryptor: Encrypt key with age
  ↓
key-validator: Verify encryption
  ↓
script-creator: Update bootstrap script
  ↓
dotfiles-manager: Verify and commit
```

---

## Environment Awareness

All agents must understand:
- **Local environments**: Fedora, Bluefin-dx, macOS (full features)
- **Remote environments**: Docker, Distrobox, DevContainers, VMs (limited features)
- **Template variables**: `{{ if .remote }}`, `{{ .chezmoi.os }}`, etc.

---

## Quality Assurance

Each agent must:
1. Validate syntax before committing
2. Check for environment compatibility
3. Verify changes don't break existing configs
4. Test on multiple environments when possible
5. Document changes clearly

---

## Next Steps

1. Create `.opencode/agent/` directory
2. Implement primary agent: `dotfiles-manager.md`
3. Implement config agents (nvim, shell, ui, app)
4. Implement install agents (app-installer, mise-manager, script-creator)
5. Implement security agents (key-encryptor, key-validator)
6. Test workflows end-to-end

