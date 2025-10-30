# Auggie CLI Commands Reference

Complete reference for all Auggie CLI custom commands in the multi-agent dotfiles management system.

## Command Structure

All commands follow the pattern:
```bash
auggie /[category]:[command] "[arguments]"
```

## Primary Orchestrator

### `/dotfiles-manager`

**Purpose**: Primary orchestrator for all dotfiles operations

**Syntax**: `auggie /dotfiles-manager "[task-description]"`

**Arguments**:
- `task-description` (string, required): Natural language description of the task

**Returns**: Implementation plan with recommended commands

**Example**:
```bash
auggie /dotfiles-manager "Add Rust treesitter support to neovim"
```

## Configuration Commands

### `/config:nvim-config`

**Purpose**: Modify Neovim configuration following LazyVim conventions

**Syntax**: `auggie /config:nvim-config "[modification-request]"`

**Arguments**:
- `modification-request` (string, required): Specific Neovim modification to make

**Files Modified**:
- `dot_config/nvim/lua/config/keymaps.lua`
- `dot_config/nvim/lua/config/options.lua`
- `dot_config/nvim/lua/config/autocmds.lua`
- `dot_config/nvim/lua/plugins/*.lua`

**Examples**:
```bash
auggie /config:nvim-config "Add Rust to treesitter ensure_installed"
auggie /config:nvim-config "Add nvim-surround plugin with default configuration"
```

### `/config:shell-config`

**Purpose**: Modify shell configuration for bash and zsh

**Syntax**: `auggie /config:shell-config "[modification-request]"`

**Arguments**:
- `modification-request` (string, required): Specific shell modification to make

**Files Modified**:
- `dot_config/shell/10-exports.sh` - Environment variables
- `dot_config/shell/20-path.sh` - PATH modifications
- `dot_config/shell/30-functions.sh` - Shell functions
- `dot_config/shell/40-aliases.sh` - Shell aliases
- `dot_config/shell/50-completions.sh` - Shell completions
- `dot_config/shell/90-local.sh` - Local overrides

**Examples**:
```bash
auggie /config:shell-config "Add docker aliases for common commands"
auggie /config:shell-config "Add mkcd function to create and cd to directory"
```

## Security Commands

### `/security:security-auditor`

**Purpose**: Audit changes for security threats and information leakage

**Syntax**: `auggie /security:security-auditor "[audit-type] [description-or-files]"`

**Arguments**:
- `audit-type` (string, required): Type of audit - `pre-audit`, `post-audit`, or `plan-audit`
- `description-or-files` (string, required): Description of changes or list of files to audit

**Returns**: JSON-formatted security assessment with decision (APPROVE/BLOCK/CONDITIONAL)

**Examples**:
```bash
auggie /security:security-auditor "pre-audit Add Rust treesitter support"
auggie /security:security-auditor "post-audit dot_config/nvim/lua/plugins/treesitter.lua"
```

**Response Format**:
```json
{
  "audit_type": "pre-audit|post-audit|plan-audit",
  "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "decision": "BLOCK|APPROVE|CONDITIONAL",
  "threats_found": [...],
  "recommendations": [...],
  "approval_conditions": [...],
  "summary": "Brief summary"
}
```

## Utility Commands

### `/utils:git-manager`

**Purpose**: Manage git operations with conventional commits

**Syntax**: `auggie /utils:git-manager "[operation] [description]"`

**Arguments**:
- `operation` (string, required): Git operation - `commit`, `status`, `diff`, `log`, `reset`, `branch`
- `description` (string, optional): Description for commit operations

**Examples**:
```bash
auggie /utils:git-manager "commit feat(nvim): add Rust treesitter support"
auggie /utils:git-manager "status"
auggie /utils:git-manager "diff"
```

**Commit Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test changes
- `chore` - Build/tool changes

**Scopes**:
- `nvim` - Neovim configuration
- `shell` - Shell configuration
- `ui` - UI configuration
- `app` - Application configuration
- `security` - Security changes
- `install` - Installation scripts
- `docs` - Documentation

## Workflow Commands

### `/workflows:modify-config`

**Purpose**: Complete configuration modification workflow with security auditing

**Syntax**: `auggie /workflows:modify-config "[config-type] [modification-description]"`

**Arguments**:
- `config-type` (string, required): Type of config - `nvim`, `shell`, `ui`, `app`
- `modification-description` (string, required): Description of the modification

**Process**:
1. Pre-modification security audit
2. Configuration implementation
3. Post-modification security audit
4. Git commit with conventional format

**Examples**:
```bash
auggie /workflows:modify-config "nvim Add Rust treesitter support"
auggie /workflows:modify-config "shell Add docker aliases"
```

## Command Categories

### Configuration Management
- `/config:nvim-config` - Neovim specialist
- `/config:shell-config` - Shell specialist
- `/config:ui-config` - UI specialist (placeholder)
- `/config:app-config` - App specialist (placeholder)

### Security & Auditing
- `/security:security-auditor` - Security auditing (CRITICAL)
- `/security:key-encryptor` - Key encryption (placeholder)
- `/security:key-validator` - Key validation (placeholder)

### Utilities
- `/utils:git-manager` - Git operations
- `/utils:custom-scripts` - Script creation (placeholder)
- `/utils:documentation` - Documentation (placeholder)

### Workflows
- `/workflows:modify-config` - Config modification workflow
- `/workflows:install-app` - App installation workflow (placeholder)
- `/workflows:add-encrypted-key` - Key encryption workflow (placeholder)
- `/workflows:audit-and-commit` - Audit + commit workflow (placeholder)

## Error Handling

All commands provide structured error responses and recovery suggestions when operations fail.

## Security Considerations

- All configuration changes must pass security auditing
- Sensitive information is automatically detected and blocked
- Environment-specific configurations use chezmoi templates
- Public repository safety is enforced at all levels