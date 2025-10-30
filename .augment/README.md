# Auggie CLI Custom Commands - Dotfiles Management System

This directory contains a complete translation of the OpenCode multi-agent system to Auggie CLI Custom Commands, providing the same powerful dotfiles management capabilities with a security-first approach.

## System Overview

This Auggie CLI system replicates the OpenCode multi-agent architecture using custom commands:

- **Primary Orchestrator**: Routes requests to specialized commands
- **Specialized Commands**: Handle specific domains (config, security, installation)
- **Workflow Commands**: Coordinate multi-step operations
- **Security-First Approach**: Mandatory security auditing for all changes

## Command Structure

```
.augment/commands/
├── dotfiles-manager.md           # Primary orchestrator
├── config/                       # Configuration specialists
│   ├── nvim-config.md           # Neovim (LazyVim) specialist
│   ├── shell-config.md          # Shell (bash/zsh) specialist
│   ├── ui-config.md             # UI (niri/waybar) specialist
│   └── app-config.md            # App config specialist
├── install/                      # Installation specialists
│   ├── app-installer.md         # App installation coordinator
│   ├── mise-manager.md          # Mise tool manager
│   └── script-creator.md        # Script creation specialist
├── security/                     # Security specialists
│   ├── key-encryptor.md         # Key encryption specialist
│   ├── key-validator.md         # Key validation specialist
│   └── security-auditor.md      # Security auditing (CRITICAL)
├── utils/                        # Utility specialists
│   ├── custom-scripts.md        # Custom script creator
│   ├── documentation.md         # Documentation generator
│   └── git-manager.md           # Git operations specialist
└── workflows/                    # Multi-step workflows
    ├── modify-config.md         # Config modification workflow
    ├── install-app.md           # App installation workflow
    ├── add-encrypted-key.md     # Key encryption workflow
    └── audit-and-commit.md      # Security audit + commit workflow
```

## Usage Examples

### Primary Orchestrator
```bash
# Get routing recommendations for any task
auggie /dotfiles-manager "Add Rust treesitter support to neovim"
auggie /dotfiles-manager "Install lazydocker on all machines"
auggie /dotfiles-manager "Add my SSH key to the repo"
```

### Direct Specialist Commands
```bash
# Modify Neovim configuration
auggie /config:nvim-config "Add Rust to treesitter ensure_installed"

# Modify shell configuration
auggie /config:shell-config "Add docker aliases for common commands"

# Security audit
auggie /security:security-auditor "pre-audit Add new SSH key configuration"
```

### Workflow Commands (Recommended)
```bash
# Complete configuration modification workflow
auggie /workflows:modify-config "nvim Add Rust treesitter support"

# Complete app installation workflow
auggie /workflows:install-app "lazydocker"

# Complete key encryption workflow
auggie /workflows:add-encrypted-key "SSH key for work server"
```

## OpenCode to Auggie Mapping

| OpenCode Agent | Auggie Command | Purpose |
|----------------|----------------|---------|
| `@dotfiles-manager` | `/dotfiles-manager` | Primary orchestrator |
| `@nvim-config` | `/config:nvim-config` | Neovim configuration |
| `@shell-config` | `/config:shell-config` | Shell configuration |
| `@ui-config` | `/config:ui-config` | UI configuration |
| `@app-config` | `/config:app-config` | App configuration |
| `@app-installer` | `/install:app-installer` | App installation |
| `@mise-manager` | `/install:mise-manager` | Mise tool management |
| `@script-creator` | `/install:script-creator` | Script creation |
| `@key-encryptor` | `/security:key-encryptor` | Key encryption |
| `@key-validator` | `/security:key-validator` | Key validation |
| `@security-auditor` | `/security:security-auditor` | Security auditing |
| `@custom-scripts` | `/utils:custom-scripts` | Custom scripts |
| `@documentation` | `/utils:documentation` | Documentation |
| `@git-manager` | `/utils:git-manager` | Git operations |

## Key Differences from OpenCode

### Architecture Differences
- **OpenCode**: Multi-agent with context isolation and agent-to-agent communication
- **Auggie**: Single-command execution with manual orchestration

### Workflow Adaptation
- **OpenCode**: Automatic agent delegation and handoff
- **Auggie**: Explicit command chaining through workflow commands

### Context Management
- **OpenCode**: Isolated context windows per agent
- **Auggie**: Shared context with command-specific instructions

## Security-First Approach

**CRITICAL**: All changes must go through security auditing:

1. **Pre-modification audit**: `auggie /security:security-auditor "pre-audit [description]"`
2. **Post-modification audit**: `auggie /security:security-auditor "post-audit [files]"`
3. **Workflow integration**: Security audits are built into workflow commands

### Security Threat Detection
- **Credentials**: API keys, passwords, tokens, secrets
- **Personal Information**: Names, emails, phone numbers
- **Sensitive Paths**: Private directories, system information
- **Configuration Secrets**: Database URLs, service endpoints

## Environment Awareness

The system handles multiple environments:

**Local Environments** (Fedora, Bluefin-dx, macOS):
- Full features available
- SSH, GPG, GUI applications supported
- System package installation available

**Remote Environments** (Docker, Distrobox, DevContainers, VMs):
- Limited features (CLI tools only)
- No SSH/GPG setup
- No GUI applications

Environment detection uses chezmoi templates: `{{ if .remote }}`

## Quality Standards

All commands follow these standards:
- **Syntax Validation**: All code/config must be validated
- **Environment Compatibility**: Changes must work across all environments
- **Consistency**: Changes must not break existing functionality
- **Documentation**: All changes must be clearly documented
- **Security**: All changes must pass security audits

## Getting Started

1. **Start with the orchestrator** for complex tasks:
   ```bash
   auggie /dotfiles-manager "your request here"
   ```

2. **Use workflow commands** for common operations:
   ```bash
   auggie /workflows:modify-config "nvim your modification"
   ```

3. **Use specialist commands** for direct modifications:
   ```bash
   auggie /config:nvim-config "your specific change"
   ```

4. **Always run security audits** for sensitive changes:
   ```bash
   auggie /security:security-auditor "pre-audit your planned changes"
   ```

## Migration from OpenCode

If migrating from the OpenCode system:

1. **Replace agent calls** with equivalent Auggie commands
2. **Use workflow commands** for multi-step operations
3. **Maintain security practices** with explicit audit calls
4. **Update documentation** to reference Auggie commands

The functionality remains the same, but the execution model changes from automatic agent orchestration to explicit command execution.