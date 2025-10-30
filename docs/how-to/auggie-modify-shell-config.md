# How to Modify Shell Configuration with Auggie CLI

This guide shows you how to safely modify your shell configuration (bash/zsh) using the Auggie CLI multi-agent system.

## Prerequisites

- Auggie CLI installed and configured
- Basic understanding of shell scripting

## Quick Method: Use Workflow Command

```bash
auggie /workflows:modify-config "shell [your modification request]"
```

Examples:
```bash
# Add aliases
auggie /workflows:modify-config "shell Add docker aliases for common commands"

# Add functions
auggie /workflows:modify-config "shell Add function to create and cd to directory"

# Add environment variables
auggie /workflows:modify-config "shell Add EDITOR environment variable"
```

## Manual Method: Step-by-Step

### 1. Plan Your Changes

```bash
auggie /dotfiles-manager "Add [specific shell feature]"
```

### 2. Security Audit (Pre-modification)

```bash
auggie /security:security-auditor "pre-audit [description]"
```

### 3. Make the Changes

```bash
auggie /config:shell-config "[specific modification request]"
```

### 4. Security Audit (Post-modification)

```bash
auggie /security:security-auditor "post-audit [modified files]"
```

### 5. Commit Changes

```bash
auggie /utils:git-manager "commit feat(shell): [description]"
```

## Common Modifications

### Adding Aliases

```bash
auggie /config:shell-config "Add docker aliases: dc for docker-compose, dps for docker ps"
```

### Adding Shell Functions

```bash
auggie /config:shell-config "Add mkcd function to create directory and cd into it"
```

### Adding Environment Variables

```bash
auggie /config:shell-config "Add EDITOR=nvim environment variable"
```

### Adding to PATH

```bash
auggie /config:shell-config "Add ~/.local/bin to PATH if it exists"
```

## File Locations

The shell specialist works with these files:

- `dot_config/shell/10-exports.sh` - Environment variables
- `dot_config/shell/20-path.sh` - PATH modifications
- `dot_config/shell/30-functions.sh` - Shell functions
- `dot_config/shell/40-aliases.sh` - Shell aliases
- `dot_config/shell/50-completions.sh` - Shell completions
- `dot_config/shell/90-local.sh` - Local overrides

## Environment Considerations

The shell specialist handles different environments automatically:

**Local environments**: Full features available
**Remote environments**: Limited to CLI tools only

Environment detection uses chezmoi templates like `{{ if .remote }}`.

## Best Practices

- **Use descriptive names**: Make aliases and functions self-explanatory
- **Test cross-shell compatibility**: Changes work in both bash and zsh
- **Use proper quoting**: Prevent word splitting issues
- **Add comments**: Explain non-obvious configurations
- **One change per request**: Don't combine multiple unrelated changes

## See Also

- [Tutorial: Your First Auggie CLI Multi-Agent Operation](../getting-started/auggie-cli-tutorial.md)
- [Reference: Shell Configuration Files](../reference/shell-config-files.md)