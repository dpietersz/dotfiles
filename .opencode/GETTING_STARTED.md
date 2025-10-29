# Getting Started with OpenCode Agents

## 🎯 What You Now Have

A **production-ready multi-agent system** for maintaining your dotfiles repository with:

- ✅ **10 specialized agents** with clear responsibilities
- ✅ **Comprehensive documentation** (7 guides + 10 agent files)
- ✅ **Environment-aware configuration** for all your machines
- ✅ **Built-in quality assurance** for every change
- ✅ **Best practices** from OPENCODE_AGENT_BEST_PRACTICES.md
- ✅ **Security procedures** for encrypted keys
- ✅ **Flexible installation** via mise or scripts
- ✅ **Complete coverage** of all dotfiles maintenance tasks

---

## 📖 Documentation Overview

### Quick Start (Read These First)
1. **INDEX.md** - Navigation guide and quick reference
2. **README.md** - Overview and quick start
3. **WORKFLOW_GUIDE.md** - How to use the agents with examples

### Deep Understanding
4. **AGENT_ARCHITECTURE.md** - Agent hierarchy and design
5. **REQUIREMENTS_ANALYSIS.md** - How your requirements are addressed
6. **IMPLEMENTATION_SUMMARY.md** - What was created

### Configuration
7. **settings.json** - Metadata and tool specifications

---

## 🤖 Your 10 Agents

### Primary Agent (Orchestrator)
- **@dotfiles-manager** - Routes requests to specialized agents

### Configuration Agents (Modify Configs)
- **@nvim-config** - Neovim configuration
- **@shell-config** - Shell configuration (bash/zsh)
- **@ui-config** - UI configuration (niri, waybar, terminals)
- **@app-config** - Application configuration (starship, git, k9s)

### Installation Agents (Install Apps)
- **@app-installer** - Coordinates installation method
- **@mise-manager** - Manages tool versions in mise
- **@script-creator** - Creates chezmoi installation scripts

### Utility Agents (Custom Scripts)
- **@custom-scripts** - Creates custom shell scripts in `dot_local/bin/scripts/`

### Security Agents (Manage Keys)
- **@key-encryptor** - Encrypts private keys with age
- **@key-validator** - Validates encrypted keys

### Documentation Agents (Create Docs)
- **@documentation** - Creates documentation using Diátaxis framework

### Git Agents (Manage Git)
- **@git-manager** - Manages git operations with conventional commits

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Understand the System (2 min)
Read **INDEX.md** - It's a navigation guide that shows you where to go

### Step 2: Learn How to Use (2 min)
Read **WORKFLOW_GUIDE.md** - See examples of how to interact with agents

### Step 3: Try Your First Task (1 min)
```
Ask: "Add an alias for 'git status' as 'gs'"

Expected flow:
→ @dotfiles-manager routes to @shell-config
→ @shell-config modifies dot_config/shell/40-aliases.sh
→ Returns summary of changes
→ You review and approve
```

---

## 💡 Common Tasks

### Task 1: Modify Neovim
```
"Add Rust treesitter support"
"Configure LSP for Python"
"Add Ctrl+hjkl keybindings for tmux navigation"
```
→ Use: **@nvim-config**

### Task 2: Modify Shell
```
"Add a shell function for git operations"
"Add an alias for common commands"
"Configure environment variables"
```
→ Use: **@shell-config**

### Task 3: Modify UI
```
"Fix waybar configuration for Bluefin"
"Add keybinding to niri"
"Change terminal colors in alacritty"
```
→ Use: **@ui-config**

### Task 4: Modify App Config
```
"Change starship prompt theme"
"Configure git aliases"
"Customize k9s appearance"
```
→ Use: **@app-config**

### Task 5: Install Application
```
"Install lazydocker on all machines"
"Install a custom tool via script"
"Add Python package to environment"
```
→ Use: **@app-installer**

### Task 6: Create Custom Script
```
"Create a script to backup my dotfiles"
"Add a new utility script for file management"
"Improve an existing script with better error handling"
```
→ Use: **@custom-scripts**

### Task 7: Add Encrypted Key
```
"Add my SSH key to the repo"
"Encrypt my cosign key"
"Validate all encrypted keys"
```
→ Use: **@key-encryptor** or **@key-validator**

### Task 8: Create Documentation
```
"Document the neovim keybindings"
"Create a reference guide for shell aliases"
"Document the installation process"
```
→ Use: **@documentation**

### Task 9: Commit Changes
```
"Commit the changes I made to neovim config"
"Commit the shell alias fix"
"Commit the documentation updates"
```
→ Use: **@git-manager**

### Task 10: Push Changes
```
"Push my changes to main"
"Push the new feature branch"
"Push all commits to remote"
```
→ Use: **@git-manager**

---

## 📋 Workflow Pattern

Every task follows this pattern:

```
1. You describe what you want
   ↓
2. @dotfiles-manager understands your intent
   ↓
3. Routes to appropriate specialized agent
   ↓
4. Agent modifies files and validates
   ↓
5. Agent returns summary of changes
   ↓
6. You review changes
   ↓
7. You approve and commit
```

---

## ✅ Quality Assurance

Every agent ensures:

- ✅ **Syntax Validation** - All code/config validated
- ✅ **Environment Compatibility** - Works across all environments
- ✅ **Consistency Checking** - No conflicts with existing configs
- ✅ **Documentation** - Changes clearly documented
- ✅ **Testing** - Changes tested when possible

---

## 🌍 Environment Support

Your agents understand:

**Local Environments** (Fedora, Bluefin-dx, macOS):
- Full features available
- SSH, GPG, GUI applications
- System package installation

**Remote Environments** (Docker, Distrobox, DevContainers, VMs):
- CLI tools only
- No SSH/GPG setup
- No GUI applications

Agents automatically handle environment detection using `{{ if .remote }}`.

---

## 📚 Documentation Files

```
.opencode/
├── INDEX.md                     # Navigation guide (START HERE)
├── README.md                    # Overview and quick start
├── GETTING_STARTED.md           # This file
├── WORKFLOW_GUIDE.md            # How to use agents with examples
├── AGENT_ARCHITECTURE.md        # Agent design and hierarchy
├── REQUIREMENTS_ANALYSIS.md     # How requirements are addressed
├── IMPLEMENTATION_SUMMARY.md    # What was created
├── settings.json                # Configuration metadata
└── agent/                       # 10 agent definition files
    ├── dotfiles-manager.md
    ├── nvim-config.md
    ├── shell-config.md
    ├── ui-config.md
    ├── app-config.md
    ├── app-installer.md
    ├── mise-manager.md
    ├── script-creator.md
    ├── key-encryptor.md
    └── key-validator.md
```

---

## 🎓 Learning Path

### Beginner (15 minutes)
1. Read **INDEX.md** (5 min)
2. Read **README.md** (5 min)
3. Read **WORKFLOW_GUIDE.md** (5 min)

### Intermediate (30 minutes)
1. Read **AGENT_ARCHITECTURE.md** (10 min)
2. Try modifying neovim config (10 min)
3. Try installing an application (10 min)

### Advanced (1 hour)
1. Read **REQUIREMENTS_ANALYSIS.md** (15 min)
2. Try adding encrypted keys (20 min)
3. Try creating custom scripts (25 min)

---

## 🔍 Finding What You Need

### I want to...
- **Modify Neovim** → Read WORKFLOW_GUIDE.md (Task 2) → Use @nvim-config
- **Modify Shell** → Read WORKFLOW_GUIDE.md (Task 1) → Use @shell-config
- **Modify UI** → Read WORKFLOW_GUIDE.md (Task 3) → Use @ui-config
- **Modify Apps** → Read WORKFLOW_GUIDE.md (Task 4) → Use @app-config
- **Install Apps** → Read WORKFLOW_GUIDE.md (Task 5) → Use @app-installer
- **Add Keys** → Read WORKFLOW_GUIDE.md (Task 6) → Use @key-encryptor
- **Understand Design** → Read AGENT_ARCHITECTURE.md
- **See Requirements** → Read REQUIREMENTS_ANALYSIS.md
- **Navigate Everything** → Read INDEX.md

---

## 💬 How to Interact

### Simple Request
```
You: "Add an alias for 'git status' as 'gs'"
Agent: Modifies file, validates, returns summary
You: Review and approve
```

### Complex Request
```
You: "Add my SSH key to the repo"
Agent: Routes through encryption → validation → bootstrap update
You: Review all changes and approve
```

### Clarification
```
You: "What would happen if I...?"
Agent: Explains the process and implications
You: Proceed or ask for alternatives
```

---

## 🎯 Next Steps

### Right Now
1. Read **INDEX.md** - Get oriented
2. Read **README.md** - Understand the system
3. Read **WORKFLOW_GUIDE.md** - Learn how to use

### Today
1. Try a simple task (add shell alias)
2. Review the changes
3. Commit and test with `chezmoi apply`

### This Week
1. Modify neovim configuration
2. Install an application
3. Add an encrypted key

### Ongoing
1. Use agents for all dotfiles maintenance
2. Commit frequently with clear messages
3. Test changes with `chezmoi apply`

---

## 📞 Need Help?

### Common Questions
- **How do I use the agents?** → Read WORKFLOW_GUIDE.md
- **What can the agents do?** → Read README.md
- **How are my requirements addressed?** → Read REQUIREMENTS_ANALYSIS.md
- **Where do I find things?** → Read INDEX.md

### Troubleshooting
- **Agent says "tool not in mise registry"** → Use @script-creator instead
- **Configuration doesn't work in remote** → Ensure `{{ if not .remote }}` wrapper
- **Encrypted key won't decrypt** → Use @key-validator to diagnose
- **Shell function not working** → Verify syntax with `bash -n`

---

## 🎉 You're Ready!

You now have a **complete, production-ready agent system** for maintaining your dotfiles repository.

**Start with INDEX.md and begin using the agents!**

---

## 📊 System Summary

| Aspect | Details |
|--------|---------|
| **Agents** | 10 specialized agents |
| **Documentation** | 8 comprehensive guides |
| **Environments** | Fedora, Bluefin-dx, macOS, Docker, Distrobox, DevContainers, VMs |
| **Capabilities** | Config modification, app installation, key management |
| **Quality** | Syntax validation, environment compatibility, consistency checking |
| **Best Practices** | Follows OPENCODE_AGENT_BEST_PRACTICES.md |

---

**Welcome to your new OpenCode agent system! 🚀**

