# SwayOSD Integration Guide for Niri

This guide explains how to integrate SwayOSD with your Niri window manager configuration.

## Quick Start

### Step 1: Ensure SwayOSD is Installed

SwayOSD should be installed via the dotfiles setup script. Verify installation:

```bash
which swayosd-server
which swayosd-client
```

If not installed, install it:

```bash
# On Bluefin (rpm-ostree)
sudo rpm-ostree install swayosd

# On Fedora (dnf)
sudo dnf install swayosd

# On Arch Linux
sudo pacman -S swayosd
```

### Step 2: Update Niri Configuration

Edit `~/.config/niri/config.kdl` and make the following changes:

#### 2a. Start SwayOSD Server at Startup

Add this line near the top of the file (after other `spawn-at-startup` commands):

```kdl
spawn-at-startup "swayosd-server"
```

**Location in config.kdl:**
```kdl
// Auto-start waybar
spawn-at-startup "waybar"

// Auto-start SwayOSD server
spawn-at-startup "swayosd-server"

workspace "Coding"
workspace "Media"
workspace "Work"
```

#### 2b. Add Volume Control Keybindings

Find the `binds {` section in your niri config and add these keybindings:

```kdl
// === Volume & Media Controls ===
// Volume keys work even when the session is locked
XF86AudioRaiseVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "raise"; 
}
XF86AudioLowerVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "lower"; 
}
XF86AudioMute allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "mute-toggle"; 
}
XF86AudioMicMute allow-when-locked=true { 
  spawn "swayosd-client" "--input-volume" "mute-toggle"; 
}

// Brightness controls (optional)
XF86MonBrightnessUp allow-when-locked=true { 
  spawn "swayosd-client" "--brightness" "raise"; 
}
XF86MonBrightnessDown allow-when-locked=true { 
  spawn "swayosd-client" "--brightness" "lower"; 
}
```

**Note:** These keybindings replace the existing volume control scripts in your niri config. You can remove or comment out the old ones:

```kdl
// OLD - Comment these out or remove them:
// XF86AudioRaiseVolume allow-when-locked=true { spawn "bash" "-c" "$HOME/.config/niri/scripts/volume_up.sh"; }
// XF86AudioLowerVolume allow-when-locked=true { spawn "bash" "-c" "$HOME/.config/niri/scripts/volume_down.sh"; }
```

### Step 3: Verify Configuration

Check that your niri config is valid:

```bash
niri validate
```

If there are errors, fix them and try again.

### Step 4: Apply Changes

Reload Niri configuration:

```bash
niri msg action reload-config
```

Or restart Niri by logging out and back in.

### Step 5: Test

Test the volume controls by pressing:
- `XF86AudioRaiseVolume` (usually Fn+Volume Up)
- `XF86AudioLowerVolume` (usually Fn+Volume Down)
- `XF86AudioMute` (usually Fn+Mute)
- `XF86AudioMicMute` (usually Fn+Mic Mute)

You should see an OSD appear at the top-center of your screen showing the volume level.

## Configuration Details

### OSD Appearance

The OSD styling is defined in `~/.config/swayosd/style.css` and includes:

- **Duration**: 2 seconds (2000ms)
- **Position**: Top-center
- **Colors**: Gruvbox Dark + Nord color scheme
- **Progress bars**: For volume and brightness
- **Icons**: Volume, microphone, brightness icons with appropriate colors

### Volume Increment

By default, volume changes by 5% per key press. To change this, modify the keybindings:

```kdl
// Change volume by 10% instead of 5%
XF86AudioRaiseVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "raise" "--max-volume" "100"; 
}
```

### Custom Timeout

To change the OSD display timeout (default 2 seconds), add `--timeout` to the command:

```kdl
XF86AudioRaiseVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "raise" "--timeout" "3000"; 
}
```

(3000 = 3 seconds)

### Multiple Audio Devices

If you have multiple audio devices, you can specify which one to control:

```bash
# List audio devices
pactl list short sinks

# Use a specific device in keybinding
swayosd-client --output-volume raise --device alsa_output.pci-0000_11_00.4.analog-stereo
```

### Brightness Control

Brightness control requires proper permissions. Ensure your user is in the `video` group:

```bash
# Add user to video group
sudo usermod -a -G video $USER

# Apply group changes (logout and login, or use newgrp)
newgrp video
```

## Troubleshooting

### OSD Not Appearing

1. **Check if swayosd-server is running:**
   ```bash
   pgrep swayosd-server
   ```

2. **Start it manually:**
   ```bash
   swayosd-server &
   ```

3. **Check niri logs:**
   ```bash
   journalctl -u niri --user -f
   ```

4. **Verify keybindings are correct:**
   ```bash
   niri msg action show-hotkey-overlay
   ```

### Styling Not Applied

1. **Verify style.css exists:**
   ```bash
   ls -la ~/.config/swayosd/style.css
   ```

2. **Restart SwayOSD server:**
   ```bash
   pkill swayosd-server
   swayosd-server &
   ```

3. **Check SwayOSD version:**
   ```bash
   swayosd-server --version
   ```
   (CSS styling requires v0.2.0+)

### Volume Control Not Working

1. **Check if wpctl is available:**
   ```bash
   which wpctl
   ```

2. **Test volume control manually:**
   ```bash
   swayosd-client --output-volume raise
   ```

3. **Check audio device:**
   ```bash
   pactl list short sinks
   ```

### Brightness Control Not Working

1. **Check brightness device:**
   ```bash
   ls /sys/class/backlight/
   ```

2. **Check user permissions:**
   ```bash
   groups $USER
   ```
   (Should include `video` group)

3. **Test brightness control manually:**
   ```bash
   swayosd-client --brightness raise
   ```

## Advanced Configuration

### Custom Volume Increment Per Key

Create a wrapper script for custom behavior:

```bash
#!/bin/bash
# ~/.local/bin/volume-control.sh

case "$1" in
  up)
    swayosd-client --output-volume raise
    ;;
  down)
    swayosd-client --output-volume lower
    ;;
  mute)
    swayosd-client --output-volume mute-toggle
    ;;
esac
```

Then use in niri config:

```kdl
XF86AudioRaiseVolume allow-when-locked=true { 
  spawn "bash" "-c" "$HOME/.local/bin/volume-control.sh up"; 
}
```

### Per-Monitor OSD

To show OSD on specific monitor:

```kdl
XF86AudioRaiseVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "raise" "--monitor" "HDMI-1"; 
}
```

### Custom Styling

Edit `~/.config/swayosd/style.css` to customize:
- Colors
- Font sizes
- Border radius
- Transparency
- Progress bar appearance

See `README.md` for detailed styling documentation.

## Integration with Existing Volume Scripts

If you have existing volume control scripts in `~/.config/niri/scripts/`, you can:

1. **Keep both**: Use SwayOSD for visual feedback and keep scripts for other purposes
2. **Replace**: Use SwayOSD keybindings instead of scripts
3. **Hybrid**: Call SwayOSD from your scripts:

```bash
#!/bin/bash
# ~/.config/niri/scripts/volume_up.sh

# Increase volume
wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.05+

# Show OSD
swayosd-client --output-volume raise
```

## References

- **SwayOSD GitHub**: https://github.com/ErikReider/SwayOSD
- **Niri Documentation**: https://github.com/YaLTeR/niri
- **Niri Keybindings**: See `~/.config/niri/config.kdl`
- **SwayOSD Configuration**: See `~/.config/swayosd/README.md`

## Next Steps

1. ✓ Install SwayOSD (if not already installed)
2. ✓ Update niri/config.kdl with keybindings
3. ✓ Reload Niri configuration
4. ✓ Test volume/brightness controls
5. ✓ Customize styling if desired (see README.md)

## Support

For issues or questions:
- Check SwayOSD GitHub: https://github.com/ErikReider/SwayOSD/issues
- Check Niri GitHub: https://github.com/YaLTeR/niri/issues
- Review configuration files in `~/.config/swayosd/`
