# Niri Monitor Handler

Automatically adjusts monitor positioning when displays connect/disconnect.

## Overview

This script monitors your display configuration and automatically updates the eDP-1 (laptop screen) position when the LG external monitor is disconnected. This ensures you can always see your laptop screen, whether the LG monitor is connected or not.

## How It Works

### Configuration

Your Niri config specifies:
- **With LG connected**: LG at [0,0], eDP-1 centered below at [760,1440]
- **Without LG**: eDP-1 should be at [0,0]

### Script Behavior

The monitor handler runs continuously and:
1. Checks every 5 seconds if the LG monitor is connected
2. Detects when the LG monitor disconnects
3. Automatically updates eDP-1 position from [760,1440] to [0,0]
4. Reloads the Niri configuration to apply changes

### Scenarios

**Scenario 1: LG Monitor Connected**
```
LG at [0,0]
eDP-1 at [760,1440] (centered below)
✓ Both displays visible
```

**Scenario 2: LG Monitor Disconnected**
```
Script detects disconnection
Updates eDP-1 position to [0,0]
✓ Laptop screen visible at correct position
```

## Installation

The script is automatically installed via chezmoi:

```bash
chezmoi apply
```

This creates:
- `~/.local/bin/scripts/niri-monitor-handler` - The monitoring script
- `~/.config/systemd/user/niri-monitor-handler.service` - Systemd service

## Usage

### Manual Start

```bash
# Run the script directly
~/.local/bin/scripts/niri-monitor-handler

# Or via systemctl
systemctl --user start niri-monitor-handler
```

### Enable at Startup

```bash
# Enable the service to start automatically
systemctl --user enable niri-monitor-handler

# Start it now
systemctl --user start niri-monitor-handler
```

### Check Status

```bash
# Check if service is running
systemctl --user status niri-monitor-handler

# View logs
journalctl --user -u niri-monitor-handler -f

# View detailed logs
cat /run/user/$(id -u)/niri-monitor-handler.log
```

### Stop the Service

```bash
systemctl --user stop niri-monitor-handler
```

## Configuration

The script reads from your Niri config at:
```
~/.config/niri/config.kdl
```

It automatically detects:
- LG monitor connection status
- eDP-1 current position
- When position needs updating

## Troubleshooting

### Script Not Detecting Monitor Changes

1. Check if the script is running:
   ```bash
   systemctl --user status niri-monitor-handler
   ```

2. View the logs:
   ```bash
   journalctl --user -u niri-monitor-handler -f
   ```

3. Manually check monitor status:
   ```bash
   niri msg outputs
   ```

### Position Not Updating

1. Check the current config:
   ```bash
   grep -A 5 'output "eDP-1"' ~/.config/niri/config.kdl
   ```

2. Check the logs for errors:
   ```bash
   journalctl --user -u niri-monitor-handler -f
   ```

3. Try manually updating:
   ```bash
   # Edit the config manually
   nano ~/.config/niri/config.kdl
   
   # Reload Niri
   niri msg action reload-config
   ```

### Niri Not Reloading Config

If the script updates the config but Niri doesn't reload:

1. Check if Niri is running:
   ```bash
   pgrep niri
   ```

2. Try manual reload:
   ```bash
   niri msg action reload-config
   ```

3. Or restart Niri:
   ```bash
   pkill niri
   niri &
   ```

## Performance

- **CPU**: Minimal - only checks every 5 seconds
- **Memory**: ~5-10 MB for the script
- **Disk**: Only writes to config when changes are needed

## Limitations

- Only monitors LG monitor connection (can be extended for other monitors)
- Requires Niri to be running
- Position updates require Niri config reload (automatic)

## Future Enhancements

Possible improvements:
- Support for multiple external monitors
- Configurable check interval
- Custom position presets for different scenarios
- GUI for manual position adjustment
- Integration with other display managers

## References

- [Niri Configuration: Outputs](https://github.com/YaLTeR/niri/wiki/Configuration:-Outputs)
- [Niri IPC Documentation](https://github.com/YaLTeR/niri/wiki/IPC)
- [Systemd User Services](https://wiki.archlinux.org/title/Systemd/User)
