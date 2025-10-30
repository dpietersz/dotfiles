# Kanshi Configuration

Kanshi is a Wayland display configuration daemon that automatically switches between monitor profiles based on which outputs are connected. This is perfect for working with different external monitors in different locations.

## Overview

Your Kanshi setup includes profiles for:

1. **Home Setup** - Home monitor (2560x1440) at top, laptop screen (1920x1080) below
2. **Work Setup** - Work monitor (1920x1080) at top, laptop screen (1920x1080) below
3. **Portable Monitor - Right** - Portable monitor on the right side
4. **Portable Monitor - Left** - Portable monitor on the left side
5. **Portable Monitor - Top** - Portable monitor at the top
6. **Laptop Only** - Just the laptop screen

## How Kanshi Works

Kanshi automatically activates profiles based on which monitors are connected:

- When your home monitor is connected → `home` profile activates
- When your work monitor is connected → `work` profile activates
- When your portable monitor is connected → One of the portable profiles activates
- When no external monitors are connected → `laptop-only` profile activates

## Configuration File Location

```
~/.config/kanshi/config
```

## Monitor Output Names

Your current monitors are:

| Monitor | Output Name | Resolution |
|---------|------------|------------|
| Laptop Screen | `BOE 0x06DD Unknown` | 1920x1080 |
| External Monitor | `LG Electronics LG HDR WQHD 107NTNH4K559` | 2560x1440 (home) / 1920x1080 (work) |
| Portable Monitor | `PORTABLE_MONITOR_NAME` | 1920x1080 |

### Finding Your Portable Monitor's Output Name

When you connect your portable monitor for the first time, run:

```bash
niri msg outputs
```

This will show all connected monitors with their output names. Look for the new monitor and update the `PORTABLE_MONITOR_NAME` placeholder in the config file with the actual output name.

## Updating the Configuration

### For Your Portable Monitor

1. Connect your portable monitor
2. Run `niri msg outputs` to find its output name
3. Edit `~/.config/kanshi/config` and replace `PORTABLE_MONITOR_NAME` with the actual name
4. Kanshi will automatically reload the configuration

### For Different Resolutions

If you want to use different resolutions or refresh rates, edit the `mode` directive in each profile:

```
output "Monitor Name" {
  mode 1920x1080@60    # Width x Height @ Refresh Rate
  position 0,0         # X,Y coordinates
  scale 1              # Scaling factor (1 = 100%)
}
```

### For Different Positions

The `position` directive uses pixel coordinates. For example:

- `position 0,0` - Top-left corner
- `position 1920,0` - To the right of a 1920px wide monitor
- `position 0,1080` - Below a 1080px tall monitor

## Manual Profile Switching

If Kanshi doesn't automatically switch profiles (rare), you can manually reload the configuration:

```bash
# Reload Kanshi configuration
killall -HUP kanshi

# Or restart Kanshi
systemctl --user restart kanshi
```

## Enabling Kanshi at Startup

Kanshi should be started automatically by your system. To verify it's running:

```bash
systemctl --user status kanshi
```

To enable it to start on boot:

```bash
systemctl --user enable kanshi
```

## Troubleshooting

### Kanshi not switching profiles

1. Check if Kanshi is running:
   ```bash
   pgrep kanshi
   ```

2. Check Kanshi logs:
   ```bash
   journalctl --user -u kanshi -f
   ```

3. Verify your monitor output names match exactly:
   ```bash
   niri msg outputs
   ```

### Monitor not detected

1. Ensure the monitor is properly connected
2. Run `niri msg outputs` to see if it appears
3. Check the output name and update the config if needed

### Resolution not changing

1. Verify the resolution is available for your monitor:
   ```bash
   niri msg outputs
   ```
   Look for "Available modes" for your monitor

2. Update the `mode` directive with a supported resolution

## Advanced Configuration

### Adding Refresh Rate

If you want a specific refresh rate:

```
mode 2560x1440@144    # 144 Hz refresh rate
```

### Scaling

For high-DPI displays, you can scale the output:

```
output "Monitor Name" {
  mode 2560x1440@60
  scale 1.5            # 150% scaling
}
```

### Rotation

To rotate a monitor:

```
output "Monitor Name" {
  mode 1920x1080@60
  transform 90         # Options: 90, 180, 270, normal
}
```

## References

- [Kanshi GitHub](https://github.com/emersion/kanshi)
- [Kanshi Manual](https://man.archlinux.org/man/kanshi.5.en)
- [Niri Output Configuration](https://github.com/YaLTeR/niri/wiki/Configuration:-Outputs)
