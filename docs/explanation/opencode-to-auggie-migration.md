# Migrating from OpenCode to Auggie CLI Multi-Agent System

This guide explains how to migrate from the OpenCode multi-agent system to the equivalent Auggie CLI implementation.

## Overview of Changes

The Auggie CLI system preserves all OpenCode functionality while adapting to Auggie's command-based architecture. The core capabilities remain the same, but the execution model changes from automatic agent orchestration to explicit command execution.

## Command Mapping

### Direct Agent to Command Translation

| OpenCode Agent | Auggie CLI Command | Notes |
|----------------|-------------------|-------|
| `@dotfiles-manager` | `auggie /dotfiles-manager` | Primary orchestrator |
| `@nvim-config` | `auggie /config:nvim-config` | Neovim specialist |
| `@shell-config` | `auggie /config:shell-config` | Shell specialist |
| `@ui-config` | `auggie /config:ui-config` | UI specialist (placeholder) |
| `@app-config` | `auggie /config:app-config` | App specialist (placeholder) |
| `@app-installer` | `auggie /install:app-installer` | App installer (placeholder) |
| `@mise-manager` | `auggie /install:mise-manager` | Mise manager (placeholder) |
| `@script-creator` | `auggie /install:script-creator` | Script creator (placeholder) |
| `@key-encryptor` | `auggie /security:key-encryptor` | Key encryptor (placeholder) |
| `@key-validator` | `auggie /security:key-validator` | Key validator (placeholder) |
| `@security-auditor` | `auggie /security:security-auditor` | Security auditor |
| `@custom-scripts` | `auggie /utils:custom-scripts` | Custom scripts (placeholder) |
| `@documentation` | `auggie /utils:documentation` | Documentation (placeholder) |
| `@git-manager` | `auggie /utils:git-manager` | Git manager |

### Workflow Translation

| OpenCode Workflow | Auggie CLI Equivalent |
|------------------|----------------------|
| Automatic agent delegation | `auggie /workflows:modify-config` |
| Multi-step operations | `auggie /workflows:install-app` |
| Security + commit workflow | `auggie /workflows:audit-and-commit` |

## Migration Examples

### Example 1: Modifying Neovim Configuration

**OpenCode Approach**:
```
User: "Add Rust treesitter support to neovim"
→ @dotfiles-manager analyzes and delegates to @nvim-config
→ @nvim-config makes changes and calls @security-auditor
→ @security-auditor approves and calls @git-manager
→ @git-manager commits with conventional format
```

**Auggie CLI Approach (Option 1 - Workflow)**:
```bash
auggie /workflows:modify-config "nvim Add Rust treesitter support"
```

**Auggie CLI Approach (Option 2 - Manual)**:
```bash
# 1. Get plan
auggie /dotfiles-manager "Add Rust treesitter support to neovim"

# 2. Execute recommended commands
auggie /security:security-auditor "pre-audit Add Rust to treesitter ensure_installed"
auggie /config:nvim-config "Add Rust to treesitter ensure_installed"
auggie /security:security-auditor "post-audit dot_config/nvim/lua/plugins/treesitter.lua"
auggie /utils:git-manager "commit feat(nvim): add Rust treesitter support"
```

### Example 2: Adding Shell Aliases

**OpenCode Approach**:
```
User: "Add docker aliases for common commands"
→ @dotfiles-manager delegates to @shell-config
→ @shell-config adds aliases and calls @security-auditor
→ @security-auditor approves and calls @git-manager
```

**Auggie CLI Approach**:
```bash
# Workflow approach (recommended)
auggie /workflows:modify-config "shell Add docker aliases for common commands"

# OR manual approach
auggie /dotfiles-manager "Add docker aliases for common commands"
# Then follow recommended commands
```

## Key Differences

### Execution Model

**OpenCode**:
- Automatic agent-to-agent delegation
- Context isolation between agents
- Built-in workflow orchestration

**Auggie CLI**:
- Explicit command execution
- Manual workflow coordination (or use workflow commands)
- Comprehensive instructions per command

### Workflow Coordination

**OpenCode**:
- Agents automatically call other agents
- Built-in error handling and recovery
- Seamless multi-step operations

**Auggie CLI**:
- Manual command chaining (or workflow commands)
- Explicit error handling per command
- Structured multi-step operations through workflows

## Migration Strategy

### Phase 1: Understand the New System

1. **Read the documentation**:
   - [Tutorial: Your First Auggie CLI Multi-Agent Operation](../getting-started/auggie-cli-tutorial.md)
   - [Reference: Auggie CLI Commands](../reference/auggie-cli-commands.md)
   - [Explanation: Auggie CLI Architecture](auggie-cli-architecture.md)

2. **Try the tutorial**: Complete the hands-on tutorial to understand the workflow

### Phase 2: Adapt Your Workflows

1. **Map to Auggie CLI equivalents**: Use the command mapping table above

2. **Choose your approach**:
   - **Workflow commands** for common operations (recommended)
   - **Manual commands** for complex or custom operations
   - **Orchestrator** for planning and guidance

## Best Practices for Migration

### Start with Workflow Commands

Workflow commands provide the closest experience to OpenCode's automatic orchestration:

```bash
# Instead of complex OpenCode agent chains
auggie /workflows:modify-config "nvim [changes]"
```

### Use the Orchestrator for Planning

When unsure about the right approach, start with the orchestrator:

```bash
auggie /dotfiles-manager "your request here"
```

### Maintain Security Practices

The security-first approach is preserved but requires explicit attention:

- Always run security audits for sensitive changes
- Use workflow commands that include built-in security checks
- Review security audit results before proceeding

## Conclusion

The migration from OpenCode to Auggie CLI preserves all the powerful capabilities of the original system while providing better integration, control, and flexibility. The security-first approach, environment awareness, and quality standards remain intact, ensuring a smooth transition with improved functionality.