#!/bin/bash

set -euo pipefail

# Get current active profile
get_active_profile() {
    dbus-send --system --print-reply --dest=net.hadess.PowerProfiles /net/hadess/PowerProfiles \
        org.freedesktop.DBus.Properties.Get string:net.hadess.PowerProfiles string:ActiveProfile 2>/dev/null | \
        grep -oP 'string "\K[^"]+' || echo "balanced"
}

# Get all available profiles
get_profiles() {
    dbus-send --system --print-reply --dest=net.hadess.PowerProfiles /net/hadess/PowerProfiles \
        org.freedesktop.DBus.Properties.Get string:net.hadess.PowerProfiles string:Profiles 2>/dev/null | \
        grep 'string "Profile"' -A 1 | grep 'variant' | grep -oP 'string "\K[^"]+' || echo -e "power-saver\nbalanced\nperformance"
}

# Set profile
set_profile() {
    local profile="$1"
    dbus-send --system --dest=net.hadess.PowerProfiles /net/hadess/PowerProfiles \
        org.freedesktop.DBus.Properties.Set string:net.hadess.PowerProfiles string:ActiveProfile variant:string:"$profile" 2>/dev/null || true
}

# Get icon for profile
get_icon() {
    case "$1" in
        power-saver)
            echo ""
            ;;
        balanced)
            echo ""
            ;;
        performance)
            echo ""
            ;;
        *)
            echo ""
            ;;
    esac
}

# Main logic
current_profile=$(get_active_profile)
icon=$(get_icon "$current_profile")

# Check if this is a click event (cycle to next profile)
if [[ "${1:-}" == "cycle" ]]; then
    profiles=($(get_profiles))
    current_index=0
    
    for i in "${!profiles[@]}"; do
        if [[ "${profiles[$i]}" == "$current_profile" ]]; then
            current_index=$i
            break
        fi
    done
    
    # Calculate next profile index
    next_index=$(( (current_index + 1) % ${#profiles[@]} ))
    next_profile="${profiles[$next_index]}"
    
    set_profile "$next_profile"
    current_profile="$next_profile"
    icon=$(get_icon "$current_profile")
fi

# Output for waybar (JSON format)
echo "{\"text\": \"$icon $current_profile\", \"class\": \"$current_profile\"}"

