# Neovim Keybindings Reference

Complete reference for Neovim keybindings in this dotfiles configuration. Uses LazyVim with custom keybindings and plugins.

**Note**: `<leader>` = Space key

---

## Quick Navigation Cheat Sheet

```
Ctrl+H/J/K/L  → Navigate left/down/up/right (Tmux-aware!)
Ctrl+\        → Jump to previous pane
Shift+H/L     → Previous/next buffer
<leader>ha    → Add file to harpoon
<leader>hs/d/f/g → Jump to harpoon file 1/2/3/4
```

---

## Core Navigation & Movement

### Pane Navigation (Tmux-Aware)

| Keybinding | Action | Mode | Notes |
|------------|--------|------|-------|
| `<C-h>` | Navigate left | Normal | Works in Tmux too! |
| `<C-j>` | Navigate down | Normal | Works in Tmux too! |
| `<C-k>` | Navigate up | Normal | Works in Tmux too! |
| `<C-l>` | Navigate right | Normal | Works in Tmux too! |
| `<C-\>` | Navigate to previous pane | Normal | Tmux/Nvim toggle |

**Why this is awesome**: Use the same keybindings to navigate between Neovim splits and Tmux panes seamlessly!

### Line Navigation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<S-h>` | Go to line start | Normal/Operator/Visual | Movement |
| `<S-l>` | Go to line end | Normal/Operator/Visual | Movement |
| `0` | Go to line start (default) | Normal | Movement |
| `$` | Go to line end (default) | Normal | Movement |

### Search Navigation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `n` | Next search result (centred) | Normal | Search |
| `N` | Previous search result (centred) | Normal | Search |
| `*` | Search word under cursor (default) | Normal | Search |
| `#` | Search word backward (default) | Normal | Search |

### Page Navigation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<C-d>` | Half page down (centred) | Normal | Scrolling |
| `<C-u>` | Half page up (centred) | Normal | Scrolling |
| `<C-f>` | Full page down (default) | Normal | Scrolling |
| `<C-b>` | Full page up (default) | Normal | Scrolling |

---

## Buffer Management

### Buffer Navigation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<S-l>` | Next buffer | Normal | Buffer Navigation |
| `<S-h>` | Previous buffer | Normal | Buffer Navigation |
| `bl` | Next buffer | Normal | Buffer Navigation |
| `bh` | Previous buffer | Normal | Buffer Navigation |

### Buffer Operations

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `bdd` | Delete buffer | Normal | Buffer Management |
| `bf` | Format buffer | Normal | Buffer Management |
| `bo` | Only current buffer (close others) | Normal | Buffer Management |

---

## Window Management & Splitting

### Window Splitting

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>sv` | Split window vertically | Normal | Window Management |
| `<leader>sh` | Split window horizontally | Normal | Window Management |

### Window Resizing

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<C-Up>` | Increase window height | Normal | Window Resizing |
| `<C-Down>` | Decrease window height | Normal | Window Resizing |
| `<C-Left>` | Decrease window width | Normal | Window Resizing |
| `<C-Right>` | Increase window width | Normal | Window Resizing |

**Tip**: Combine with multiple presses for larger adjustments

---

## Line Manipulation

### Moving Lines

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<A-j>` | Move line down | Normal | Line Movement |
| `<A-k>` | Move line up | Normal | Line Movement |
| `<A-j>` | Move selection down | Visual | Line Movement |
| `<A-k>` | Move selection up | Visual | Line Movement |
| `<A-j>` | Move line down | Insert | Line Movement |
| `<A-k>` | Move line up | Insert | Line Movement |

### Indentation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<` | Indent left and reselect | Visual | Indentation |
| `>` | Indent right and reselect | Visual | Indentation |
| `=` | Auto-indent (default) | Visual | Indentation |

---

## Yanking & Clipboard

### Yanking (Copying)

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `Y` | Yank to end of line | Normal | Yanking |
| `y` | Yank selection | Visual | Yanking |
| `yy` | Yank entire line (default) | Normal | Yanking |

### System Clipboard

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>y` | Copy to system clipboard | Normal/Visual | Clipboard |
| `<leader>Y` | Copy line to system clipboard | Normal | Clipboard |
| `<leader>r` | Replace selected with clipboard | Visual | Clipboard |

### Deletion

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>D` | Delete to black hole register | Visual | Deletion |
| `p` | Paste without copying selection | Visual | Pasting |

**Why this matters**: Paste without overwriting your clipboard register!

---

## Search & Replace

### Search & Replace

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>sr` | Search & replace word under cursor | Normal | Search & Replace |
| `:%s/old/new/g` | Replace all (default) | Normal | Search & Replace |

**How it works**: `<leader>sr` opens search & replace with the word under cursor pre-filled

### Clearing Highlights

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<Esc>` | Clear search highlights | Normal | Search |

---

## Insert Mode Helpers

### Mode Switching

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `jj` | Exit insert mode | Insert | Mode Switching |
| `<Esc>` | Exit insert mode (default) | Insert | Mode Switching |

### Insert Helpers

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `;;` | Insert trailing semicolon | Insert | Insert Helpers |
| `,,` | Insert trailing comma | Insert | Insert Helpers |

**How it works**: Automatically moves to end of line and adds the character

---

## Configuration & Misc

### Configuration Editing

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>rc` | Edit neovim config | Normal | Configuration |

### Misc

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `q:` | Disable command-line type | Normal | Misc |

---

## Harpoon - Quick File Navigation

Harpoon allows you to mark and quickly jump to frequently-used files.

### File Management

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>ha` | Add current file to harpoon | Normal | Harpoon |
| `<leader>hh` | Toggle harpoon menu | Normal | Harpoon |

### Quick Selects

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>hs` | Jump to harpoon file 1 | Normal | Harpoon |
| `<leader>hd` | Jump to harpoon file 2 | Normal | Harpoon |
| `<leader>hf` | Jump to harpoon file 3 | Normal | Harpoon |
| `<leader>hg` | Jump to harpoon file 4 | Normal | Harpoon |

### Navigation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>hp` | Previous harpoon file | Normal | Harpoon |
| `<leader>hn` | Next harpoon file | Normal | Harpoon |

### Search Integration

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>fh` | Search harpoon files (Snacks picker) | Normal | Harpoon |

**Workflow**: 
1. Mark important files with `<leader>ha`
2. Jump between them with `<leader>hs/d/f/g`
3. Or search all marked files with `<leader>fh`

---

## LazyVim Default Keybindings

These are inherited from LazyVim and are commonly used:

### File Navigation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>ff` | Find files | Normal | File Navigation |
| `<leader>fg` | Find grep | Normal | File Navigation |
| `<leader>fb` | Find buffers | Normal | File Navigation |
| `<leader>fh` | Find help | Normal | File Navigation |

### Snacks Picker - File Filtering

| Keybinding | Action | Mode | Category | Context |
|------------|--------|------|----------|---------|
| `<A-h>` | Toggle hidden files on/off | Normal | File Navigation | When picker is open |
| `<A-i>` | Toggle ignored files (from .gitignore) on/off | Normal | File Navigation | When picker is open |

**How it works**: When the file picker is open (e.g., after pressing `<leader>ff`), use these keybindings to dynamically filter the displayed files. Hidden files include dotfiles and directories starting with `.`. Ignored files are those listed in your `.gitignore`.

### LSP (Language Server Protocol)

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `gd` | Go to definition | Normal | LSP |
| `gr` | Go to references | Normal | LSP |
| `gi` | Go to implementation | Normal | LSP |
| `<leader>ca` | Code action | Normal | LSP |
| `<leader>cr` | Rename | Normal | LSP |

### Diagnostics

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>cd` | Show diagnostics | Normal | Diagnostics |
| `[d` | Previous diagnostic | Normal | Diagnostics |
| `]d` | Next diagnostic | Normal | Diagnostics |

---

## Plugin-Specific Keybindings

### Telescope (Fuzzy Finder)

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>ff` | Find files | Normal | Telescope |
| `<leader>fg` | Find grep | Normal | Telescope |
| `<leader>fb` | Find buffers | Normal | Telescope |
| `<leader>fh` | Find help | Normal | Telescope |

### Trouble (Diagnostics)

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>xx` | Toggle trouble | Normal | Trouble |
| `<leader>xw` | Workspace diagnostics | Normal | Trouble |
| `<leader>xd` | Document diagnostics | Normal | Trouble |

### Git Integration

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>gg` | Lazygit | Normal | Git |
| `<leader>gb` | Git blame | Normal | Git |
| `<leader>gd` | Git diff | Normal | Git |

---

## Mode Reference

| Mode | Symbol | Description |
|------|--------|-------------|
| Normal | `n` | Default mode for navigation and commands |
| Insert | `i` | Text insertion mode |
| Visual | `v` | Selection mode |
| Visual Line | `V` | Line selection mode |
| Visual Block | `<C-v>` | Block selection mode |
| Command | `:` | Command mode |
| Operator | `o` | Operator-pending mode |

---

## Key Modifiers Reference

| Modifier | Symbol | Key |
|----------|--------|-----|
| Control | `<C-` | Ctrl key |
| Shift | `<S-` | Shift key |
| Alt | `<A-` | Alt key |
| Leader | `<leader>` | Space key |

---

## Tips & Tricks

### Navigation

1. **Seamless Tmux Integration**: Use `<C-hjkl>` to navigate between Neovim splits and Tmux panes without thinking
2. **Center Screen**: Search results and page navigation automatically center the screen
3. **Vim Keys**: Use `hjkl` for movement in normal mode (left/down/up/right)

### Editing

1. **Move Lines**: Use `<A-jk>` to move lines up/down in any mode
2. **Smart Paste**: Use `p` in visual mode to paste without overwriting clipboard
3. **Quick Replace**: Use `<leader>sr` to replace the word under cursor

### File Management

1. **Harpoon Workflow**: Mark files with `<leader>ha`, jump with `<leader>hs/d/f/g`
2. **Buffer Navigation**: Use `<S-hl>` to quickly switch between buffers
3. **Format Buffer**: Use `bf` to format the entire buffer

### Productivity

1. **Insert Helpers**: Use `;;` and `,,` to quickly add trailing punctuation
2. **Exit Insert Mode**: Use `jj` instead of `<Esc>` for faster mode switching
3. **Clipboard Integration**: Use `<leader>y` to copy to system clipboard

---

## Common Workflows

### "I want to..."

**Navigate between files**
```
<leader>hs/d/f/g  → Jump to harpoon file 1/2/3/4
<S-h/l>           → Previous/next buffer
<leader>ff        → Find file
```

**Move code around**
```
<A-j/k>           → Move line up/down
<leader>sv/sh     → Split window
<C-hjkl>          → Navigate between splits
```

**Search and replace**
```
<leader>sr        → Replace word under cursor
:%s/old/new/g     → Replace all (default)
```

**Copy to clipboard**
```
<leader>y         → Copy selection
<leader>Y         → Copy line
<leader>r         → Replace with clipboard
```

**Format code**
```
bf                → Format buffer
=                 → Auto-indent selection
```

---

## Environment Notes

### Host Machines
- All keybindings work on local Fedora, Bluefin-dx, and macOS installations
- Full plugin support including Harpoon, Telescope, and LSP

### Remote Environments
- Neovim keybindings work in Docker, Distrobox, DevContainers, and VMs
- Some plugins may require additional setup
- Tmux integration works seamlessly

---

## Related Configuration Files

- **Main Config**: `~/.config/nvim/init.lua`
- **Keymaps**: `~/.config/nvim/lua/config/keymaps.lua`
- **Plugins**: `~/.config/nvim/lua/plugins/`
  - `harpoon.lua` - File bookmarking
  - `tmux-navigator.lua` - Tmux integration
  - `lsp.lua` - Language server protocol
  - `git.lua` - Git integration

---

## Troubleshooting

### Keybinding Not Working

1. Check if the keybinding is already bound to another plugin
2. Verify the keybinding in `~/.config/nvim/lua/config/keymaps.lua`
3. Check plugin-specific keybindings in `~/.config/nvim/lua/plugins/`
4. Restart Neovim with `:source $MYVIMRC`

### Tmux Navigation Not Working

1. Ensure `vim-tmux-navigator` plugin is installed
2. Check Tmux configuration for conflicting keybindings
3. Verify `<C-hjkl>` is not bound elsewhere

### Harpoon Not Working

1. Ensure Harpoon is installed: `:Lazy` and check status
2. Add files with `<leader>ha` first
3. Check Harpoon menu with `<leader>hh`

---

**Last Updated**: October 29, 2025  
**Source**: `~/.config/nvim/lua/config/keymaps.lua` and plugin configurations
