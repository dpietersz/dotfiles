# dotfiles

This repository contains my personal dotfiles, managed with [chezmoi](https://www.chezmoi.io/), and designed for seamless use across local, containerized, and cloud development environments. It is structured to work out-of-the-box with:

- **chezmoi**: For dotfile management and templating
- **DevPod**: For reproducible development environments
- **VS Code Dev Containers**: For local and remote container-based development
- **GitHub Codespaces**: For cloud-based development

---

## Repository Structure

```
├── .chezmoi.toml.tmpl         # chezmoi configuration (templated)
├── .chezmoiexternals/         # chezmoi-managed external resources (tools, fonts, configs)
├── .chezmoiscripts/           # chezmoi hook scripts (e.g., install packages)
├── .devcontainer/             # VS Code Dev Container config (Dockerfile, devcontainer.json)
├── dot_bashrc.tmpl            # Bash configuration
├── dot_gitconfig              # Git configuration
├── dot_psqlrc.tmpl            # PostgreSQL client configuration
├── dot_tmux.conf.tmpl         # tmux configuration
├── dot_zshrc.tmpl             # Zsh configuration
├── dot_dircolors              # Directory colors configuration
├── dot_config/                # XDG config files
│   ├── alacritty/             # Alacritty terminal config
│   ├── bash/                  # Modular bash configs (env, path, tools, functions, aliases)
│   ├── ghostty/               # Ghostty terminal config
│   ├── git/                   # Git ignore patterns
│   ├── k9s/                   # Kubernetes k9s config and skins
│   ├── mise/                  # mise tool manager config
│   ├── nvim/                  # Neovim (LazyVim) config
│   ├── opencode/              # opencode config
│   ├── starship.toml          # Starship prompt config (Gruvbox theme)
│   ├── zellij/                # Zellij multiplexer config
│   └── user-dirs.*            # Custom XDG user directories
├── private_dot_gnupg/         # Private GPG config
├── setup                      # Bootstrap script for new machines
```

---

## Usage

### 1. Bootstrapping (Any Environment)

Clone the repo and run the setup script:

```sh
./setup
```

This will:
- Install chezmoi (if not present)
- Create custom dev directory structure (`~/dev/Projects`, `~/dev/Repos`, etc.)
- Install Homebrew (macOS/Linux, local only)
- Install GUI applications (Ghostty - local only)
- Download external resources (mise, fonts, LazyVim config)
- Apply all dotfiles to your home directory
- Install all tools via mise (neovim, starship, zellij, etc.)
- Install llm CLI tool via uv

### 2. chezmoi

chezmoi manages all dotfiles, templates, and external resources. It detects if you are running in a remote/container/Codespaces environment and adapts accordingly (see `.chezmoi.toml.tmpl`).

**Note**: This repository includes encrypted private keys (GPG, SSH). If cloning for personal use, remove or replace the `private_dot_gnupg/` directory and update `.chezmoi.toml.tmpl` to match your setup.

- **chezmoi apply**: Apply dotfiles to your home directory
- **chezmoi update**: Pull and apply latest changes

### 3. DevPod

DevPod is supported via `.chezmoiexternals/devpod.toml`, which ensures the DevPod binary is installed and available in your environment.

### 4. VS Code Dev Containers

- The `.devcontainer/` folder contains a `devcontainer.json` and a `Dockerfile` based on `mcr.microsoft.com/devcontainers/base:debian-13`.
- Open the repo in VS Code and "Reopen in Container" to get a fully provisioned environment with all tools and dotfiles.

### 5. GitHub Codespaces

- This repo is Codespaces-ready. Just "Open in Codespaces" on GitHub and all dotfiles, tools, and configs will be provisioned automatically.

### 6. Daily-Driver Distrobox Containers (Local Only)

For local systems (Bluefin, Fedora), create isolated development containers with GUI applications:

```sh
create-daily-drivers
```

This creates two containers:
- **daily-driver-arch**: Arch Linux with AUR packages (Obsidian, AnyType, Polypane, Storage Explorer)
- **daily-driver-fedora**: Fedora with DNF/COPR packages (Zed, Zen Browser, Vivaldi, Cursor, Bruno, Beekeeper Studio)

Both containers include all CLI tools via mise. GUI applications are automatically exported to your host for seamless integration with your desktop environment.

Enter a container:
```sh
distrobox enter daily-driver-arch
distrobox enter daily-driver-fedora
```

See [docs/DAILY_DRIVER_CONTAINERS.md](docs/DAILY_DRIVER_CONTAINERS.md) for details.

---

## Highlights

- **Shells**: bash (default, modular config with vi-mode), zsh (with vi-mode)
- **Prompt**: [starship](https://starship.rs/) with Gruvbox theme
- **Editors**: [Neovim](https://neovim.io/) (LazyVim-based), [opencode](https://github.com/jdx/opencode)
- **Terminals**: [Ghostty](https://ghostty.org/)
- **Multiplexers**: tmux, [zellij](https://zellij.dev/) (default shell: bash)
- **Tools**: Managed with [mise](https://mise.jdx.dev/) - bat, btop, eza, fd, fzf, lazygit, lazydocker, ripgrep, yazi, zoxide, and more
- **AI Integration**: [llm](https://llm.datasette.io/) CLI (via uv), [aichat](https://github.com/sigoden/aichat) (via mise), AI-powered git commit messages (`git ai`)
- **Kubernetes**: k9s with custom skin
- **Fonts**: DepartureMono, Monaspace Nerd Fonts (auto-installed)
- **Security**: GPG/SSH integration (local only)
- **GUI Apps**: [Zed](https://zed.dev/), [Zen Browser](https://zen-browser.app/), and more available in daily-driver containers (exported to host)

---

## 🤖 OpenCode AI Agents

This repository is managed by a sophisticated **multi-agent AI system** that automates dotfiles maintenance while ensuring security and consistency. The primary agent coordinates specialized subagents for different tasks:

### Primary Agent
- **@dotfiles-manager** - Orchestrates all dotfiles modifications with security-first workflow

### Specialized Subagents
- **@security-auditor** - Audits all changes for credential leakage and security threats (pre & post-modification)
- **@nvim-config** - Manages Neovim configuration and plugin updates
- **@shell-config** - Handles bash/zsh configuration and shell functions
- **@ui-config** - Manages window manager, terminal, and UI configurations
- **@app-config** - Updates application configurations
- **@app-installer** - Installs and manages applications
- **@mise-manager** - Manages tools via mise
- **@script-creator** - Creates and maintains custom shell scripts
- **@custom-scripts** - Manages scripts in `dot_local/bin/scripts/`
- **@key-encryptor** - Encrypts and manages sensitive keys
- **@key-validator** - Validates encrypted keys
- **@documentation** - Maintains and generates documentation
- **@git-manager** - Handles git operations with conventional commits and pre-commit security audits

### Key Features
- 🔒 **Security-First**: Every change is audited for credential leakage before committing
- 🤖 **Intelligent Automation**: Agents coordinate to handle complex workflows
- 📝 **Conventional Commits**: Automated changelog generation via semantic versioning
- 🔄 **Tool-Aware**: Understands chezmoi, mise, and dotfiles-specific patterns
- 🛡️ **Defense in Depth**: Multiple security layers (pre-modification + pre-commit audits)

For details, see [.opencode/](/.opencode/) directory and [.opencode/SECURITY_AUDIT_WORKFLOW.md](/.opencode/SECURITY_AUDIT_WORKFLOW.md).

---

## Customization

- All dotfiles are templated for local/remote/container/cloud detection
- Add or modify tools in `.config/mise/config.toml`
- Add external resources in `.chezmoiexternals/`
- Add post-install scripts in `.chezmoiscripts/`

---

## TODO / Future Improvements

- TODO: Add wallpaper application
- TODO: Add Monitor settings application (NW something)
- TODO: Add OSD (On-Screen Display) application
- TODO: Add better lockscreen application
- TODO: Add power button module in waybar
- TODO: Add and configure Tmux including gruvbox styling
- TODO: Add Rofi including Gruvbox styling
- TODO: Add better screenshot tool
- TODO: Add better Login manager
- TODO: Check if niri script installation has all the needed applications
- TODO: Make bash the default shell
- TODO: Convert bash functions to scripts
- TODO: Add animated groups in waybar for hardware monitor, wifi (name), volume (percentage), backlight (percentage), Battery (percentage and estimation)
- TODO: Add active workspace styling for better visibility
- TODO: Add (optionally visible) LAN module that works similar to wifi version
- TODO: Add public ip to wifi and LAN modules in hover mode
- TODO: Add wifi dropdown for managing wifi connections (just like old hyprland setup)

---

## License

These dotfiles are provided as-is for personal use and inspiration. Use at your own risk.
