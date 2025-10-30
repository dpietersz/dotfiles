# How to Modify Neovim Configuration with Auggie CLI

This guide shows you how to safely modify your Neovim configuration using the Auggie CLI multi-agent system.

## Prerequisites

- Auggie CLI installed and configured
- Basic understanding of Neovim and LazyVim

## Quick Method: Use Workflow Command

For most configuration changes, use the workflow command:

```bash
auggie /workflows:modify-config "nvim [your modification request]"
```

Examples:
```bash
# Add language support
auggie /workflows:modify-config "nvim Add Python treesitter support"

# Add new plugin
auggie /workflows:modify-config "nvim Add telescope-fzf-native plugin"

# Modify keymaps
auggie /workflows:modify-config "nvim Add keymap for buffer navigation"
```

This automatically handles security auditing, implementation, and git commits.

## Manual Method: Step-by-Step

### 1. Plan Your Changes

Get recommendations from the orchestrator:

```bash
auggie /dotfiles-manager "Add [specific feature] to neovim"
```

### 2. Security Audit (Pre-modification)

```bash
auggie /security:security-auditor "pre-audit [description of planned changes]"
```

Only proceed if you get `"decision": "APPROVE"`.

### 3. Make the Changes

```bash
auggie /config:nvim-config "[specific modification request]"
```

### 4. Security Audit (Post-modification)

```bash
auggie /security:security-auditor "post-audit [list of modified files]"
```

### 5. Commit Changes

```bash
auggie /utils:git-manager "commit feat(nvim): [description]"
```

## Common Modifications

### Adding Treesitter Language Support

```bash
auggie /config:nvim-config "Add rust to treesitter ensure_installed"
```

### Adding New Plugins

```bash
auggie /config:nvim-config "Add nvim-surround plugin with default configuration"
```

### Modifying Keymaps

```bash
auggie /config:nvim-config "Add keymap <leader>ff for telescope find_files"
```

### Updating Plugin Configuration

```bash
auggie /config:nvim-config "Configure telescope to use fzf sorting"
```

## File Locations

The Neovim specialist works with these files:

- `dot_config/nvim/lua/config/keymaps.lua` - Key mappings
- `dot_config/nvim/lua/config/options.lua` - Editor options
- `dot_config/nvim/lua/config/autocmds.lua` - Autocommands
- `dot_config/nvim/lua/plugins/*.lua` - Plugin configurations

## Troubleshooting

**Security audit blocks changes**: Review the `threats_found` in the audit response and follow mitigation strategies.

**Lua syntax errors**: The specialist validates syntax, but if errors occur, check the files manually and re-run.

**Plugin conflicts**: The specialist checks for conflicts, but complex plugin interactions may need manual resolution.

**LazyVim conventions**: The specialist follows LazyVim patterns. If you need custom patterns, specify them clearly.

## Best Practices

- **Use descriptive requests**: "Add Rust treesitter support" is better than "add rust"
- **One change at a time**: Don't combine multiple unrelated changes
- **Test changes**: Restart Neovim after modifications to verify they work
- **Use workflow commands**: They provide better error handling and recovery

## See Also

- [Tutorial: Your First Auggie CLI Multi-Agent Operation](../getting-started/auggie-cli-tutorial.md)
- [Reference: Auggie CLI Commands](../reference/auggie-cli-commands.md)
- [Explanation: Auggie CLI Architecture](../explanation/auggie-cli-architecture.md)