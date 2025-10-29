# Comprehensive Keybindings Reference

Quick reference guide for all keybindings across the dotfiles configuration. Organized by application and context for easy lookup.

**Table of Contents:**
- [Neovim Keybindings](#neovim-keybindings)
- [Niri Window Manager Keybindings](#niri-window-manager-keybindings)
- [Shell Aliases & Functions](#shell-aliases--functions)
- [Custom Scripts](#custom-scripts)

---

## Neovim Keybindings

### Core Navigation & Movement

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<C-h>` | Navigate left (Tmux/Nvim) | Normal | Pane Navigation |
| `<C-j>` | Navigate down (Tmux/Nvim) | Normal | Pane Navigation |
| `<C-k>` | Navigate up (Tmux/Nvim) | Normal | Pane Navigation |
| `<C-l>` | Navigate right (Tmux/Nvim) | Normal | Pane Navigation |
| `<C-\>` | Navigate to previous pane | Normal | Pane Navigation |
| `<S-h>` | Go to line start | Normal/Operator/Visual | Movement |
| `<S-l>` | Go to line end | Normal/Operator/Visual | Movement |
| `n` | Next search result (centred) | Normal | Search |
| `N` | Previous search result (centred) | Normal | Search |
| `<C-d>` | Half page down (centred) | Normal | Scrolling |
| `<C-u>` | Half page up (centred) | Normal | Scrolling |

### Buffer Management

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<S-l>` | Next buffer | Normal | Buffer Navigation |
| `<S-h>` | Previous buffer | Normal | Buffer Navigation |
| `bl` | Next buffer | Normal | Buffer Navigation |
| `bh` | Previous buffer | Normal | Buffer Navigation |
| `bdd` | Delete buffer | Normal | Buffer Management |
| `bf` | Format buffer | Normal | Buffer Management |
| `bo` | Only current buffer (close others) | Normal | Buffer Management |

### Window Management & Splitting

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>sv` | Split window vertically | Normal | Window Management |
| `<leader>sh` | Split window horizontally | Normal | Window Management |
| `<C-Up>` | Increase window height | Normal | Window Resizing |
| `<C-Down>` | Decrease window height | Normal | Window Resizing |
| `<C-Left>` | Decrease window width | Normal | Window Resizing |
| `<C-Right>` | Increase window width | Normal | Window Resizing |

### Line Manipulation

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<A-j>` | Move line down | Normal | Line Movement |
| `<A-k>` | Move line up | Normal | Line Movement |
| `<A-j>` | Move selection down | Visual | Line Movement |
| `<A-k>` | Move selection up | Visual | Line Movement |
| `<A-j>` | Move line down | Insert | Line Movement |
| `<A-k>` | Move line up | Insert | Line Movement |
| `<` | Indent left and reselect | Visual | Indentation |
| `>` | Indent right and reselect | Visual | Indentation |

### Yanking & Clipboard

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `Y` | Yank to end of line | Normal | Yanking |
| `<leader>y` | Copy to system clipboard | Normal/Visual | Clipboard |
| `<leader>Y` | Copy line to system clipboard | Normal | Clipboard |
| `<leader>r` | Replace selected with clipboard | Visual | Clipboard |
| `<leader>D` | Delete to black hole register | Visual | Deletion |
| `p` | Paste without copying selection | Visual | Pasting |

### Search & Replace

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>sr` | Search & replace word under cursor | Normal | Search & Replace |
| `<Esc>` | Clear search highlights | Normal | Search |

### Insert Mode Helpers

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `jj` | Exit insert mode | Insert | Mode Switching |
| `;;` | Insert trailing semicolon | Insert | Insert Helpers |
| `,,` | Insert trailing comma | Insert | Insert Helpers |

### Configuration & Misc

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>rc` | Edit neovim config | Normal | Configuration |
| `q:` | Disable command-line type | Normal | Misc |

---

## Harpoon File Navigation

Quick file bookmarking and navigation system.

| Keybinding | Action | Mode | Category |
|------------|--------|------|----------|
| `<leader>ha` | Add current file to harpoon | Normal | Harpoon |
| `<leader>hh` | Toggle harpoon menu | Normal | Harpoon |
| `<leader>hs` | Jump to harpoon file 1 | Normal | Harpoon |
| `<leader>hd` | Jump to harpoon file 2 | Normal | Harpoon |
| `<leader>hf` | Jump to harpoon file 3 | Normal | Harpoon |
| `<leader>hg` | Jump to harpoon file 4 | Normal | Harpoon |
| `<leader>hp` | Previous harpoon file | Normal | Harpoon |
| `<leader>hn` | Next harpoon file | Normal | Harpoon |
| `<leader>fh` | Search harpoon files (Snacks picker) | Normal | Harpoon |

---

## Niri Window Manager Keybindings

### Application Launching

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Return` | Open terminal (kitty) | Application Launcher |
| `Mod+Space` | Run application (fuzzel) | Application Launcher |
| `Ctrl+Alt+L` | Lock screen (swaylock) | System |
| `Mod+Backspace` | Logout (wlogout) | System |
| `Mod+Ctrl+Space` | Toggle waybar | System |
| `Mod+Ctrl+I` | Relaunch waybar | System |
| `Mod+N` | Toggle notification center (swaync) | System |
| `Mod+Shift+Space` | Lock waybar | System |
| `XF86Calculator` | Open calculator (galculator) | Application Launcher |

### Window Management

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Q` | Close window | Window Management |
| `Mod+Alt+F` | Maximize column | Window Management |
| `Mod+Shift+F` | Fullscreen window | Window Management |
| `Mod+W` | Toggle floating window | Window Management |
| `Mod+Ctrl+W` | Switch focus between floating and tiling | Window Management |
| `Mod+V` | Toggle column tabbed display | Window Management |

### Focus Navigation (Columns & Windows)

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Left` / `Mod+H` | Focus column left | Focus Navigation |
| `Mod+Right` / `Mod+L` | Focus column right | Focus Navigation |
| `Mod+Up` | Focus window up | Focus Navigation |
| `Mod+Down` | Focus window down | Focus Navigation |
| `Mod+Home` | Focus first column | Focus Navigation |
| `Mod+End` | Focus last column | Focus Navigation |

### Window Movement

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Shift+Left` / `Mod+Shift+H` | Move column left | Window Movement |
| `Mod+Shift+Right` / `Mod+Shift+L` | Move column right | Window Movement |
| `Mod+Shift+Up` | Move window up | Window Movement |
| `Mod+Shift+Down` | Move window down | Window Movement |
| `Mod+Ctrl+Home` | Move column to first position | Window Movement |
| `Mod+Ctrl+End` | Move column to last position | Window Movement |

### Monitor Navigation

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Ctrl+Left` / `Mod+Ctrl+H` | Focus monitor left | Monitor Navigation |
| `Mod+Ctrl+Right` / `Mod+Ctrl+L` | Focus monitor right | Monitor Navigation |
| `Mod+Ctrl+Up` / `Mod+Ctrl+K` | Focus monitor up | Monitor Navigation |
| `Mod+Ctrl+Down` / `Mod+Ctrl+J` | Focus monitor down | Monitor Navigation |

### Move to Monitor

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Shift+Ctrl+Left` / `Mod+Shift+Ctrl+H` | Move column to monitor left | Move to Monitor |
| `Mod+Shift+Ctrl+Right` / `Mod+Shift+Ctrl+L` | Move column to monitor right | Move to Monitor |
| `Mod+Shift+Ctrl+Up` / `Mod+Shift+Ctrl+K` | Move column to monitor up | Move to Monitor |
| `Mod+Shift+Ctrl+Down` / `Mod+Shift+Ctrl+J` | Move column to monitor down | Move to Monitor |

### Workspace Navigation

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+J` | Focus workspace down | Workspace Navigation |
| `Mod+K` | Focus workspace up | Workspace Navigation |
| `Mod+Ctrl+Down` | Focus workspace down | Workspace Navigation |
| `Mod+Ctrl+Up` | Focus workspace up | Workspace Navigation |
| `Mod+1` | Focus workspace "Home" | Workspace Navigation |
| `Mod+2` | Focus workspace "Work" | Workspace Navigation |
| `Mod+3` | Focus workspace "Music" | Workspace Navigation |
| `Mod+4` | Focus workspace "Coding" | Workspace Navigation |
| `Mod+5` through `Mod+9` | Focus workspaces 5-9 | Workspace Navigation |

### Move to Workspace

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Shift+J` | Move workspace down | Move to Workspace |
| `Mod+Shift+K` | Move workspace up | Move to Workspace |
| `Mod+Ctrl+Alt+Down` | Move column to workspace down | Move to Workspace |
| `Mod+Ctrl+Alt+Up` | Move column to workspace up | Move to Workspace |
| `Mod+Shift+1` | Move column to workspace "Home" | Move to Workspace |
| `Mod+Shift+2` | Move column to workspace "Work" | Move to Workspace |
| `Mod+Shift+3` | Move column to workspace "Music" | Move to Workspace |
| `Mod+Shift+4` | Move column to workspace "Coding" | Move to Workspace |
| `Mod+Shift+5` through `Mod+Shift+9` | Move to workspaces 5-9 | Move to Workspace |

### Mouse Wheel Navigation

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+WheelScrollDown` | Focus workspace down | Mouse Navigation |
| `Mod+WheelScrollUp` | Focus workspace up | Mouse Navigation |
| `Mod+Ctrl+WheelScrollDown` | Move column to workspace down | Mouse Navigation |
| `Mod+Ctrl+WheelScrollUp` | Move column to workspace up | Mouse Navigation |
| `Mod+WheelScrollRight` | Focus column right | Mouse Navigation |
| `Mod+WheelScrollLeft` | Focus column left | Mouse Navigation |
| `Mod+Ctrl+WheelScrollRight` | Move column right | Mouse Navigation |
| `Mod+Ctrl+WheelScrollLeft` | Move column left | Mouse Navigation |

### Column Management

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+[` | Consume or expel window left | Column Management |
| `Mod+]` | Consume or expel window right | Column Management |
| `Mod+.` | Expel window from column | Column Management |

### Sizing & Layout

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+R` | Switch preset column width | Layout |
| `Mod+Shift+R` | Switch preset window height | Layout |
| `Mod+Ctrl+R` | Reset window height | Layout |
| `Mod+Ctrl+F` | Expand column to available width | Layout |
| `Mod+Ctrl+C` | Center column | Layout |
| `Mod+Minus` | Decrease column width by 10% | Manual Sizing |
| `Mod+Equal` | Increase column width by 10% | Manual Sizing |
| `Mod+Shift+Minus` | Decrease window height by 10% | Manual Sizing |
| `Mod+Shift+Equal` | Increase window height by 10% | Manual Sizing |

### Media & Volume Controls

| Keybinding | Action | Category |
|------------|--------|----------|
| `XF86AudioRaiseVolume` | Increase volume | Media Control |
| `XF86AudioLowerVolume` | Decrease volume | Media Control |
| `XF86AudioMute` | Toggle mute | Media Control |
| `XF86AudioMicMute` | Toggle microphone mute | Media Control |
| `XF86AudioNext` | Next track | Media Control |
| `XF86AudioPrev` | Previous track | Media Control |
| `XF86AudioPlay` / `XF86AudioPause` | Play/pause | Media Control |

### Screenshots

| Keybinding | Action | Category |
|------------|--------|----------|
| `Alt+Shift+S` | Screenshot (full screen) | Screenshots |
| `Print` | Screenshot (full screen) | Screenshots |
| `Ctrl+Print` | Screenshot (current screen) | Screenshots |
| `Alt+Print` | Screenshot (current window) | Screenshots |
| `XF86Launch1` | Screenshot (full screen) | Screenshots |
| `Ctrl+XF86Launch1` | Screenshot (current screen) | Screenshots |
| `Alt+XF86Launch1` | Screenshot (current window) | Screenshots |

### System & Misc

| Keybinding | Action | Category |
|------------|--------|----------|
| `Ctrl+Alt+Delete` | Quit niri | System |
| `Mod+Shift+Slash` | Show hotkey overlay | System |
| `Mod+O` | Toggle overview | System |

---

## Shell Aliases & Functions

### Git Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `gp` | `git pull` | Pull latest changes |
| `gs` | `git status` | Show git status |

### Directory Navigation

| Alias | Command | Description |
|-------|---------|-------------|
| `..` | `cd ..` | Go up one level |
| `...` | `cd ../..` | Go up two levels |
| `....` | `cd ../../..` | Go up three levels |
| `.....` | `cd ../../../..` | Go up four levels |
| `~` | `cd ~` | Go to home directory |
| `cl` | `clear` | Clear terminal |
| `cd` | `z` | Smart directory navigation (zoxide) |

### File Listing

| Alias | Command | Description |
|-------|---------|-------------|
| `ls` | `ls --color=auto` | List files with colors |
| `la` | `eza -laghm --all --icons --git` | List all files with details |
| `ll` | `eza -l --color=always --icons` | List files with details |
| `lt` | `eza -aT --color=always --icons` | List files as tree |
| `l` | `eza -lah --color=always --icons` | List all files with icons |
| `last` | `find . -type f -exec ls -lrt {} +` | List files by modification time |

### Configuration Editing

| Alias | Command | Description |
|-------|---------|-------------|
| `espansoconf` | `v $DOTFILES/dot_config/espanso/match/base.yml` | Edit espanso config |
| `nvimconf` | `cd $DOTFILES/dot_config/nvim && nvim init.lua` | Edit neovim config |
| `bashconf` | `v ~/.bashrc` | Edit bash config (bash only) |
| `sbr` | `source ~/.bashrc` | Reload bash config (bash only) |
| `zshconf` | `v ~/.zshrc` | Edit zsh config (zsh only) |
| `szr` | `source ~/.zshrc` | Reload zsh config (zsh only) |

### Password Store (pass)

| Alias | Command | Description |
|-------|---------|-------------|
| `p` | `pass` | Password store |
| `pp` | `pass git push` | Push password store to git |
| `pi` | `pass insert` | Insert new password |
| `pmv` | `pass mv` | Move password entry |
| `pcp` | `pass cp` | Copy password entry |
| `pedit` | `pass edit` | Edit password entry |
| `psearch` | `pass search` | Search passwords |
| `psh` | `pass show` | Show password |
| `psc` | `pass show -c` | Show and copy password |
| `ppp` | `pass show -c Sites/canva.com` | Show Canva password |

### Tool Shortcuts

| Alias | Command | Description |
|-------|---------|-------------|
| `ld` | `lazydocker` | Docker UI |
| `lg` | `lazygit` | Git UI |
| `k` | `kubectl` | Kubernetes CLI |
| `cat` | `bat` or `batcat` | Syntax-highlighted cat |

---

## Shell Functions

### Archive Helpers

| Function | Usage | Description |
|----------|-------|-------------|
| `extract` | `extract <file>` | Extract .gz, .bz2, or .zip files |
| `compress_current_folder` | `compress_current_folder` | Compress current directory to zip |

### Git Clone Helper

| Function | Usage | Description |
|----------|-------|-------------|
| `clone` | `clone <git-url>` | Smart git clone with auto-directory organization |

**Features:**
- Supports both SSH and HTTPS URLs
- Auto-organizes by host/namespace
- Special handling for personal GitHub/GitLab repos
- Auto-navigates to cloned directory

### Image Processing

| Function | Usage | Description |
|----------|-------|-------------|
| `webjpeg` | `webjpeg <input> <size> <output>` | Optimize JPEG for web |
| `cropjpeg` | `cropjpeg <input> <size> <output>` | Crop JPEG from center |

### Markdown/Pandoc

| Function | Usage | Description |
|----------|-------|-------------|
| `html_to_md` | `html_to_md <file.html>` | Convert HTML to Markdown |

---

## Custom Scripts

Quick access scripts in `~/.local/bin/scripts/`

| Script | Usage | Description |
|--------|-------|-------------|
| `ai` | `ai <prompt>` | Query OpenAI API via mods |
| `ai-scratchpad` | `ai-scratchpad` | AI scratchpad tool |
| `cht` | `cht <language/topic>` | Cheat sheet lookup (cht.sh) |
| `clean_nvim` | `clean_nvim` | Clean neovim cache |
| `connect-airpods` | `connect-airpods` | Connect to AirPods |
| `extract` | `extract <file>` | Extract archives |
| `git-llm` | `git-llm <prompt>` | Generate git commits with LLM |
| `git-llm-hvs` | `git-llm-hvs <prompt>` | HVS-specific git LLM |
| `hnow` | `hnow` | Show current time |
| `jj-llm` | `jj-llm <prompt>` | Jujutsu commits with LLM |
| `llm-process-pitch` | `llm-process-pitch` | Process pitch with LLM |
| `llm-process-pitch2` | `llm-process-pitch2` | Process pitch v2 with LLM |
| `md` | `md <text>` | Markdown helper |
| `mount-sd` | `mount-sd` | Mount SD card |
| `myip` | `myip` | Show current IP |
| `og` | `og` | Organize Zettelkasten notes |
| `on` | `on` | Turn on service |
| `or` | `or` | Restart service |
| `restart-gpg` | `restart-gpg` | Restart GPG agent |
| `summarize` | `summarize <text>` | Summarize with LLM |
| `symlink` | `symlink <src> <dest>` | Create symlink |
| `ttsme` | `ttsme <text>` | Text-to-speech |
| `unmount-sd` | `unmount-sd` | Unmount SD card |
| `vimcheat` | `vimcheat` | Vim cheat sheet |

---

## Key Modifiers Reference

| Modifier | Symbol | Key |
|----------|--------|-----|
| Super/Windows | `Mod` | Super key |
| Control | `Ctrl` | Control key |
| Shift | `Shift` | Shift key |
| Alt | `Alt` | Alt key |
| Leader | `<leader>` | Space (Neovim) |

---

## Tips & Tricks

### Neovim

- **Tmux Integration**: Use `<C-hjkl>` to navigate seamlessly between Neovim and Tmux panes
- **Harpoon**: Mark frequently-used files with `<leader>ha` for quick access
- **Search & Replace**: Use `<leader>sr` to quickly replace the word under cursor
- **Clipboard**: Use `<leader>y` to copy to system clipboard without affecting registers

### Niri

- **Workspace Switching**: Use `Mod+J/K` or mouse wheel for quick workspace navigation
- **Window Sizing**: Use `Mod+R` to cycle through preset column widths
- **Monitor Navigation**: Use `Mod+Ctrl+H/L` to move focus between monitors
- **Hotkey Overlay**: Press `Mod+Shift+/` to see all available keybindings

### Shell

- **Smart Clone**: The `clone` function automatically organizes repositories by host and namespace
- **Archive Extraction**: Use `extract` for automatic format detection
- **Directory Navigation**: Use `cd` (aliased to `z`) for smart directory jumping with zoxide

---

## Environment Notes

- **Host Machines**: All keybindings apply to local Fedora/Bluefin-dx/macOS installations
- **Remote Environments**: Neovim and shell keybindings work in Docker, Distrobox, DevContainers, and VMs
- **Niri WM**: Only available on host machines with Wayland support

---

## Related Documentation

- [Neovim Configuration](../../dot_config/nvim/README.md)
- [Niri Configuration](../../dot_config/niri/config.kdl)
- [Shell Configuration](../../dot_config/shell/)
- [Custom Scripts](../../dot_local/bin/scripts/)

---

**Last Updated**: October 29, 2025  
**Source**: Extracted from dotfiles repository configuration files
