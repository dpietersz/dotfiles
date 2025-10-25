# Zellij + Neovim Setup Complete! 🎉

## What Changed

### The Problem
`Ctrl+h` is interpreted as backspace by terminals, making it unreliable for navigation between Zellij and Neovim.

### The Solution
Use **`Alt+h/j/k/l`** for seamless navigation between Zellij panes and Neovim splits!

## Navigation Guide

### Inside Neovim + Zellij

**Seamless Navigation (works everywhere):**
- `Alt+h` - Move left (Neovim split OR Zellij pane)
- `Alt+j` - Move down (Neovim split OR Zellij pane)
- `Alt+k` - Move up (Neovim split OR Zellij pane)
- `Alt+l` - Move right (Neovim split OR Zellij pane)

**Within-Neovim Only:**
- `Ctrl+h/j/k/l` - Navigate between Neovim splits only (stays in Neovim)

### How It Works

1. **In Neovim with multiple splits:**
   - Press `Alt+l` → moves to the right Neovim split
   - Keep pressing `Alt+l` → when you hit the rightmost split, it exits Neovim and moves to the Zellij pane on the right!

2. **In a Zellij pane (not Neovim):**
   - Press `Alt+h/j/k/l` → navigates between Zellij panes

3. **In Neovim and want to stay in Neovim:**
   - Use `Ctrl+h/j/k/l` → only navigates within Neovim, never exits to Zellij

## Other Changes

### Line Movement Updated
- **Old:** `Alt+j/k` to move lines (conflicted with navigation)
- **New:** `Alt+Up/Down` to move lines (more intuitive!)
  - Works in normal, visual, AND insert mode
  - Auto-indents after moving

## Quick Test

Try this workflow:

```bash
# Start Zellij
zellij

# Create a vertical split
Alt+p v

# Open Neovim in left pane
nvim

# Inside Neovim, create splits
:vsplit
:split

# Now use Alt+h/j/k/l to navigate
# It will move between Neovim splits AND Zellij panes seamlessly!

# Use Alt+l repeatedly - it will eventually exit Neovim and move to the right Zellij pane
```

## Benefits

✅ **Seamless** - One key combo works everywhere  
✅ **Reliable** - No terminal compatibility issues  
✅ **Intuitive** - Alt+hjkl is similar to vim's hjkl  
✅ **No conflicts** - Moved line movement to Alt+Up/Down  
✅ **Flexible** - Ctrl+hjkl still available for within-Neovim navigation  

## Configuration Files Modified

- `dot_config/zellij/config.kdl` - Added Alt+hjkl navigation in normal/locked modes
- `dot_config/nvim/lua/plugins/zellij.lua` - Changed from Ctrl to Alt navigation
- `dot_config/nvim/lua/config/keymaps.lua` - Restored Ctrl+hjkl, moved line movement to Alt+Up/Down

## Next Steps

1. Restart Zellij or run `zellij action reload-config`
2. Restart Neovim or run `:Lazy sync` to install zellij-nav.nvim
3. Test the navigation!
