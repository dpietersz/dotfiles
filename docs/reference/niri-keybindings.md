# Niri Window Manager Keybindings Reference

Complete reference for Niri window manager keybindings. Niri is a scrollable-tiling Wayland compositor with a focus on simplicity and productivity.

**Note**: `Mod` = Super/Windows key

---

## Quick Navigation Cheat Sheet

```
Mod+H/L       → Focus column left/right
Mod+J/K       → Focus workspace down/up
Mod+↑↓←→      → Focus window/column (arrow keys)
Mod+1-9       → Jump to workspace by number
```

---

## Application Launching

| Keybinding | Action | Notes |
|------------|--------|-------|
| `Mod+Return` | Open terminal (kitty) | Primary terminal launcher |
| `Mod+Space` | Run application (fuzzel) | App launcher/switcher |
| `Ctrl+Alt+L` | Lock screen (swaylock) | Screen lock |
| `Mod+Backspace` | Logout (wlogout) | Logout menu |
| `Mod+Ctrl+Space` | Toggle waybar | Show/hide status bar |
| `Mod+Ctrl+I` | Relaunch waybar | Restart status bar |
| `Mod+N` | Toggle notification center | swaync notifications |
| `Mod+Shift+Space` | Lock waybar | Prevent waybar interaction |
| `XF86Calculator` | Open calculator | galculator |

---

## Window Management

### Basic Window Operations

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Q` | Close window | Window Control |
| `Mod+W` | Toggle floating | Floating/Tiling |
| `Mod+Ctrl+W` | Switch focus between floating and tiling | Focus Mode |
| `Mod+Alt+F` | Maximize column | Column Maximization |
| `Mod+Shift+F` | Fullscreen window | Window Fullscreen |
| `Mod+V` | Toggle column tabbed display | Column Display |

### Column Management

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+[` | Consume or expel window left | Column Organization |
| `Mod+]` | Consume or expel window right | Column Organization |
| `Mod+.` | Expel window from column | Column Organization |

---

## Focus Navigation

### Column & Window Focus

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Left` | Focus column left | Column Navigation |
| `Mod+Right` | Focus column right | Column Navigation |
| `Mod+H` | Focus column left (vim-style) | Column Navigation |
| `Mod+L` | Focus column right (vim-style) | Column Navigation |
| `Mod+Up` | Focus window up | Window Navigation |
| `Mod+Down` | Focus window down | Window Navigation |
| `Mod+Home` | Focus first column | Column Navigation |
| `Mod+End` | Focus last column | Column Navigation |

### Workspace Focus

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+J` | Focus workspace down | Workspace Navigation |
| `Mod+K` | Focus workspace up | Workspace Navigation |
| `Mod+Ctrl+Down` | Focus workspace down | Workspace Navigation |
| `Mod+Ctrl+Up` | Focus workspace up | Workspace Navigation |

### Monitor Focus

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Ctrl+Left` | Focus monitor left | Monitor Navigation |
| `Mod+Ctrl+H` | Focus monitor left (vim-style) | Monitor Navigation |
| `Mod+Ctrl+Right` | Focus monitor right | Monitor Navigation |
| `Mod+Ctrl+L` | Focus monitor right (vim-style) | Monitor Navigation |
| `Mod+Ctrl+Up` | Focus monitor up | Monitor Navigation |
| `Mod+Ctrl+K` | Focus monitor up (vim-style) | Monitor Navigation |
| `Mod+Ctrl+Down` | Focus monitor down | Monitor Navigation |
| `Mod+Ctrl+J` | Focus monitor down (vim-style) | Monitor Navigation |

---

## Window Movement

### Move Column/Window

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Shift+Left` | Move column left | Column Movement |
| `Mod+Shift+Right` | Move column right | Column Movement |
| `Mod+Shift+H` | Move column left (vim-style) | Column Movement |
| `Mod+Shift+L` | Move column right (vim-style) | Column Movement |
| `Mod+Shift+Up` | Move window up | Window Movement |
| `Mod+Shift+Down` | Move window down | Window Movement |
| `Mod+Ctrl+Home` | Move column to first position | Column Movement |
| `Mod+Ctrl+End` | Move column to last position | Column Movement |

### Move to Monitor

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Shift+Ctrl+Left` | Move column to monitor left | Move to Monitor |
| `Mod+Shift+Ctrl+H` | Move column to monitor left (vim-style) | Move to Monitor |
| `Mod+Shift+Ctrl+Right` | Move column to monitor right | Move to Monitor |
| `Mod+Shift+Ctrl+L` | Move column to monitor right (vim-style) | Move to Monitor |
| `Mod+Shift+Ctrl+Up` | Move column to monitor up | Move to Monitor |
| `Mod+Shift+Ctrl+K` | Move column to monitor up (vim-style) | Move to Monitor |
| `Mod+Shift+Ctrl+Down` | Move column to monitor down | Move to Monitor |
| `Mod+Shift+Ctrl+J` | Move column to monitor down (vim-style) | Move to Monitor |

---

## Workspace Management

### Workspace Navigation

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+1` | Focus workspace "Home" | Named Workspaces |
| `Mod+2` | Focus workspace "Work" | Named Workspaces |
| `Mod+3` | Focus workspace "Music" | Named Workspaces |
| `Mod+4` | Focus workspace "Coding" | Named Workspaces |
| `Mod+5` | Focus workspace 5 | Numbered Workspaces |
| `Mod+6` | Focus workspace 6 | Numbered Workspaces |
| `Mod+7` | Focus workspace 7 | Numbered Workspaces |
| `Mod+8` | Focus workspace 8 | Numbered Workspaces |
| `Mod+9` | Focus workspace 9 | Numbered Workspaces |

### Move to Workspace

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Shift+1` | Move column to workspace "Home" | Move to Workspace |
| `Mod+Shift+2` | Move column to workspace "Work" | Move to Workspace |
| `Mod+Shift+3` | Move column to workspace "Music" | Move to Workspace |
| `Mod+Shift+4` | Move column to workspace "Coding" | Move to Workspace |
| `Mod+Shift+5` | Move column to workspace 5 | Move to Workspace |
| `Mod+Shift+6` | Move column to workspace 6 | Move to Workspace |
| `Mod+Shift+7` | Move column to workspace 7 | Move to Workspace |
| `Mod+Shift+8` | Move column to workspace 8 | Move to Workspace |
| `Mod+Shift+9` | Move column to workspace 9 | Move to Workspace |

### Workspace Movement

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Shift+J` | Move workspace down | Workspace Movement |
| `Mod+Shift+K` | Move workspace up | Workspace Movement |
| `Mod+Shift+Page_Down` | Move workspace down | Workspace Movement |
| `Mod+Shift+Page_Up` | Move workspace up | Workspace Movement |

### Move Column to Workspace

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Ctrl+Alt+Down` | Move column to workspace down | Move to Workspace |
| `Mod+Ctrl+Alt+Up` | Move column to workspace up | Move to Workspace |

---

## Mouse Wheel Navigation

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+WheelScrollDown` | Focus workspace down | Workspace Navigation |
| `Mod+WheelScrollUp` | Focus workspace up | Workspace Navigation |
| `Mod+Ctrl+WheelScrollDown` | Move column to workspace down | Move to Workspace |
| `Mod+Ctrl+WheelScrollUp` | Move column to workspace up | Move to Workspace |
| `Mod+WheelScrollRight` | Focus column right | Column Navigation |
| `Mod+WheelScrollLeft` | Focus column left | Column Navigation |
| `Mod+Ctrl+WheelScrollRight` | Move column right | Column Movement |
| `Mod+Ctrl+WheelScrollLeft` | Move column left | Column Movement |
| `Mod+Shift+WheelScrollDown` | Focus column right | Column Navigation |
| `Mod+Shift+WheelScrollUp` | Focus column left | Column Navigation |
| `Mod+Ctrl+Shift+WheelScrollDown` | Move column right | Column Movement |
| `Mod+Ctrl+Shift+WheelScrollUp` | Move column left | Column Movement |

---

## Sizing & Layout

### Preset Sizing

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+R` | Switch preset column width | Column Sizing |
| `Mod+Shift+R` | Switch preset window height | Window Sizing |
| `Mod+Ctrl+R` | Reset window height | Window Sizing |
| `Mod+Ctrl+F` | Expand column to available width | Column Sizing |
| `Mod+Ctrl+C` | Center column | Column Positioning |

### Manual Sizing

| Keybinding | Action | Category |
|------------|--------|----------|
| `Mod+Minus` | Decrease column width by 10% | Column Sizing |
| `Mod+Equal` | Increase column width by 10% | Column Sizing |
| `Mod+Shift+Minus` | Decrease window height by 10% | Window Sizing |
| `Mod+Shift+Equal` | Increase window height by 10% | Window Sizing |

---

## Media & Volume Controls

All media controls work even when the screen is locked!

| Keybinding | Action | Category |
|------------|--------|----------|
| `XF86AudioRaiseVolume` | Increase volume | Volume Control |
| `XF86AudioLowerVolume` | Decrease volume | Volume Control |
| `XF86AudioMute` | Toggle mute | Volume Control |
| `XF86AudioMicMute` | Toggle microphone mute | Microphone Control |
| `XF86AudioNext` | Next track | Media Playback |
| `XF86AudioPrev` | Previous track | Media Playback |
| `XF86AudioPlay` | Play/pause | Media Playback |
| `XF86AudioPause` | Play/pause | Media Playback |

---

## Screenshots

Multiple ways to take screenshots with different scopes.

| Keybinding | Action | Scope | Category |
|------------|--------|-------|----------|
| `Print` | Screenshot | Full screen | Screenshots |
| `Ctrl+Print` | Screenshot | Current screen | Screenshots |
| `Alt+Print` | Screenshot | Current window | Screenshots |
| `Alt+Shift+S` | Screenshot | Full screen | Screenshots |
| `XF86Launch1` | Screenshot | Full screen | Screenshots |
| `Ctrl+XF86Launch1` | Screenshot | Current screen | Screenshots |
| `Alt+XF86Launch1` | Screenshot | Current window | Screenshots |

**Screenshot Location**: `~/dev/Pictures/Screenshots/`

---

## System & Misc

| Keybinding | Action | Category |
|------------|--------|----------|
| `Ctrl+Alt+Delete` | Quit niri | System Control |
| `Mod+Shift+Slash` | Show hotkey overlay | Help |
| `Mod+O` | Toggle overview | System |

---

## Workspace Configuration

### Defined Workspaces

```
Workspace 1: "Home"
Workspace 2: "Work"
Workspace 3: "Music"
Workspace 4: "Coding"
Workspaces 5-9: Numbered
```

### Preset Column Widths

The `Mod+R` keybinding cycles through:
- 50% of screen width
- 66.67% of screen width
- 100% of screen width (full width)

---

## Navigation Patterns

### Common Workflows

**Switch between workspaces:**
```
Mod+J/K         → Scroll through workspaces
Mod+1/2/3/4     → Jump to named workspace
Mod+WheelScroll → Mouse wheel navigation
```

**Move window to another workspace:**
```
Mod+Shift+J/K   → Move workspace down/up
Mod+Shift+1/2/3/4 → Move to named workspace
Mod+Ctrl+Alt+Up/Down → Move to adjacent workspace
```

**Navigate between monitors:**
```
Mod+Ctrl+H/L    → Focus monitor left/right
Mod+Ctrl+J/K    → Focus monitor down/up
Mod+Shift+Ctrl+H/L → Move column to monitor
```

**Resize windows:**
```
Mod+R           → Cycle preset widths
Mod+Shift+R     → Cycle preset heights
Mod+±           → Manual width adjustment
Mod+Shift+±     → Manual height adjustment
```

---

## Tips & Tricks

### Productivity

1. **Use Named Workspaces**: Assign specific tasks to Home/Work/Music/Coding workspaces
2. **Hotkey Overlay**: Press `Mod+Shift+/` to see all keybindings in an overlay
3. **Mouse Wheel**: Use `Mod+WheelScroll` for quick workspace navigation
4. **Column Presets**: Use `Mod+R` to quickly switch between common column widths

### Window Management

1. **Floating Windows**: Use `Mod+W` to toggle floating for specific windows
2. **Column Tabbing**: Use `Mod+V` to stack windows in a column
3. **Expel Windows**: Use `Mod+.` to move a window out of its column
4. **Center Column**: Use `Mod+Ctrl+C` to center the focused column

### Multi-Monitor

1. **Quick Monitor Switch**: Use `Mod+Ctrl+H/L` to move focus between monitors
2. **Move Windows**: Use `Mod+Shift+Ctrl+H/L` to move columns to other monitors
3. **Monitor-Specific Workspaces**: Each monitor has its own workspace stack

---

## Environment Notes

**Niri is only available on:**
- Host machines with Wayland support
- Fedora, Bluefin-dx, and similar distributions
- Systems with GPU acceleration

**Not available in:**
- Remote environments (Docker, Distrobox, DevContainers)
- X11-only systems
- Cloud development environments

---

## Related Configuration Files

- **Main Config**: `~/.config/niri/config.kdl`
- **Scripts**: `~/.config/niri/scripts/`
  - `toggle-waybar.sh` - Toggle status bar
  - `volume_up.sh` - Volume control
  - `volume_down.sh` - Volume control
- **Status Bar**: `~/.config/waybar/`

---

## Troubleshooting

### Keybinding Not Working

1. Check if the keybinding is already bound to another action
2. Verify the key name in `~/.config/niri/config.kdl`
3. Use `Mod+Shift+/` to see the hotkey overlay
4. Restart niri if you modified the config

### Workspace Navigation Slow

- Reduce the number of open windows
- Use `Mod+Ctrl+C` to center columns
- Close unused floating windows with `Mod+Q`

---

**Last Updated**: October 29, 2025  
**Source**: `~/.config/niri/config.kdl`
