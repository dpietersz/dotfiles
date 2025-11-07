# SwayOSD Configuration

This directory contains the configuration for **SwayOSD**, a GTK-based on-screen display (OSD) for Wayland compositors like Sway and Niri. SwayOSD displays visual feedback for volume, brightness, microphone, and other system controls.

## Files

- **`style.css`** - CSS styling for the OSD appearance (Gruvbox/Nord themed)
- **`README.md`** - This documentation file

## Configuration Overview

### Display Settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Duration** | 2000ms (2 seconds) | OSD remains visible for 2 seconds after last action |
| **Position** | Top-center | OSD appears at the top-center of the primary monitor |
| **Theme** | Gruvbox Dark + Nord | Matches the rest of the dotfiles color scheme |
| **Transparency** | 92% opaque | Slightly transparent background for visibility |
| **Border** | 2px Nord Frost | Subtle blue border for visual definition |

### Color Scheme

The configuration uses a combination of **Gruvbox Dark** and **Nord** color palettes:

#### Base Colors
- **Background**: `#282828` (Gruvbox Dark)
- **Text**: `#ebdbb2` (Gruvbox Light)
- **Faded Text**: `#a89985` (Gruvbox Faded)

#### Accent Colors by Function
- **Volume**: `#88c0d0` (Nord Frost 2 - Blue)
- **Mute**: `#bf616a` (Nord Aurora Red)
- **Microphone**: `#a3be8c` (Nord Aurora Green)
- **Brightness**: `#ebcb8b` (Nord Aurora Yellow)
- **Caps Lock**: `#d08770` (Nord Aurora Orange)

## Features Configured

### 1. Volume Indicator
- **Icon**: Speaker icon with volume percentage
- **Progress Bar**: Blue bar showing volume level (0-100%)
- **Muted State**: Red icon and faded appearance when muted
- **Color**: Nord Frost 2 (Blue) - `#88c0d0`

### 2. Mute Indicator
- **Icon**: Muted speaker icon
- **Color**: Nord Aurora Red - `#bf616a`
- **State**: Disabled/grayed out when audio is not muted

### 3. Microphone Indicator
- **Icon**: Microphone icon
- **Color**: Nord Aurora Green - `#a3be8c` (normal)
- **Muted Color**: Nord Aurora Red - `#bf616a` (when muted)
- **Percentage Display**: Shows input volume level

### 4. Brightness Indicator
- **Icon**: Sun/brightness icon
- **Progress Bar**: Yellow bar showing brightness level
- **Color**: Nord Aurora Yellow - `#ebcb8b`
- **Range**: 0-100% brightness

## Usage with Niri

To use SwayOSD with Niri, add the following to your `niri/config.kdl`:

### 1. Start SwayOSD Server

Add to the top of your config (before keybindings):

```kdl
spawn-at-startup "swayosd-server"
```

### 2. Add Keybindings

Add these keybindings to the `binds` section:

```kdl
// Volume controls
XF86AudioRaiseVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "raise"; 
}
XF86AudioLowerVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "lower"; 
}
XF86AudioMute allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "mute-toggle"; 
}

// Microphone controls
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

### 3. Advanced Options

You can customize the behavior with additional flags:

```bash
# Set custom volume increment (default is 5%)
swayosd-client --output-volume raise --max-volume 100

# Set specific device (if multiple audio devices)
swayosd-client --output-volume raise --device alsa_output.pci-0000_11_00.4.analog-stereo

# Show OSD on specific monitor
swayosd-client --monitor "HDMI-1" --output-volume raise

# Custom timeout (in milliseconds)
swayosd-client --output-volume raise --timeout 2000
```

## Styling Details

### Progress Bars
- **Height**: 8px
- **Border Radius**: 4px (rounded corners)
- **Background Track**: Nord Frost with 25% opacity
- **Filled Portion**: Solid color based on function (blue for volume, yellow for brightness, etc.)

### Icons
- **Size**: 32x32 pixels
- **Color**: Matches the function (blue for volume, green for microphone, etc.)
- **Disabled State**: Red color with reduced opacity when muted/disabled

### Window
- **Border Radius**: 12px (rounded corners)
- **Border**: 2px Nord Frost with 40% opacity
- **Padding**: 16px vertical, 24px horizontal
- **Top Margin**: 20px (for top-center positioning)
- **Minimum Size**: 250px wide × 80px tall

### Transitions
- **Duration**: 150ms
- **Easing**: ease-out
- Smooth animations for state changes

## Timeout Configuration

The OSD display timeout is set to **2000ms (2 seconds)**. This can be configured in multiple ways:

### 1. Via SwayOSD Server Config (if available)
Some SwayOSD versions support a server configuration file. Check the SwayOSD documentation for your version.

### 2. Via Command-Line Arguments
Add `--timeout 2000` to the `swayosd-client` command:

```bash
swayosd-client --output-volume raise --timeout 2000
```

### 3. Via Niri Keybindings
Modify the keybindings to include the timeout:

```kdl
XF86AudioRaiseVolume allow-when-locked=true { 
  spawn "swayosd-client" "--output-volume" "raise" "--timeout" "2000"; 
}
```

### 4. Default Timeout
If not specified, SwayOSD uses its internal default (typically 1-2 seconds).

## Position Configuration

The OSD appears at the **top-center** of the screen by default. This is controlled by:

1. **SwayOSD Internal Logic**: SwayOSD automatically centers the OSD horizontally
2. **CSS Margin**: The `margin: 20px 0 0 0;` in `style.css` adds 20px top margin
3. **Window Manager**: Niri/Sway positioning

To change the position, you would need to:
- Modify the CSS margins in `style.css`
- Or use SwayOSD's command-line options (if available)
- Or modify the SwayOSD source code

## Installation

SwayOSD is installed via the dotfiles setup script:

```bash
# On Bluefin (rpm-ostree)
sudo rpm-ostree install swayosd

# On Fedora (dnf)
sudo dnf install swayosd

# On Debian/Ubuntu
sudo apt install swayosd

# On Arch Linux
sudo pacman -S swayosd
```

After installation, the configuration in this directory will be automatically loaded.

## Troubleshooting

### OSD Not Appearing
1. Ensure `swayosd-server` is running: `pgrep swayosd-server`
2. Start it manually: `swayosd-server &`
3. Check that keybindings are correctly configured in niri/config.kdl

### Styling Not Applied
1. Ensure `style.css` exists at `~/.config/swayosd/style.css`
2. Restart SwayOSD server: `pkill swayosd-server && swayosd-server &`
3. Check SwayOSD version supports CSS styling (v0.2.0+)

### Timeout Too Short/Long
1. Modify the `--timeout` parameter in keybindings
2. Or check SwayOSD server configuration
3. Default is typically 1-2 seconds

### Colors Not Matching
1. Verify `style.css` is in the correct location
2. Check that GTK theme is compatible with CSS variables
3. Try restarting the SwayOSD server

## References

- **SwayOSD GitHub**: https://github.com/ErikReider/SwayOSD
- **Gruvbox Color Scheme**: https://github.com/morhetz/gruvbox
- **Nord Color Scheme**: https://www.nordtheme.com/
- **GTK CSS Documentation**: https://docs.gtk.org/gtk4/css-overview.html

## Notes

- This configuration is **local-only** and only applies to the local desktop environment
- SwayOSD requires a Wayland compositor (Sway, Niri, Hyprland, etc.)
- The configuration is automatically loaded by SwayOSD on startup
- No additional setup is required beyond installing SwayOSD and starting the server

## Future Enhancements

Potential improvements to consider:

1. **Custom Timeout Script**: Create a wrapper script to set custom timeouts per action
2. **Per-Monitor Configuration**: Configure OSD to appear on specific monitors
3. **Animation Effects**: Add custom animations for OSD appearance/disappearance
4. **Volume Increment Customization**: Set different increments for different keys
5. **Brightness Curve**: Configure brightness control curve for specific hardware
