# OpenCode Workflow Guide for Dotfiles Repository

## Quick Start

### How to Use the Agents

1. **Start with the primary agent**: `@dotfiles-manager`
2. **Describe what you want to do** in natural language
3. **The agent will route to specialized subagents** as needed
4. **Review the changes** and approve before committing

### Example Interactions

```
You: "Add Rust treesitter support to neovim"
→ dotfiles-manager routes to @nvim-config
→ nvim-config modifies dot_config/nvim/lua/plugins/treesitter.lua
→ Returns summary of changes
→ You review and approve
```

```
You: "Install lazydocker on all machines"
→ dotfiles-manager routes to @app-installer
→ app-installer routes to @mise-manager
→ mise-manager adds lazydocker to dot_config/mise/config.toml
→ Returns summary of changes
→ You review and approve
```

---

## Workflow Patterns

### Pattern 1: Modify Configuration

**When**: You want to change a config file (neovim, shell, UI, etc.)

**Process**:
1. Ask: "Modify [config] to [change]"
2. Agent routes to appropriate config agent
3. Config agent modifies files
4. Review changes
5. Commit with provided message

**Example**:
```
You: "Add Ctrl+hjkl keybindings for tmux pane navigation in neovim"
→ @nvim-config modifies lua/config/keymaps.lua
→ Returns: "Added Ctrl+hjkl keymaps for tmux navigation"
→ You review and commit
```

### Pattern 2: Install Application

**When**: You want to install a new tool or application

**Process**:
1. Ask: "Install [app] on [environment]"
2. Agent determines installation method (mise or script)
3. Agent routes to appropriate installer
4. Installer modifies config or creates script
5. Review changes
6. Commit with provided message

**Example**:
```
You: "Install lazydocker on all machines"
→ @app-installer checks mise registry
→ Routes to @mise-manager
→ Adds lazydocker to dot_config/mise/config.toml
→ Returns: "Added lazydocker to mise"
→ You review and commit
```

### Pattern 3: Add Encrypted Key

**When**: You want to add a private key to the repository

**Process**:
1. Ask: "Add [key] to the repo"
2. Agent routes to @key-encryptor
3. Encryptor encrypts key with age
4. Agent routes to @key-validator
5. Validator verifies encryption
6. Agent routes to @script-creator
7. Script creator updates bootstrap script
8. Review all changes
9. Commit with provided message

**Example**:
```
You: "Add my cosign key to the repo"
→ @key-encryptor encrypts with age
→ @key-validator verifies encryption
→ @script-creator updates bootstrap script
→ Returns: "Cosign key encrypted and bootstrap updated"
→ You review and commit
```

---

## Agent Responsibilities Quick Reference

| Agent | Purpose | Use When |
|-------|---------|----------|
| **dotfiles-manager** | Orchestrates all agents | You have a request |
| **nvim-config** | Neovim configuration | Modifying neovim settings |
| **shell-config** | Shell configuration | Modifying bash/zsh settings |
| **ui-config** | UI configuration | Modifying niri, waybar, etc. |
| **app-config** | App configuration | Modifying starship, git, k9s, etc. |
| **app-installer** | Installation coordinator | Installing new applications |
| **mise-manager** | Mise tool management | Adding/updating tools in mise |
| **script-creator** | Chezmoi script creation | Creating installation scripts |
| **custom-scripts** | Custom shell scripts | Creating utility scripts in dot_local/bin/scripts/ |
| **key-encryptor** | Key encryption | Encrypting private keys |
| **key-validator** | Key validation | Verifying encrypted keys |
| **documentation** | Documentation creation | Creating docs using Diátaxis framework |
| **git-manager** | Git operations | Committing, pushing, branching with conventional commits |

---

## Common Tasks

### Task 1: Add a Shell Function

```
You: "Add a shell function to quickly navigate to my projects directory"

@dotfiles-manager → @shell-config
→ Modifies dot_config/shell/30-functions.sh
→ Adds function with documentation
→ Validates bash syntax
→ Returns summary
```

### Task 2: Update Neovim Plugin

```
You: "Update neovim to use the latest version of telescope"

@dotfiles-manager → @nvim-config
→ Modifies dot_config/nvim/lua/plugins/telescope.lua
→ Updates plugin configuration
→ Validates Lua syntax
→ Returns summary
```

### Task 3: Install System Tool

```
You: "Install btop (system monitor) on all machines"

@dotfiles-manager → @app-installer
→ Checks mise registry
→ Routes to @mise-manager
→ Adds btop to dot_config/mise/config.toml
→ Returns summary
```

### Task 4: Add Custom Installation Script

```
You: "Create a script to install a custom tool that's not in mise"

@dotfiles-manager → @app-installer
→ Routes to @script-creator
→ Creates .chezmoiscripts/run_once_after_XX-install-custom-tool.sh
→ Validates bash syntax
→ Returns summary
```

### Task 5: Create Custom Script

```
You: "Create a script to backup my dotfiles"

@dotfiles-manager → @custom-scripts
→ Creates dot_local/bin/scripts/executable_backup
→ Validates bash syntax
→ Returns summary with usage
```

### Task 6: Encrypt and Add SSH Key

```
You: "Add my SSH key to the dotfiles repo"

@dotfiles-manager → @key-encryptor
→ Encrypts ~/.ssh/id_ed25519 with age
→ Routes to @key-validator
→ Verifies encryption
→ Routes to @script-creator
→ Updates bootstrap script
→ Returns summary
```

### Task 7: Create Documentation

```
You: "Document the neovim keybindings"

@dotfiles-manager → @documentation
→ Extracts keybindings from lua/config/keymaps.lua
→ Creates docs/REFERENCE_NVIM_KEYBINDINGS.md
→ Formats as quick reference table
→ Returns summary
```

### Task 8: Commit Changes

```
You: "Commit the changes I made to neovim config"

@dotfiles-manager → @git-manager
→ Analyzes staged changes
→ Determines commit type (feat, fix, etc.)
→ Identifies scope (nvim, shell, etc.)
→ Creates conventional commit message
→ Asks for confirmation
→ Commits with message
→ Returns summary
```

### Task 9: Push Changes

```
You: "Push my changes to main"

@dotfiles-manager → @git-manager
→ Verifies working directory is clean
→ Confirms push destination
→ Executes git push
→ Reports results
```

---

## Environment Awareness

### Local Environments
- Fedora, Bluefin-dx, macOS
- Full features available
- SSH, GPG, GUI applications supported

### Remote Environments
- Docker, Distrobox, DevContainers, VMs
- Limited features
- No SSH/GPG setup
- No GUI applications

**Important**: Agents automatically handle environment detection using `{{ if .remote }}` in templates.

---

## Quality Assurance

All agents follow these quality standards:

1. **Syntax Validation**: All code/config is validated before completion
2. **Environment Compatibility**: Changes work across all environments
3. **Consistency Checking**: Changes don't break existing functionality
4. **Documentation**: All changes are clearly documented
5. **Testing**: Changes are tested when possible

---

## Troubleshooting

### Issue: Agent says "tool not in mise registry"

**Solution**: Use @script-creator to create a chezmoi script instead

### Issue: Configuration doesn't work in remote environment

**Solution**: Ensure configuration is wrapped in `{{ if not .remote }}` if it's local-only

### Issue: Encrypted key won't decrypt

**Solution**: Use @key-validator to diagnose the issue

### Issue: Shell function not working

**Solution**: Verify syntax with `bash -n` or `zsh -n`

---

## Next Steps

1. **Try a simple task**: Ask to add a shell alias
2. **Review the changes**: Understand what was modified
3. **Commit the changes**: Use provided commit message
4. **Test on your machine**: Run `chezmoi apply` to verify
5. **Explore more complex tasks**: As you get comfortable

---

## Tips & Best Practices

1. **Be specific**: "Add Rust treesitter" is better than "Update neovim"
2. **Provide context**: "Add keybinding for tmux navigation" is clearer
3. **Review changes**: Always review before committing
4. **Test locally**: Run `chezmoi apply` to verify changes work
5. **Commit frequently**: Small, focused commits are easier to manage
6. **Document decisions**: Explain why you made changes in commit messages

---

## Getting Help

If you're unsure about something:

1. **Ask the agent**: "What would happen if I...?"
2. **Request explanation**: "Explain why you chose this approach"
3. **Ask for alternatives**: "What are other ways to do this?"
4. **Request validation**: "Is this configuration correct?"

The agents are designed to be helpful and provide clear explanations.

