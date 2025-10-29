# Shell Aliases & Functions Reference

Quick reference for all shell aliases and functions available in bash and zsh. These are defined in `~/.config/shell/` and are shared across all shell environments.

---

## Quick Reference

```bash
# Navigation
..                → cd ..
cd <name>         → Smart jump with zoxide
la                → List all with details
ll                → List with details

# Git
gs                → git status
gp                → git pull

# Password Store
p                 → pass (show password menu)
psc               → Show and copy password

# Tools
lg                → lazygit (Git UI)
ld                → lazydocker (Docker UI)
k                 → kubectl

# Functions
clone <url>       → Smart git clone
extract <file>    → Extract any archive
ai <prompt>       → Query OpenAI
```

---

## Directory Navigation Aliases

### Basic Navigation

| Alias | Command | Description |
|-------|---------|-------------|
| `..` | `cd ..` | Go up one level |
| `...` | `cd ../..` | Go up two levels |
| `....` | `cd ../../..` | Go up three levels |
| `.....` | `cd ../../../..` | Go up four levels |
| `~` | `cd ~` | Go to home directory |
| `cl` | `clear` | Clear terminal screen |

### Smart Directory Navigation

| Alias | Command | Description |
|-------|---------|-------------|
| `cd` | `z` | Smart directory jump (zoxide) |

**How it works**: 
- `z <partial-name>` jumps to frequently-used directories
- `z -` goes to previous directory
- `z -i` interactive selection

---

## File Listing Aliases

All file listing aliases use `eza` (modern `ls` replacement) with colors and icons.

### Quick Lists

| Alias | Command | Description |
|-------|---------|-------------|
| `ls` | `ls --color=auto` | Basic colored list |
| `la` | `eza -laghm --all --icons --git --color=always --group-directories-first` | All files with git status |
| `ll` | `eza -l --color=always --group-directories-first --icons` | Long format with icons |
| `lt` | `eza -aT --color=always --group-directories-first --icons -I '.git\|.vscode\|node_modules'` | Tree view |
| `l` | `eza -lah --color=always --group-directories-first --icons` | All files with icons |
| `last` | `find . -type f -not -path "*/\.*" -exec ls -lrt {} +` | Files by modification time |

**Flags explained**:
- `-l` = long format
- `-a` = all files (including hidden)
- `-h` = human-readable sizes
- `-g` = show git status
- `-m` = show git metadata
- `-T` = tree format
- `--icons` = show file type icons
- `--group-directories-first` = directories first

---

## Git Aliases

### Basic Git Operations

| Alias | Command | Description |
|-------|---------|-------------|
| `gs` | `git status` | Show git status |
| `gp` | `git pull` | Pull latest changes |

**Note**: More git aliases are available through lazygit (`lg`)

---

## Configuration Editing Aliases

### Neovim Configuration

| Alias | Command | Description |
|-------|---------|-------------|
| `nvimconf` | `cd $DOTFILES/dot_config/nvim && nvim init.lua` | Edit neovim config |

### Espanso Configuration

| Alias | Command | Description |
|-------|---------|-------------|
| `espansoconf` | `v $DOTFILES/dot_config/espanso/match/base.yml` | Edit espanso config |

### Shell Configuration (Shell-Specific)

**Bash only:**

| Alias | Command | Description |
|-------|---------|-------------|
| `bashconf` | `v ~/.bashrc` | Edit bash config |
| `sbr` | `source ~/.bashrc` | Reload bash config |

**Zsh only:**

| Alias | Command | Description |
|-------|---------|-------------|
| `zshconf` | `v ~/.zshrc` | Edit zsh config |
| `szr` | `source ~/.zshrc` | Reload zsh config |

---

## Password Store (pass) Aliases

Complete set of aliases for password management using `pass`.

### Basic Operations

| Alias | Command | Description |
|-------|---------|-------------|
| `p` | `pass` | Show password menu |
| `psh` | `pass show` | Show password |
| `psc` | `pass show -c` | Show and copy to clipboard |

### Password Management

| Alias | Command | Description |
|-------|---------|-------------|
| `pi` | `pass insert` | Insert new password |
| `pedit` | `pass edit` | Edit password entry |
| `pmv` | `pass mv` | Move password entry |
| `pcp` | `pass cp` | Copy password entry |
| `psearch` | `pass search` | Search passwords |

### Git Operations

| Alias | Command | Description |
|-------|---------|-------------|
| `pp` | `pass git push` | Push password store to git |

### Quick Access

| Alias | Command | Description |
|-------|---------|-------------|
| `ppp` | `pass show -c Sites/canva.com` | Show Canva password |

**Tip**: Add more quick-access aliases for frequently-used passwords

---

## Tool Shortcuts

Conditional aliases for installed tools.

### Container & Orchestration

| Alias | Command | Description |
|-------|---------|-------------|
| `ld` | `lazydocker` | Docker UI (if installed) |
| `k` | `kubectl` | Kubernetes CLI (if installed) |

### Git UI

| Alias | Command | Description |
|-------|---------|-------------|
| `lg` | `lazygit` | Git UI (if installed) |

### Text Processing

| Alias | Command | Description |
|-------|---------|-------------|
| `cat` | `bat` or `batcat` | Syntax-highlighted cat (if installed) |

**How it works**: These aliases are only created if the tool is installed, preventing errors

---

## Shell Functions

Functions provide more complex functionality than simple aliases.

### Archive Extraction

#### `extract` Function

**Usage**: `extract <filename>`

**Supported formats**:
- `.gz` - Gzip archives
- `.bz2` - Bzip2 archives
- `.zip` - ZIP archives

**Example**:
```bash
extract archive.tar.gz
# Creates: archive/ directory with contents
```

**How it works**:
1. Detects file extension
2. Creates output directory with same name (without extension)
3. Extracts to that directory
4. Shows progress messages

#### `compress_current_folder` Function

**Usage**: `compress_current_folder`

**Example**:
```bash
cd my_project
compress_current_folder
# Creates: ../my_project.zip
```

**How it works**:
1. Gets current folder name
2. Creates zip file in parent directory
3. Compresses entire folder

---

### Git Clone Helper

#### `clone` Function

**Usage**: `clone <git-url>`

**Supports**:
- SSH URLs: `git@github.com:user/repo.git`
- HTTPS URLs: `https://github.com/user/repo`
- GitHub, GitLab, and custom hosts

**Smart Features**:
- Auto-detects SSH vs HTTPS
- Organizes by host and namespace
- Special handling for personal repos
- Auto-navigates to cloned directory

**Examples**:
```bash
# GitHub personal repo
clone https://github.com/pietersz/dotfiles
# → ~/projects/dotfiles

# GitLab group repo
clone git@gitlab.com:homelab-pietersz/project.git
# → ~/projects/project

# Other host
clone https://git.example.com/team/repo
# → ~/repos/git.example.com/team/repo
```

**Configured Groups** (auto-organized to `~/projects/`):
- `homelab-pietersz`
- `surpassion.io`
- `pietersz-personal-tools`
- `roos81`
- `my-coursematerial`

---

### Image Processing

#### `webjpeg` Function

**Usage**: `webjpeg <input> <size> <output>`

**Purpose**: Optimize JPEG for web with compression

**Example**:
```bash
webjpeg photo.jpg 1920x1080 photo-web.jpg
```

**Optimization settings**:
- Sampling factor: 4:2:0
- Quality: 85%
- Interlace: JPEG
- Colorspace: sRGB

#### `cropjpeg` Function

**Usage**: `cropjpeg <input> <size> <output>`

**Purpose**: Crop JPEG from center

**Example**:
```bash
cropjpeg photo.jpg 800x600 photo-cropped.jpg
```

---

### Markdown & Pandoc

#### `html_to_md` Function

**Usage**: `html_to_md <filename.html>`

**Purpose**: Convert HTML to Markdown

**Example**:
```bash
html_to_md webpage.html
# Creates: webpage.md
```

**How it works**:
1. Takes HTML file as input
2. Uses Pandoc to convert
3. Preserves resource paths
4. Outputs to same directory

---

## Environment Variables

These variables are used by aliases and functions:

| Variable | Purpose | Example |
|----------|---------|---------|
| `$DOTFILES` | Path to dotfiles directory | `~/.config/dotfiles` |
| `$PROJECTS` | Path to personal projects | `~/projects` |
| `$REPOS` | Path to cloned repositories | `~/repos` |
| `$SECOND_BRAIN` | Path to note vault | `~/vault` |

---

## Tips & Tricks

### Navigation

1. **Smart Directory Jumping**: Use `cd <partial-name>` to jump to frequently-used directories
2. **Go Back**: Use `cd -` to return to previous directory
3. **Parent Directory**: Use `..` multiple times: `.. && .. && ..`

### File Listing

1. **Tree View**: Use `lt` to see directory structure
2. **Git Status**: Use `la` to see git status in file listing
3. **Sort by Time**: Use `last` to see recently modified files

### Git Cloning

1. **Auto-Organization**: `clone` automatically organizes repos by host/namespace
2. **Quick Navigation**: Automatically `cd`s into cloned directory
3. **Submodules**: Automatically clones with `--recurse-submodules`

### Password Management

1. **Quick Copy**: Use `psc` to show and copy password in one command
2. **Search**: Use `psearch` to find password entries
3. **Git Sync**: Use `pp` to push password changes to git

### Archive Handling

1. **Auto-Detection**: `extract` automatically detects format
2. **Organized Output**: Creates subdirectory for extracted files
3. **Error Handling**: Shows helpful error messages for unsupported formats

---

## Shell-Specific Notes

### Bash
- All aliases and functions work in bash
- Shell-specific aliases: `bashconf`, `sbr`
- Detected via `$BASH_VERSION`

### Zsh
- All aliases and functions work in zsh
- Shell-specific aliases: `zshconf`, `szr`
- Detected via `$ZSH_VERSION`

### Conditional Aliases
- Tool aliases only created if tool is installed
- Prevents errors if tool is missing
- Uses `command -v` for detection

---

## Configuration Files

### Source Files

| File | Purpose |
|------|---------|
| `~/.config/shell/40-aliases.sh` | All aliases |
| `~/.config/shell/30-functions.sh` | All functions |
| `~/.config/shell/00-env.sh` | Environment variables |
| `~/.config/shell/10-path.sh` | PATH configuration |

### Loading Order

1. `00-env.sh` - Environment variables
2. `10-path.sh` - PATH setup
3. `20-tools.sh` - Tool initialization
4. `30-functions.sh` - Functions
5. `40-aliases.sh` - Aliases

---

## Troubleshooting

### Alias Not Found

1. Check if shell is bash or zsh: `echo $SHELL`
2. Verify alias is defined: `alias <name>`
3. Reload shell config: `source ~/.bashrc` or `source ~/.zshrc`
4. Check if tool is installed: `command -v <tool>`

### Function Not Working

1. Verify function is loaded: `declare -f <function>`
2. Check for syntax errors: `bash -n ~/.config/shell/30-functions.sh`
3. Reload shell config
4. Check dependencies (e.g., `pandoc` for `html_to_md`)

### Clone Function Issues

1. Verify git is installed: `command -v git`
2. Check SSH keys are configured: `ssh -T git@github.com`
3. Verify directory permissions: `ls -la ~/projects`

---

## Environment Notes

### Host Machines
- All aliases and functions work on local Fedora, Bluefin-dx, and macOS
- Full tool support (lazygit, lazydocker, kubectl, etc.)

### Remote Environments
- All aliases and functions work in Docker, Distrobox, DevContainers, and VMs
- Some tools may not be installed (conditional aliases handle this)
- Password store works if configured

---

## Related Documentation

- [Shell Configuration](../../dot_config/shell/)
- [Dotfiles README](../../README.md)
- [Keybindings Reference](./keybindings.md)

---

**Last Updated**: October 29, 2025  
**Source**: `~/.config/shell/40-aliases.sh` and `~/.config/shell/30-functions.sh`
