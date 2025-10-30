# Kanshi Quick Start Guide

## Installation

Kanshi will be installed automatically when you run `chezmoi apply` via the installation script.

## Your Monitor Setup

### Current Monitors
- **Laptop**: `BOE 0x06DD Unknown` (1920x1080)
- **Home Monitor**: `LG Electronics LG HDR WQHD 107NTNH4K559` (2560x1440)
- **Work Monitor**: Same as home monitor, but configured for 1920x1080
- **Portable Monitor**: To be configured (1920x1080)

### Available Profiles

| Profile | Setup | When It Activates |
|---------|-------|-------------------|
| `home` | Home monitor (2560x1440) at top, laptop below | Home monitor connected |
| `work` | Work monitor (1920x1080) at top, laptop below | Work monitor connected |
| `portable-right` | Portable on right, laptop on left | Portable monitor connected |
| `portable-left` | Portable on left, laptop on right | Portable monitor connected |
| `portable-top` | Portable at top, laptop below | Portable monitor connected |
| `laptop-only` | Just laptop screen | No external monitors |

## First Steps

### 1. Verify Kanshi is Running
```bash
systemctl --user status kanshi
```

### 2. Check Your Monitors
```bash
niri msg outputs
```

### 3. For Portable Monitor Setup
When you connect your portable monitor:

```bash
# Find the monitor name
kanshi-setup find

# Update the config with the actual name
kanshi-setup update "YOUR_MONITOR_NAME"
```

## Monitor Positioning Reference

Your current setup uses these positions:

### Home Profile
```
Home Monitor (2560x1440)
     ↓
  [0,0] ← top-left corner

Laptop (1920x1080)
     ↓
[320,1440] ← centered below home monitor
```

### Work Profile
```
Work Monitor (1920x1080)
     ↓
  [0,0] ← top-left corner

Laptop (1920x1080)
     ↓
  [0,1080] ← directly below work monitor
```

## Customization

### Change Resolution
Edit `~/.config/kanshi/config` and change the `mode` line:

```
output "Monitor Name" {
  mode 1920x1080@60    # Change this
  position 0,0
}
```

### Change Position
Update the `position` line with X,Y coordinates:

```
output "Monitor Name" {
  mode 1920x1080@60
  position 100,200     # Change this (X,Y)
}
```

### Add Scaling
For high-DPI monitors:

```
output "Monitor Name" {
  mode 2560x1440@60
  position 0,0
  scale 1.5            # Add this line
}
```

## Troubleshooting

### Kanshi not switching profiles
```bash
# Check if running
pgrep kanshi

# View logs
journalctl --user -u kanshi -f

# Restart
systemctl --user restart kanshi
```

### Monitor not detected
1. Physically check the connection
2. Run `niri msg outputs` to see if it appears
3. Check the output name matches exactly in the config

### Wrong resolution
1. Check available modes: `niri msg outputs`
2. Update the `mode` line with a supported resolution
3. Reload: `killall -HUP kanshi`

## Helper Commands

```bash
# List all monitors
kanshi-setup list

# Find portable monitor
kanshi-setup find

# Update portable monitor name
kanshi-setup update "Monitor Name"

# Show current config
kanshi-setup show

# Validate config
kanshi-setup validate

# Reload Kanshi
killall -HUP kanshi
```

## Next Steps

1. ✅ Kanshi is installed
2. ⏳ Connect your portable monitor
3. 🔧 Run `kanshi-setup find` to get its name
4. 📝 Run `kanshi-setup update "name"` to configure it
5. 🎉 Kanshi will automatically switch profiles!

## Need Help?

- Full documentation: `~/.config/kanshi/README.md`
- Kanshi manual: `man kanshi`
- Niri outputs: `niri msg outputs`
