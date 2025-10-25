# Zellij Configuration

Optimized for seamless Neovim integration with vim-style navigation.

## 🚀 Quick Start

**Most Important Keys:**
- `Alt+h/j/k/l` - Navigate between panes/splits (works in Neovim AND Zellij!)
- `Alt+p` then `v/s` - Split vertical/horizontal
- `Alt+t` then `n` - New tab
- `Alt+g` - Lock mode (pass all keys to terminal)

## Key Bindings Philosophy

- **Alt-based mode switching**: Prevents conflicts with Neovim
- **Vim-style navigation**: `hjkl` everywhere
- **Consistent with Neovim**: Similar split commands (`v` for vertical, `s` for horizontal)

## Quick Reference

### Mode Switching (from Normal mode)
- `Alt+p` → Pane mode
- `Alt+t` → Tab mode
- `Alt+r` → Resize mode
- `Alt+s` → Scroll mode
- `Alt+m` → Move mode
- `Alt+o` → Session mode
- `Alt+g` → Lock mode (pass all keys to terminal)

### Pane Management (Alt+p then...)
- `v` - Split vertically (new pane right)
- `s` - Split horizontally (new pane down)
- `n` - New pane (automatic direction)
- `hjkl` - Navigate between panes
- `x` - Close current pane
- `f` - Toggle fullscreen
- `w` - Toggle floating panes
- `c` - Rename pane
- `Tab` - Switch focus

### Tab Management (Alt+t then...)
- `n` - New tab
- `x` - Close tab
- `r` - Rename tab
- `hjkl` - Navigate tabs
- `1-9` - Jump to tab number
- `b` - Break pane to new tab

### Resize Mode (Alt+r then...)
- `hjkl` - Increase size in direction
- `HJKL` - Decrease size in direction
- `+/=` - Increase overall
- `-` - Decrease overall

### Scroll Mode (Alt+s then...)
- `jk` - Scroll up/down
- `hl` - Page up/down
- `d` - Half page down
- `u` - Half page up
- `Ctrl+f/b` - Full page forward/back
- `f` or `/` - Search
- `e` - Edit scrollback in $EDITOR (Neovim)

### Session Mode (Alt+o then...)
- `w` - Session manager (switch/create sessions)
- `d` - Detach from session
- `c` - Configuration
- `p` - Plugin manager

### Quick Actions (from Normal mode)
- **`Alt+h/j/k/l`** - Navigate panes/tabs (seamless with Neovim!)
- `Alt+n` - New pane (quick)
- `Alt+f` - Toggle floating panes
- `Alt+[/]` - Previous/Next layout
- `Alt+=/−` - Quick resize
- `Ctrl+q` - Quit Zellij

## Neovim Integration

The `zellij-nav.nvim` plugin enables seamless navigation:

- **`Alt+h/j/k/l`** - Navigate between Neovim splits AND Zellij panes (seamless!)
- **`Ctrl+h/j/k/l`** - Navigate within Neovim splits only
- Works intelligently: navigates within Neovim when possible, switches to Zellij panes at edges
- No manual mode switching needed for navigation

**Why Alt instead of Ctrl?** The `Ctrl+h` key sends the same signal as backspace in terminals, causing navigation issues. `Alt+hjkl` works reliably everywhere.

## Workflow Tips

### Project Sessions
Use Zellij tabs for different contexts within a project:
1. Tab 1: Editor (Neovim)
2. Tab 2: Server/dev process
3. Tab 3: Tests
4. Tab 4: Git/terminal commands

### Floating Panes
Press `Alt+p w` to create a floating terminal over your editor:
- Perfect for quick commands without losing context
- Run tests while keeping code visible
- Check git status/diff without leaving Neovim

### Scrollback & Search
- `Alt+s` → scroll mode
- `f` → search through terminal output
- `e` → open entire scrollback in Neovim for powerful editing/searching

### Layouts
Zellij auto-arranges panes. Use `Alt+[` and `Alt+]` to cycle through layouts.

## Configuration Files

- `config.kdl` - Main Zellij configuration
- `~/.config/nvim/lua/plugins/zellij.lua` - Neovim integration plugin

## Comparison to Tmux

| Tmux | Zellij |
|------|--------|
| `Prefix + c` | `Alt+t n` (new tab) |
| `Prefix + %` | `Alt+p v` (vertical split) |
| `Prefix + "` | `Alt+p s` (horizontal split) |
| `Prefix + arrows` | `Ctrl+hjkl` (with nvim integration) |
| `Prefix + z` | `Alt+p f` (fullscreen) |
| `Prefix + d` | `Alt+o d` (detach) |
| `Prefix + [` | `Alt+s` (scroll mode) |
