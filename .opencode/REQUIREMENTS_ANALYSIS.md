# Requirements Analysis & Implementation

## Your Requirements

You asked for the ability to:

1. ✅ Ask questions to change neovim config
2. ✅ Ask questions to change other configs in dot_config/
3. ✅ Give instructions to install applications
4. ✅ Ask to encrypt and add keys to the repo
5. ✅ Maintain everything in the repo with opencode agents

---

## Requirement 1: Modify Neovim Configuration

### Your Request
> "Ask questions to change my neovim config (in @`/var/home/pietersz/dotfiles/dot_config/nvim/`)"

### How It's Addressed

**Agent**: `@nvim-config`

**Capabilities**:
- Modify plugins in `lua/plugins/`
- Configure keymaps in `lua/config/keymaps.lua`
- Update options in `lua/config/options.lua`
- Set up autocmds in `lua/config/autocmds.lua`
- Validate Lua syntax
- Follow LazyVim conventions

**Example Interactions**:
```
"Add Rust treesitter support"
"Configure LSP for Python"
"Add Ctrl+hjkl keybindings for tmux navigation"
"Change colorscheme to gruvbox"
```

**Quality Assurance**:
- Lua syntax validation
- LazyVim convention compliance
- Conflict detection
- 2-space indentation enforcement

---

## Requirement 2: Modify Other Configs in dot_config/

### Your Request
> "Ask questions to change other configs in @`/var/home/pietersz/dotfiles/dot_config/`"
> Examples: niri, waybar, alacritty, kitty, starship, k9s, etc.

### How It's Addressed

**Agents**: `@ui-config`, `@app-config`, `@shell-config`

**UI Configurations** (`@ui-config`):
- `dot_config/niri/` - Window manager
- `dot_config/waybar/` - Status bar
- `dot_config/alacritty/` - Terminal
- `dot_config/kitty/` - Terminal
- Local-only with environment detection

**Application Configurations** (`@app-config`):
- `dot_config/starship.toml` - Shell prompt
- `dot_config/k9s/` - Kubernetes UI
- `dot_gitconfig` - Git settings
- Cross-platform compatibility

**Shell Configurations** (`@shell-config`):
- `dot_config/shell/` - Shared configs
- `dot_config/bash/` - Bash-specific
- `dot_config/zsh/` - Zsh-specific
- Functions, aliases, environment variables

**Example Interactions**:
```
"Fix waybar configuration for Bluefin"
"Add keybinding to niri for workspace switching"
"Change starship prompt theme to gruvbox"
"Configure git aliases"
"Add shell function for project navigation"
```

---

## Requirement 3: Install Applications

### Your Request
> "Give instructions to install an application on my host machine"
> "Should first look if it is possible with mise via @`dot_config/mise/config.toml`"
> "Otherwise via @`.chezmoiscripts/` folder with a script"

### How It's Addressed

**Agent**: `@app-installer` (Coordinator)
**Sub-agents**: `@mise-manager`, `@script-creator`

**Installation Decision Tree**:
```
User: "Install lazydocker"
  ↓
@app-installer checks mise registry
  ├─ Found → Route to @mise-manager
  │   → Add to dot_config/mise/config.toml
  │   → Done
  └─ Not found → Route to @script-creator
      → Create .chezmoiscripts/run_once_after_XX-install-tool.sh
      → Done
```

**Mise Installation** (`@mise-manager`):
- Add tools to `dot_config/mise/config.toml`
- Verify tool exists in mise registry
- Handle version pinning
- Cross-platform compatibility

**Script Installation** (`@script-creator`):
- Create chezmoi hook scripts
- Handle complex installations
- OS-specific logic
- Environment detection

**Example Interactions**:
```
"Install lazydocker on all machines"
"Install a custom tool via script"
"Add Python package to environment"
"Install system-specific package"
```

---

## Requirement 4: Encrypt and Add Keys

### Your Request
> "Ask to encrypt and add a key to the repo"
> "I have a manual for this @`docs/ADDING_ENCRYPTED_KEYS_TO_DOTFILES.md`"

### How It's Addressed

**Agents**: `@key-encryptor`, `@key-validator`, `@script-creator`

**Workflow**:
```
User: "Add my cosign key to the repo"
  ↓
@key-encryptor:
  → Encrypt with age: age -p -o .encrypted/cosign-private.key.age
  → Create .encrypted/cosign-private.pub.age
  ↓
@key-validator:
  → Verify encryption works
  → Test decryption
  → Verify integrity
  ↓
@script-creator:
  → Update .chezmoiscripts/run_once_after_01-decrypt-keys.sh.tmpl
  → Add decryption logic
  ↓
@dotfiles-manager:
  → Verify all changes
  → Ready for commit
```

**Key Encryption** (`@key-encryptor`):
- Encrypt with age using passphrase
- Create encrypted files in `.encrypted/`
- Verify encryption integrity
- Follow naming conventions

**Key Validation** (`@key-validator`):
- Verify encrypted files are valid
- Test decryption works
- Compare with originals
- Test key functionality

**Bootstrap Update** (`@script-creator`):
- Update decrypt script
- Add environment detection
- Set correct permissions
- Handle multiple keys

**Example Interactions**:
```
"Add my SSH key to the repo"
"Encrypt my cosign key"
"Add GPG key to dotfiles"
"Validate all encrypted keys"
```

---

## Requirement 5: Custom Shell Scripts

### Your Request
> "I have @`/var/home/pietersz/dotfiles/dot_local/bin/scripts/` folder with my custom shell scripts. This is very important as well, and I will need a special subagent for this too."

### How It's Addressed

**Agent**: `@custom-scripts`

**Capabilities**:
- Create new custom utility scripts
- Maintain existing scripts
- Validate bash syntax
- Handle error handling and user feedback
- Follow bash best practices

**Example Interactions**:
```
"Create a script to backup my dotfiles"
"Improve error handling in the backup script"
"Add a new utility script for file management"
```

---

## Requirement 6: Documentation with Diátaxis

### Your Request
> "I also want you to create a documentation agent which will document my configs, installed applications, encryption. Make a distinction between host machines and remote machines in the documentation. Must be in markdown in folder @`/var/home/pietersz/dotfiles/docs/`. The documentation must be done with a special technique/method for better use. The description can be found here: @`/var/home/pietersz/dotfiles/docs/DIATAXIS_GUID.md`"

### How It's Addressed

**Agent**: `@documentation`

**Capabilities**:
- Uses Diátaxis framework (tutorials, how-to guides, reference, explanation)
- Creates comprehensive documentation in `docs/`
- Distinguishes between host and remote environments
- Creates quick reference guides for keybindings and aliases
- Reflects current repository state via git history
- Organizes content by Diátaxis categories

**Example Interactions**:
```
"Document the neovim keybindings"
"Create a reference guide for shell aliases"
"Document the installation process"
"Create a quick reference for waybar shortcuts"
```

---

## Requirement 7: Git Operations with Conventional Commits

### Your Request
> "I want one more agent for git. This agent is responsible for doing all of the git related stuff, like git commit, etc for this repo. I want to use conventional commits in such a way they are prepared for perfect automated changelogs based on the commits. So a list conventional commit types are important as well as the things that can be between the parenthesis. This subagent is the only one which can do git related stuff."

### How It's Addressed

**Agent**: `@git-manager`

**Capabilities**:
- Manages all git operations (commit, push, pull, branch, merge, revert)
- Uses conventional commits format for automated changelog generation
- Validates commit message format
- References issues in commits
- Handles atomic commits
- ONLY agent authorized for git operations

**Conventional Commits Support**:
- Commit types: feat, fix, docs, style, refactor, perf, test, chore, ci, revert
- Scopes: nvim, shell, niri, waybar, alacritty, kitty, starship, git, k9s, mise, chezmoi, bootstrap, encryption, scripts, docs, deps, ci, repo
- Changelog generation: Automatically includes feat, fix, perf, revert; excludes docs, style, refactor, test, chore, ci
- Issue references: Closes #123, Fixes #456, Related-to #789

**Documentation**:
- `docs/CONVENTIONAL_COMMITS.md` - Complete conventional commits guide
- `agent/git-manager.md` - Git manager agent specification

**Example Interactions**:
```
"Commit the changes I made to neovim config"
→ @git-manager analyzes changes
→ Creates: feat(nvim): add telescope keybindings
→ Asks for confirmation
→ Commits with message

"Push my changes to main"
→ @git-manager verifies status
→ Confirms destination
→ Executes push
→ Reports results
```

---

## Requirement 8: Maintain Everything with Agents

### Your Request
> "Basically anything that has to do with my dotfiles and configs and everything that is in this repo must be maintainable with opencode agents and subagents"

### How It's Addressed

**Comprehensive Coverage**:

| Category | Agent | Scope |
|----------|-------|-------|
| Neovim | `@nvim-config` | All LazyVim configs |
| Shell | `@shell-config` | Bash, zsh, shared |
| UI | `@ui-config` | Niri, waybar, terminals |
| Apps | `@app-config` | Starship, git, k9s, etc. |
| Installation | `@app-installer` | Coordinate installations |
| Tools | `@mise-manager` | Manage tool versions |
| Scripts | `@script-creator` | Create chezmoi scripts |
| Custom Scripts | `@custom-scripts` | Custom shell scripts |
| Security | `@key-encryptor` | Encrypt keys |
| Validation | `@key-validator` | Validate keys |
| Documentation | `@documentation` | Create comprehensive docs |
| Git Operations | `@git-manager` | Commit, push, branch with conventional commits |

**Orchestration**:
- `@dotfiles-manager` routes all requests
- Ensures consistency across changes
- Validates environment compatibility
- Coordinates multi-step workflows

---

## Environment Support

### Your Environments

✅ **Local Machines**:
- Fedora
- Bluefin-dx
- macOS

✅ **Remote Environments**:
- Docker containers
- Distrobox containers
- DevContainers
- VM machines

### How It's Handled

All agents understand environment detection:
- Local-only features use `{{ if not .remote }}`
- Remote-safe features work everywhere
- Automatic environment detection
- OS-specific handling when needed

---

## Best Practices Integration

### From OPENCODE_AGENT_BEST_PRACTICES.md

✅ **YAML Frontmatter**: All agents have proper frontmatter with name, description, temperature, tools
✅ **System Prompt Design**: Clear role, responsibility, input/output, process, examples, constraints
✅ **Granularity**: Each agent has single, clear responsibility
✅ **Context Window Strategy**: Optimized token usage with Write, Select, Compress, Isolate
✅ **Altitude Principle**: Specific enough to guide, flexible enough to handle variations
✅ **Organization Structure**: Consistent markdown sections across all agents
✅ **Critical Emphasis**: Important constraints in CAPITALS
✅ **Subagent Specialization**: Task-specific agents for recurring complex tasks
✅ **Agent Communication**: Clear handoff patterns between agents
✅ **Validation Checklist**: Quality assurance built into every agent

---

## Quality Assurance

Every agent includes:

✅ **Syntax Validation**
- Lua for neovim
- Bash for shell scripts
- TOML for configurations
- JSON for settings

✅ **Environment Compatibility**
- Local vs remote detection
- OS-specific handling
- Cross-platform testing

✅ **Consistency Checking**
- No conflicts with existing configs
- Naming convention compliance
- Formatting consistency

✅ **Documentation**
- Clear change summaries
- Reasoning for decisions
- Manual steps documented

✅ **Testing**
- Configuration loads without errors
- Functionality verified
- Integration tested

---

## Summary

Your requirements are **fully addressed** by:

1. ✅ **9 specialized agents** with clear responsibilities
2. ✅ **Comprehensive documentation** for workflows and usage
3. ✅ **Environment-aware configuration** for all your machines
4. ✅ **Quality assurance** built into every agent
5. ✅ **Best practices** from OPENCODE_AGENT_BEST_PRACTICES.md
6. ✅ **Security procedures** for encrypted keys
7. ✅ **Flexible installation** via mise or scripts
8. ✅ **Complete coverage** of all dotfiles maintenance tasks

**You can now maintain your entire dotfiles repository using OpenCode agents!**

