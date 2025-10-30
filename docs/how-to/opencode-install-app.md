# How to Install Applications with OpenCode

This guide shows you how to use OpenCode to install and manage applications in your dotfiles environment.

## Prerequisites

- OpenCode installed and running
- Understanding of what application you want to install
- Basic familiarity with package managers (optional)

## Quick Start

```bash
# Open OpenCode
opencode

# Ask to install an application
I want to install ripgrep for fast file searching
```

OpenCode will:
1. Determine the best way to install the app
2. Update your configuration files
3. Ensure it's available in your environment

## Step-by-Step: Install an Application

Let's walk through a concrete example: installing ripgrep.

### Step 1: Describe What You Want

In OpenCode, type:

```
I want to install ripgrep (rg) for fast file searching
```

Include:
- **Application name**: ripgrep
- **What it does**: fast file searching
- **Why you want it**: optional, but helpful for context

### Step 2: Review the Installation Plan

OpenCode will show you:
- How it will be installed (via mise, homebrew, package manager, etc.)
- Which configuration files will be updated
- Any dependencies needed

Example output:
```
I'll install ripgrep using mise (your tool manager).

Changes:
- Add ripgrep to ~/.config/mise/config.toml
- This makes it available in your shell environment
```

### Step 3: Approve or Adjust

If the plan looks good, say:
```
Yes, install it
```

If you want to adjust:
```
Can you also install fd while you're at it?
```

### Step 4: Verify the Installation

OpenCode will confirm the installation. You can verify:

```bash
# Check if ripgrep is available
which rg
rg --version

# Check the configuration was updated
cat ~/.config/mise/config.toml | grep ripgrep
```

## Common Installation Tasks

### Install a Development Tool

```
I want to install Node.js for JavaScript development
```

OpenCode will:
- Add Node.js to your mise configuration
- Make it available in your shell
- Ensure it's installed on all your machines

### Install a System Utility

```
I want to install fzf for fuzzy finding
```

OpenCode will:
- Add fzf to your tool configuration
- Set up any necessary shell integration
- Make it available immediately

### Install Multiple Tools

```
I want to install these tools:
1. ripgrep (rg) - fast file searching
2. fd - fast file finder
3. bat - cat with syntax highlighting
4. exa - modern ls replacement
```

OpenCode will install all of them and update your configuration.

### Install a Language Runtime

```
I want to install Python 3.12 for development
```

OpenCode will:
- Add Python to your mise configuration
- Ensure it's available in your shell
- Set up any necessary environment variables

## Understanding Installation Methods

OpenCode uses different installation methods depending on your environment:

| Method | When Used | Example |
|--------|-----------|---------|
| **mise** | Tool version management | Node.js, Python, Ruby, Go |
| **Homebrew** | macOS package manager | Available on macOS only |
| **Package Manager** | Linux system packages | apt, dnf, pacman |
| **Chezmoi Scripts** | Custom installation | Complex setup scripts |
| **Direct Download** | Pre-built binaries | Some CLI tools |

## Tips for Better Results

### Be Specific About Purpose

❌ **Vague**: "Install a tool"
✅ **Specific**: "Install ripgrep for fast file searching in my projects"

### Mention Your Environment

```
I want to install Docker for containerized development
(I'm on Fedora Linux)
```

This helps OpenCode choose the right installation method.

### Ask About Dependencies

```
I want to install Neovim from source. What dependencies do I need?
```

OpenCode will explain what's needed and help you install them.

### Request Integration

```
I want to install fzf and integrate it with my shell
```

OpenCode will not only install it but also set up shell integration.

## Managing Installed Applications

### Update an Application

```
I want to update ripgrep to the latest version
```

OpenCode will update the version in your configuration.

### Remove an Application

```
I want to remove ripgrep since I'm not using it anymore
```

OpenCode will remove it from your configuration.

### Check What's Installed

```
What applications do I have installed?
```

OpenCode will list all tools in your mise configuration.

## Installation Locations

Applications are installed in different locations depending on the method:

| Method | Location | Example |
|--------|----------|---------|
| **mise** | `~/.local/share/mise/installs/` | `~/.local/share/mise/installs/node/20.0.0/bin/node` |
| **Homebrew** | `/usr/local/bin/` or `/opt/homebrew/bin/` | `/usr/local/bin/ripgrep` |
| **Package Manager** | `/usr/bin/` | `/usr/bin/ripgrep` |
| **Custom Scripts** | `~/.local/bin/` | `~/.local/bin/custom-tool` |

All are added to your `$PATH` automatically.

## Environment-Specific Installation

### Local Machine Only

```
I want to install Docker, but only on my local machine (not in containers)
```

OpenCode will add it to your local configuration only.

### Remote/Container Only

```
I want to install this development tool in my DevContainer
```

OpenCode will add it to your container configuration.

### All Environments

```
I want to install ripgrep everywhere (local and remote)
```

OpenCode will add it to your universal configuration.

## Troubleshooting

**Installation failed?**
```
The installation failed. Can you show me the error and suggest a fix?
```

OpenCode will show the error and help you resolve it.

**Application not found after installation?**
```bash
# Refresh your shell environment
source ~/.bashrc
# or
source ~/.zshrc

# Check if it's in your PATH
echo $PATH
which rg
```

**Want to see what was changed?**
```bash
# View configuration changes
git diff ~/.config/mise/config.toml

# See all changes
git status
```

**Installation method not what you expected?**
```
I wanted to install this with Homebrew, not mise. Can you change it?
```

OpenCode can adjust the installation method.

## Advanced: Custom Installation Scripts

For complex installations:

```
I want to install a tool that requires custom setup. Can you create a script?
```

OpenCode can:
- Create a custom installation script
- Add it to your chezmoi scripts
- Ensure it runs at the right time

## When to Use OpenCode vs Manual Installation

**Use OpenCode when:**
- You want the installation tracked in your dotfiles
- You want it available on all your machines
- You want OpenCode to handle dependencies
- You want the installation documented

**Use manual installation when:**
- You're experimenting with a tool
- You want to install it temporarily
- You need full control over the installation
- You're testing before adding to dotfiles

## Next Steps

- **Modify configurations**: [How to Modify Any Configuration](./opencode-modify-config.md)
- **Manage encrypted keys**: [How to Manage Encrypted Keys](./opencode-manage-keys.md)
- **Learn about agents**: [OpenCode Agents Reference](../reference/opencode-agents.md)

---

**Last Updated**: October 30, 2025
