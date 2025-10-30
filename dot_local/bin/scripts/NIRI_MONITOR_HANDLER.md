# Niri Monitor Reset

Manually reset eDP-1 (laptop screen) position to [0,0] when needed.

## Overview

This script provides a simple way to reset your laptop screen position when the external monitor is disconnected and the laptop screen ends up off-screen.

Instead of a continuous background service that drains battery, you can simply press a keybinding to reset the position when needed.

## How It Works

### The Scenario

When your LG external monitor is connected:
- LG monitor at [0,0]
- eDP-1 (laptop screen) at [760,1440] (centered below)

When you disconnect the LG monitor:
- eDP-1 is still at [760,1440] (off-screen!)
- You can't see anything

### The Solution

Press **Mod+Shift+M** to reset eDP-1 to [0,0]:
- Script updates the Niri config
- Reloads the configuration
- Laptop screen is now visible at [0,0]

## Usage

### Via Keybinding (Recommended)

Simply press:
```
Mod+Shift+M
```

This will:
1. Check current eDP-1 position
2. If not at [0,0], update the config
3. Reload Niri configuration
4. Display success/error message

### Via Command Line

```bash
# Run the script directly
niri-reset-monitor

# Or with full path
~/.local/bin/scripts/niri-reset-monitor
```

## Output Examples

### Already at [0,0]
```
[Niri Monitor Reset]
Current eDP-1 position: x=0 y=0
✓ eDP-1 is already at [0,0]
```

### Successfully Reset
```
[Niri Monitor Reset]
Current eDP-1 position: x=760 y=1440
Resetting eDP-1 position to [0,0]...
✓ Config updated successfully
✓ Niri config reloaded
✓ Monitor position reset complete!
```

### Error Case
```
[Niri Monitor Reset]
Current eDP-1 position: x=760 y=1440
Resetting eDP-1 position to [0,0]...
✗ Failed to update position in config
```

## Keybinding

The keybinding is configured in your Niri config:

```kdl
Mod+Shift+M hotkey-overlay-title="Reset Monitor: niri-reset-monitor" { spawn "niri-reset-monitor"; }
```

You can change this to any keybinding you prefer by editing:
```
~/.config/niri/config.kdl
```

## Battery Impact

✓ **Zero battery impact** - Only runs when you press the keybinding
✓ **No background service** - No continuous monitoring
✓ **Fast execution** - Completes in milliseconds

## Troubleshooting

### Script Not Found

Make sure the script is in your PATH:
```bash
# Check if script is executable
ls -la ~/.local/bin/scripts/niri-reset-monitor

# Make sure ~/.local/bin/scripts is in your PATH
echo $PATH | grep -q ".local/bin" && echo "In PATH" || echo "Not in PATH"
```

### Keybinding Not Working

1. Check if the script is executable:
   ```bash
   chmod +x ~/.local/bin/scripts/niri-reset-monitor
   ```

2. Verify the keybinding in your config:
   ```bash
   grep "Mod+Shift+M" ~/.config/niri/config.kdl
   ```

3. Reload Niri config:
   ```bash
   niri msg action reload-config
   ```

### Config Not Reloading

If the script updates the config but Niri doesn't reload:

1. Try manual reload:
   ```bash
   niri msg action reload-config
   ```

2. Or restart Niri:
   ```bash
   pkill niri
   niri &
   ```

## Customization

### Change the Keybinding

Edit `~/.config/niri/config.kdl` and change:
```kdl
Mod+Shift+M { spawn "niri-reset-monitor"; }
```

To your preferred keybinding, for example:
```kdl
Mod+Ctrl+R { spawn "niri-reset-monitor"; }
```

### Add to Hotkey Overlay

The keybinding already includes a hotkey overlay title:
```kdl
hotkey-overlay-title="Reset Monitor: niri-reset-monitor"
```

This shows up when you press Mod+Shift+Slash to see all keybindings.

## References

- [Niri Configuration: Outputs](https://github.com/YaLTeR/niri/wiki/Configuration:-Outputs)
- [Niri Key Bindings](https://github.com/YaLTeR/niri/wiki/Configuration:-Key-Bindings)
- [Niri IPC Documentation](https://github.com/YaLTeR/niri/wiki/IPC)
