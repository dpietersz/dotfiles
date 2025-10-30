# Dotfiles Documentation

Welcome to the documentation for your dotfiles repository. This documentation is organized using the [Diátaxis framework](./explanation/diataxis-framework.md), which divides documentation into four types based on user needs.

## Documentation Structure

### 🎓 [Getting Started](./getting-started/)

**Learning-oriented tutorials** for beginners. Follow step-by-step instructions to complete meaningful tasks and acquire skills.

- [Getting Started Guide](./getting-started/README.md) - Introduction to tutorials and learning materials
- [Getting Started with OpenCode](./getting-started/opencode-setup.md) - Quick 5-minute introduction to the agent system
- [Security Remediation Status](./getting-started/remediation-status.md) - Current status of security remediation

### 📋 [How-To Guides](./how-to/)

**Goal-oriented guides** for solving specific problems. Assumes you know what you want and focuses on achieving the goal.

- [Modify Any Configuration with OpenCode](./how-to/opencode-modify-config.md) - Change Neovim, shell, UI, and app settings
- [Install Applications with OpenCode](./how-to/opencode-install-app.md) - Install and manage applications
- [Manage Encrypted Keys with OpenCode](./how-to/opencode-manage-keys.md) - Securely add and validate encrypted keys
- [Create Custom Scripts with OpenCode](./how-to/opencode-create-scripts.md) - Create automation scripts
- [Add Encrypted Keys](./how-to/add-encrypted-keys.md) - Securely add private keys to your dotfiles
- [Write Git Commits](./how-to/git-commits.md) - Follow conventional commit standards
- [Verify Security Remediation](./how-to/verify-remediation.md) - Verify and update after security remediation

### 📚 [Reference](./reference/)

**Information-oriented documentation** for looking up facts and specifications. Neutral, factual descriptions of the machinery.

- [Reference Documentation Hub](./reference/README.md) - Overview of all reference materials
- [OpenCode Agents Reference](./reference/opencode-agents.md) - Quick reference for all agents and commands
- [Neovim Keybindings](./reference/nvim-keybindings.md) - Complete Neovim keybindings reference
- [Niri Window Manager Keybindings](./reference/niri-keybindings.md) - Complete Niri WM keybindings reference
- [Shell Aliases & Functions](./reference/shell-aliases.md) - Complete shell aliases and functions reference
- [All Keybindings](./reference/keybindings.md) - Comprehensive keybindings reference
- [Conventional Commits Format](./reference/conventional-commits-format.md) - Commit message specification
- [Remediation Technical Reference](./reference/remediation-details.md) - Technical details of security remediation

### 💡 [Explanation](./explanation/)

**Understanding-oriented documentation** that provides context and background. Explores the "why" behind design decisions.

- [OpenCode Architecture](./explanation/opencode-architecture.md) - Understanding the agent system design and philosophy
- [Diátaxis Framework](./explanation/diataxis-framework.md) - Why and how this documentation is organized
- [Daily-Driver Containers](./explanation/daily-driver-containers.md) - Understanding containerized development environments
- [Security Remediation](./explanation/security-remediation.md) - Understanding the security remediation process

## Quick Navigation

**I want to...**

- **Get started with OpenCode** → [Getting Started with OpenCode](./getting-started/opencode-setup.md)
- **Modify a configuration** → [Modify Any Configuration with OpenCode](./how-to/opencode-modify-config.md)
- **Install an application** → [Install Applications with OpenCode](./how-to/opencode-install-app.md)
- **Manage encrypted keys** → [Manage Encrypted Keys with OpenCode](./how-to/opencode-manage-keys.md)
- **Create a custom script** → [Create Custom Scripts with OpenCode](./how-to/opencode-create-scripts.md)
- **Look up an agent** → [OpenCode Agents Reference](./reference/opencode-agents.md)
- **Understand the agent system** → [OpenCode Architecture](./explanation/opencode-architecture.md)
- **Learn the basics** → [Getting Started Guide](./getting-started/README.md)
- **Check remediation status** → [Security Remediation Status](./getting-started/remediation-status.md)
- **Verify the remediation** → [Verify Security Remediation](./how-to/verify-remediation.md)
- **Look up a keybinding** → [Reference Documentation Hub](./reference/README.md)
- **Find Neovim keybindings** → [Neovim Keybindings](./reference/nvim-keybindings.md)
- **Find Niri keybindings** → [Niri Window Manager Keybindings](./reference/niri-keybindings.md)
- **Find shell aliases** → [Shell Aliases & Functions](./reference/shell-aliases.md)
- **Add a private key** → [Add Encrypted Keys](./how-to/add-encrypted-keys.md)
- **Write a proper commit message** → [Write Git Commits](./how-to/git-commits.md)
- **Understand the documentation structure** → [Diátaxis Framework](./explanation/diataxis-framework.md)
- **Learn about containers** → [Daily-Driver Containers](./explanation/daily-driver-containers.md)
- **Understand the remediation** → [Security Remediation](./explanation/security-remediation.md)

## Using the Agent System

OpenCode is an AI-powered agent system for managing your dotfiles. Start with:

- **[Getting Started with OpenCode](./getting-started/opencode-setup.md)** - 5-minute introduction
- **[OpenCode Agents Reference](./reference/opencode-agents.md)** - Quick reference for all agents
- **[OpenCode Architecture](./explanation/opencode-architecture.md)** - Understanding the design

For detailed configuration and implementation, see the [OpenCode Agent System documentation](../.opencode/README.md).

## Key Concepts

### Diátaxis Framework

This documentation follows the [Diátaxis framework](./explanation/diataxis-framework.md), which organizes documentation around user needs rather than product features. This means:

- **Tutorials** teach you skills through hands-on practice
- **How-to guides** help you solve specific problems
- **Reference** provides factual information to consult while working
- **Explanation** helps you understand the "why" behind things

### Conventional Commits

This repository uses [Conventional Commits](./how-to/git-commits.md) for all git commits. This enables automated changelog generation and semantic versioning.

## Contributing to Documentation

When adding new documentation:

1. Determine which type it is: Tutorial, How-to, Reference, or Explanation
2. Place it in the appropriate folder
3. Follow the style and structure of existing documents
4. Link to related documentation

See [Diátaxis Framework](./explanation/diataxis-framework.md) for detailed guidelines.

## Last Updated

October 30, 2025
