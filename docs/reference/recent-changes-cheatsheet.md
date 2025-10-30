# Recent Changes Cheatsheet

> **Purpose**: Quick reference for recently added features and keybindings that take time to remember. This document tracks new additions across the dotfiles that you'll want to keep handy while they're still fresh.

---

## 📋 Quick Navigation

- [Neovim](#neovim) - Editor keybindings and features
- [Niri](#niri) - Window manager keybindings
- [Shell](#shell) - Shell aliases and functions
- [Waybar](#waybar) - Status bar features
- [System](#system) - System-wide tools and scripts

---

## Neovim

### Recently Added Keybindings

#### File Explorer (mini.files)

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<C-b>` | Toggle mini file explorer | Normal | File Navigation |
| `<leader>ef` | Open file explorer at current file location | Normal | File Navigation |

**Context**: The `mini.files` plugin provides a lightweight, keyboard-driven file explorer. These keybindings were added to provide quick access to file navigation without leaving the editor.

**Usage Tips**:
- `<C-b>` toggles the explorer on/off from anywhere
- `<leader>ef` opens the explorer and reveals the current file's directory
- Inside the explorer, use `H`/`L` to navigate, `h`/`l` for quick navigation, `q` to close

**Related Keybindings** (inside mini.files):
- `L` - Go into directory
- `l` - Go into directory (quick)
- `H` - Go out of directory
- `h` - Go out of directory (quick)
- `@` - Reveal current working directory
- `g?` - Show help

---

#### Snacks Picker - File Filtering

| Keybinding | Action | Mode | Context |
|------------|--------|------|---------|
| `<A-h>` | Toggle hidden files on/off | Normal | When file picker is open (triggered by `<leader>ff`) |
| `<A-i>` | Toggle ignored files (from .gitignore) on/off | Normal | When file picker is open (triggered by `<leader>ff`) |

**Context**: The Snacks picker provides powerful file filtering options while browsing. These keybindings allow you to quickly toggle the visibility of hidden files and gitignored files without closing the picker.

**Usage Tips**:
- Press `<leader>ff` to open the file picker
- While the picker is open, use `<A-h>` to show/hide hidden files (dotfiles, etc.)
- Use `<A-i>` to show/hide files that are in your `.gitignore`
- These toggles persist during the current picker session
- Useful for finding configuration files (hidden) or build artifacts (ignored)

**Related Keybindings**:
- `<leader>ff` - Open file picker
- `<leader>fg` - Find with grep
- `<leader>fb` - Find buffers

---

## Niri

### Recently Added Keybindings

*No recent changes documented yet. Check back after updates!*

---

## Shell

### Recently Added Aliases & Functions

*No recent changes documented yet. Check back after updates!*

---

## Waybar

### Recently Added Features

*No recent changes documented yet. Check back after updates!*

---

## System

### Recently Added Scripts & Tools

*No recent changes documented yet. Check back after updates!*

---

## 📝 How to Add New Entries

When you add a new feature, keybinding, or alias, follow this template:

### For Keybindings

```markdown
#### Feature Name

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<key>` | Description | Normal/Insert/Visual | Category |

**Context**: Brief explanation of why this was added and what problem it solves.

**Usage Tips**:
- Tip 1
- Tip 2

**Related Keybindings**:
- `<key>` - Description
```

### For Aliases & Functions

```markdown
#### Alias/Function Name

| Alias | Command | Description |
|-------|---------|-------------|
| `alias_name` | `actual command` | What it does |

**Context**: Brief explanation of why this was added.

**Usage Examples**:
```bash
# Example 1
$ alias_name arg1

# Example 2
$ alias_name arg2
```

**Related Aliases**:
- `related_alias` - Description
```

### For Features

```markdown
#### Feature Name

**What's New**: Brief description of the feature

**How to Use**:
1. Step 1
2. Step 2

**Configuration**: Where to find the configuration file

**Environment**: Host / Remote / Both
```

---

## 🔍 Finding Source Files

When documenting new changes, reference the source files:

### Neovim
- **Keybindings**: `~/.config/nvim/lua/config/keymaps.lua`
- **Plugins**: `~/.config/nvim/lua/plugins/`
- **Plugin-specific keybindings**: Check individual plugin files (e.g., `mini-files.lua`)

### Niri
- **Keybindings**: `~/.config/niri/config.kdl`
- **Scripts**: `~/.config/niri/scripts/`

### Shell
- **Aliases**: `~/.config/shell/40-aliases.sh`
- **Functions**: `~/.config/shell/30-functions.sh`
- **Environment**: `~/.config/shell/00-env.sh`

### Waybar
- **Configuration**: `~/.config/waybar/config.jsonc`
- **Styles**: `~/.config/waybar/style.css`
- **Custom modules**: `~/.config/waybar/custom_modules/`

### System Scripts
- **Local scripts**: `~/.local/bin/scripts/`
- **Systemd services**: `~/.config/systemd/user/`

---

## 🔗 Related Documentation

- [Neovim Keybindings Reference](./nvim-keybindings.md) - Complete Neovim keybindings
- [Niri Keybindings Reference](./niri-keybindings.md) - Complete Niri keybindings
- [Shell Aliases Reference](./shell-aliases.md) - Complete shell aliases
- [All Keybindings Reference](./keybindings.md) - Comprehensive keybindings guide

---

## 📅 Changelog

| Date | Application | Change | Status |
|------|-------------|--------|--------|
| 2025-10-30 | Neovim | Added Snacks picker file filtering keybindings (`<A-h>`, `<A-i>`) | ✅ Documented |
| 2025-10-30 | Neovim | Added mini.files keybindings (`<C-b>`, `<leader>ef`) | ✅ Documented |

---

## 💡 Tips for Maintaining This Document

1. **Update Regularly**: Add new entries as soon as you add features
2. **Keep It Scannable**: Use tables and clear formatting
3. **Link to Source**: Always reference the configuration file
4. **Add Context**: Explain why the change was made
5. **Include Examples**: Show practical usage
6. **Cross-Reference**: Link to full reference guides
7. **Mark Status**: Use checkmarks or status indicators

---

**Last Updated**: October 30, 2025  
**Diátaxis Category**: Reference (Information-Oriented)  
**Environment**: All (Host & Remote, with environment-specific notes)  
**Maintainer**: dotfiles repository
