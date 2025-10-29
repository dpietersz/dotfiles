# Reference Documentation

Welcome to the Reference section of the dotfiles documentation. This folder contains **information-oriented documentation** for looking up facts, specifications, and quick reference guides.

Reference documentation is neutral, factual, and designed for consultation while working. It answers the question: **"What is the syntax for...?"** or **"What are all the options for...?"**

---

## Quick Navigation

### By Application

- **[Neovim Keybindings](./nvim-keybindings.md)** - Complete reference for Neovim keybindings
- **[Niri Window Manager Keybindings](./niri-keybindings.md)** - Complete reference for Niri WM keybindings
- **[Shell Aliases & Functions](./shell-aliases.md)** - Complete reference for shell aliases and functions
- **[All Keybindings](./keybindings.md)** - Comprehensive reference combining all keybindings

### By Category

**Navigation & Movement**
- [Neovim Navigation](./nvim-keybindings.md#core-navigation--movement)
- [Niri Focus Navigation](./niri-keybindings.md#focus-navigation)
- [Shell Directory Navigation](./shell-aliases.md#directory-navigation-aliases)

**Window & Pane Management**
- [Neovim Window Management](./nvim-keybindings.md#window-management--splitting)
- [Niri Window Management](./niri-keybindings.md#window-management)
- [Niri Workspace Management](./niri-keybindings.md#workspace-management)

**File & Buffer Management**
- [Neovim Buffer Management](./nvim-keybindings.md#buffer-management)
- [Neovim Harpoon](./nvim-keybindings.md#harpoon---quick-file-navigation)
- [Shell File Listing](./shell-aliases.md#file-listing-aliases)

**Editing & Text Manipulation**
- [Neovim Line Manipulation](./nvim-keybindings.md#line-manipulation)
- [Neovim Yanking & Clipboard](./nvim-keybindings.md#yanking--clipboard)
- [Neovim Search & Replace](./nvim-keybindings.md#search--replace)

**System & Tools**
- [Niri Application Launching](./niri-keybindings.md#application-launching)
- [Niri Media Controls](./niri-keybindings.md#media--volume-controls)
- [Shell Tool Shortcuts](./shell-aliases.md#tool-shortcuts)

---

## Reference Files

### 1. Neovim Keybindings Reference
**File**: `nvim-keybindings.md`

Complete reference for Neovim keybindings in this dotfiles configuration. Uses LazyVim with custom keybindings and plugins.

**Contains**:
- Core navigation & movement (Tmux-aware pane navigation)
- Buffer management
- Window management & splitting
- Line manipulation
- Yanking & clipboard operations
- Search & replace
- Insert mode helpers
- Harpoon file navigation
- LazyVim default keybindings
- Plugin-specific keybindings (Telescope, Trouble, Git)
- Mode and modifier reference
- Tips & tricks
- Common workflows
- Troubleshooting

**Key Features**:
- Seamless Tmux integration with `<C-hjkl>`
- Harpoon for quick file bookmarking
- Smart search & replace with `<leader>sr`
- System clipboard integration with `<leader>y`

---

### 2. Niri Window Manager Keybindings Reference
**File**: `niri-keybindings.md`

Complete reference for Niri window manager keybindings. Niri is a scrollable-tiling Wayland compositor with a focus on simplicity and productivity.

**Contains**:
- Application launching
- Window management (basic operations, column management)
- Focus navigation (columns, windows, monitors, workspaces)
- Window movement
- Workspace management
- Mouse wheel navigation
- Sizing & layout (preset and manual)
- Media & volume controls
- Screenshots
- System & misc keybindings
- Workspace configuration
- Navigation patterns
- Tips & tricks
- Troubleshooting

**Key Features**:
- Workspace navigation with `Mod+J/K`
- Window management with `Mod+W`, `Mod+Q`
- Monitor navigation with `Mod+Ctrl+H/L`
- Media controls (volume, screenshots)
- Hotkey overlay with `Mod+Shift+/`

**Environment Note**: Niri is only available on host machines with Wayland support (Fedora, Bluefin-dx). Not available in remote environments.

---

### 3. Shell Aliases & Functions Reference
**File**: `shell-aliases.md`

Quick reference for all shell aliases and functions available in bash and zsh. These are defined in `~/.config/shell/` and are shared across all shell environments.

**Contains**:
- Directory navigation aliases
- File listing aliases (using `eza`)
- Git aliases
- Configuration editing aliases
- Password store (pass) aliases
- Tool shortcuts (lazygit, lazydocker, kubectl, etc.)
- Archive extraction functions
- Git clone helper function
- Image processing functions
- Markdown & Pandoc functions
- Environment variables
- Tips & tricks
- Shell-specific notes
- Configuration files
- Troubleshooting

**Key Features**:
- Smart directory navigation with `cd` (zoxide)
- File listing with icons and git status
- Password management with `pass`
- Smart git clone with auto-organization
- Archive extraction with auto-format detection

**Environment Note**: All aliases and functions work in both host and remote environments (Docker, Distrobox, DevContainers, VMs).

---

### 4. Comprehensive Keybindings Reference
**File**: `keybindings.md`

Comprehensive reference combining all keybindings across the dotfiles configuration. Organized by application and context for easy lookup.

**Contains**:
- All Neovim keybindings (organized by category)
- All Niri window manager keybindings
- All shell aliases and functions
- Custom script shortcuts
- Key modifiers reference
- Tips & tricks for each application
- Environment notes

**Best for**: Complete reference when you want everything in one place.

---

## How to Use This Documentation

### For Quick Lookup
1. Choose the application-specific reference (Neovim, Niri, or Shell)
2. Use the table of contents to find your category
3. Look up the keybinding or alias you need

### For Learning
1. Start with the application-specific reference
2. Read the "Tips & Tricks" section
3. Check the "Common Workflows" section for practical examples

### For Troubleshooting
1. Check the application-specific reference
2. Look for the "Troubleshooting" section
3. Verify your environment (host vs remote)

### For Complete Reference
Use `keybindings.md` to see all keybindings in one comprehensive document.

---

## Environment Distinction

### Host Machines
Applies to: Fedora, Bluefin-dx, macOS

- All keybindings work on local installations
- Niri window manager available (Wayland-based)
- Full tool support (lazygit, lazydocker, kubectl, etc.)
- All plugins and features available

### Remote Environments
Applies to: Docker, Distrobox, DevContainers, VMs

- Neovim keybindings work in all remote environments
- Shell aliases and functions work in all remote environments
- Niri window manager NOT available
- Some tools may not be installed (conditional aliases handle this)

---

## Key Concepts

### Keybinding Notation

| Notation | Meaning | Example |
|----------|---------|---------|
| `<C-` | Control key | `<C-h>` = Ctrl+H |
| `<S-` | Shift key | `<S-l>` = Shift+L |
| `<A-` | Alt key | `<A-j>` = Alt+J |
| `<leader>` | Leader key (Space in Neovim) | `<leader>ha` = Space+H+A |
| `Mod` | Super/Windows key (Niri) | `Mod+Return` = Super+Return |

### Mode Reference

| Mode | Symbol | Description |
|------|--------|-------------|
| Normal | `n` | Default mode for navigation and commands |
| Insert | `i` | Text insertion mode |
| Visual | `v` | Selection mode |
| Visual Line | `V` | Line selection mode |
| Visual Block | `<C-v>` | Block selection mode |

---

## Tips & Tricks

### Neovim
- **Seamless Pane Navigation**: `<C-hjkl>` works in both Neovim and Tmux!
- **Harpoon Workflow**: Mark files with `<leader>ha`, jump with `<leader>hs/d/f/g`
- **Smart Replace**: `<leader>sr` to replace word under cursor with confirmation
- **Clipboard Integration**: `<leader>y` to copy to system clipboard without affecting registers

### Niri
- **Workspace Wheel**: Use mouse wheel + `Mod` to switch workspaces
- **Monitor Jumping**: `Mod+Ctrl+H/L` to move focus between monitors
- **Hotkey Help**: Press `Mod+Shift+/` to see all keybindings in overlay
- **Preset Sizing**: Use `Mod+R` to cycle through preset column widths

### Shell
- **Smart Clone**: The `clone` function automatically organizes repositories by host and namespace
- **Directory Jumping**: Use `cd` (aliased to `z`) for smart directory jumping with zoxide
- **Archive Magic**: Use `extract` for automatic format detection
- **Password Quick Copy**: Use `psc` to show and copy password in one command

---

## Related Documentation

- [Getting Started Guide](../getting-started/README.md) - Learning-oriented tutorials
- [How-To Guides](../how-to/) - Goal-oriented guides for solving specific problems
- [Explanation](../explanation/) - Understanding-oriented documentation
- [Main Documentation Index](../README.md) - Overview of all documentation

---

## Contributing

Found an error or want to add a keybinding? 

1. Check the source files:
   - Neovim: `~/.config/nvim/lua/config/keymaps.lua`
   - Niri: `~/.config/niri/config.kdl`
   - Shell: `~/.config/shell/40-aliases.sh` and `~/.config/shell/30-functions.sh`

2. Update the appropriate reference file to match

3. Commit with a clear message about what changed

---

**Last Updated**: October 29, 2025  
**Diátaxis Category**: Reference (Information-Oriented)  
**Environment**: All (Host & Remote, with environment-specific notes)
