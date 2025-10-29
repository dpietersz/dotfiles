# OpenCode Agent System - Complete Index

## 📋 Documentation Map

### Start Here
1. **README.md** - Overview and quick start guide
2. **WORKFLOW_GUIDE.md** - How to use the agents with examples
3. **AGENT_ARCHITECTURE.md** - Agent hierarchy and design

### Deep Dives
4. **REQUIREMENTS_ANALYSIS.md** - How your requirements are addressed
5. **IMPLEMENTATION_SUMMARY.md** - What was created and how to get started
6. **settings.json** - Configuration metadata and tool specifications

---

## 🤖 Agent Files

### Primary Agent
- **agent/dotfiles-manager.md** - Orchestrates all subagents

### Configuration Agents
- **agent/nvim-config.md** - Neovim configuration specialist
- **agent/shell-config.md** - Shell configuration specialist
- **agent/ui-config.md** - UI configuration specialist
- **agent/app-config.md** - Application configuration specialist

### Installation Agents
- **agent/app-installer.md** - Installation coordinator
- **agent/mise-manager.md** - Tool version manager
- **agent/script-creator.md** - Chezmoi script specialist

### Utility Agents
- **agent/custom-scripts.md** - Custom shell scripts specialist

### Security Agents
- **agent/key-encryptor.md** - Key encryption specialist
- **agent/key-validator.md** - Key validation specialist

### Documentation Agents
- **agent/documentation.md** - Documentation specialist (Diátaxis framework)

### Git Agents
- **agent/git-manager.md** - Git operations specialist (conventional commits)

---

## 🎯 Quick Navigation by Task

### I want to modify Neovim
→ Read: **WORKFLOW_GUIDE.md** (Task 2)
→ Use: **@nvim-config**
→ Reference: **agent/nvim-config.md**

### I want to modify Shell config
→ Read: **WORKFLOW_GUIDE.md** (Task 1)
→ Use: **@shell-config**
→ Reference: **agent/shell-config.md**

### I want to modify UI config
→ Read: **WORKFLOW_GUIDE.md** (Task 3)
→ Use: **@ui-config**
→ Reference: **agent/ui-config.md**

### I want to modify App config
→ Read: **WORKFLOW_GUIDE.md** (Task 4)
→ Use: **@app-config**
→ Reference: **agent/app-config.md**

### I want to install an application
→ Read: **WORKFLOW_GUIDE.md** (Task 5)
→ Use: **@app-installer**
→ Reference: **agent/app-installer.md**

### I want to create a custom script
→ Read: **WORKFLOW_GUIDE.md** (Task 5)
→ Use: **@custom-scripts**
→ Reference: **agent/custom-scripts.md**

### I want to add an encrypted key
→ Read: **WORKFLOW_GUIDE.md** (Task 6)
→ Use: **@key-encryptor**
→ Reference: **agent/key-encryptor.md**

### I want to create documentation
→ Read: **WORKFLOW_GUIDE.md** (Task 7)
→ Use: **@documentation**
→ Reference: **agent/documentation.md**

### I want to commit changes
→ Read: **WORKFLOW_GUIDE.md** (Task 8)
→ Use: **@git-manager**
→ Reference: **agent/git-manager.md**
→ Reference: **docs/CONVENTIONAL_COMMITS.md**

### I want to push changes
→ Read: **WORKFLOW_GUIDE.md** (Task 9)
→ Use: **@git-manager**
→ Reference: **agent/git-manager.md**

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│ PRIMARY AGENT: dotfiles-manager                             │
│ Orchestrates all subagents, handles user requests           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ CONFIG AGENTS    │ │ INSTALL AGENTS   │ │ SECURITY AGENTS  │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ • nvim-config    │ │ • app-installer  │ │ • key-encryptor  │
│ • shell-config   │ │ • mise-manager   │ │ • key-validator  │
│ • ui-config      │ │ • script-creator │ │                  │
│ • app-config     │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 🚀 Getting Started (5 Steps)

### Step 1: Understand the System
- Read **README.md** (5 min)
- Read **WORKFLOW_GUIDE.md** (10 min)
- Review **AGENT_ARCHITECTURE.md** (5 min)

### Step 2: Try a Simple Task
```
Ask: "Add an alias for 'git status' as 'gs'"
Expected: @shell-config modifies dot_config/shell/40-aliases.sh
```

### Step 3: Review Changes
- Understand what was modified
- Verify syntax is correct
- Check environment compatibility

### Step 4: Commit Changes
- Use provided commit message
- Push to repository
- Test with `chezmoi apply`

### Step 5: Explore More Tasks
- Modify neovim configuration
- Install applications
- Add encrypted keys
- Create custom scripts

---

## 📚 Reference Documents

### External References
- **docs/OPENCODE_AGENT_BEST_PRACTICES.md** - Best practices guide
- **docs/ADDING_ENCRYPTED_KEYS_TO_DOTFILES.md** - Key encryption procedures
- **AGENTS.md** - Project-level guidelines

### Configuration Files
- **dot_config/mise/config.toml** - Tool versions
- **dot_config/nvim/** - Neovim configuration
- **dot_config/shell/** - Shell configuration
- **.chezmoiscripts/** - Installation scripts
- **.encrypted/** - Encrypted keys

---

## ✅ Capabilities Checklist

### Configuration Management
- ✅ Modify Neovim configuration (LazyVim)
- ✅ Modify Shell configuration (bash/zsh)
- ✅ Modify UI configuration (niri, waybar, terminals)
- ✅ Modify Application configuration (starship, git, k9s)

### Application Installation
- ✅ Install via mise (standard CLI tools)
- ✅ Install via scripts (complex installations)
- ✅ Automatic method selection
- ✅ Environment-aware installation

### Security Management
- ✅ Encrypt private keys with age
- ✅ Validate encrypted keys
- ✅ Update bootstrap scripts
- ✅ Follow security procedures

### Quality Assurance
- ✅ Syntax validation (Lua, Bash, TOML, JSON)
- ✅ Environment compatibility checking
- ✅ Consistency verification
- ✅ Documentation generation
- ✅ Testing and validation

---

## 🔧 Tools & Technologies

| Tool | Purpose |
|------|---------|
| **Chezmoi** | Dotfile management |
| **Mise** | Tool version management |
| **Age** | Key encryption |
| **Bash** | Shell scripting |
| **Lua** | Neovim configuration |
| **TOML/JSON/YAML** | Configuration formats |

---

## 📞 Support & Help

### If you need help:
1. **Ask the agent**: "What would happen if I...?"
2. **Request explanation**: "Explain why you chose this approach"
3. **Ask for alternatives**: "What are other ways to do this?"
4. **Request validation**: "Is this configuration correct?"

### Common Issues:
- See **WORKFLOW_GUIDE.md** → Troubleshooting section
- See **REQUIREMENTS_ANALYSIS.md** → How requirements are addressed
- See specific agent file → IMPORTANT CONSTRAINTS section

---

## 📁 File Structure

```
.opencode/
├── INDEX.md                     # This file
├── README.md                    # Overview and quick start
├── WORKFLOW_GUIDE.md            # How to use the agents
├── AGENT_ARCHITECTURE.md        # Agent design and hierarchy
├── REQUIREMENTS_ANALYSIS.md     # Requirements addressed
├── IMPLEMENTATION_SUMMARY.md    # What was created
├── settings.json                # Configuration metadata
└── agent/
    ├── dotfiles-manager.md      # Primary orchestrator
    ├── nvim-config.md           # Neovim specialist
    ├── shell-config.md          # Shell specialist
    ├── ui-config.md             # UI specialist
    ├── app-config.md            # App config specialist
    ├── app-installer.md         # Installation coordinator
    ├── mise-manager.md          # Mise tool manager
    ├── script-creator.md        # Script creation specialist
    ├── key-encryptor.md         # Key encryption specialist
    └── key-validator.md         # Key validation specialist
```

---

## 🎓 Learning Path

### Beginner
1. Read **README.md**
2. Read **WORKFLOW_GUIDE.md**
3. Try a simple task (add shell alias)

### Intermediate
1. Read **AGENT_ARCHITECTURE.md**
2. Try modifying neovim config
3. Try installing an application

### Advanced
1. Read **REQUIREMENTS_ANALYSIS.md**
2. Try adding encrypted keys
3. Try creating custom scripts

---

## 📝 Version Information

- **Created**: October 2025
- **System**: OpenCode Agent Framework
- **Repository**: dotfiles (chezmoi-managed)
- **Agents**: 10 specialized agents
- **Documentation**: 7 comprehensive guides
- **Environments**: Fedora, Bluefin-dx, macOS, Docker, Distrobox, DevContainers, VMs

---

## 🎯 Next Steps

1. **Start with README.md** - Get an overview
2. **Read WORKFLOW_GUIDE.md** - Learn how to use
3. **Try a simple task** - Add a shell alias
4. **Review changes** - Understand what was modified
5. **Commit and test** - Use `chezmoi apply` to verify

**You're ready to maintain your dotfiles with OpenCode agents!**

