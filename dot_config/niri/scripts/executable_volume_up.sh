#!/bin/bash
set -euo pipefail

# Script: volume_up
# Purpose: Increase volume by 5% and display OSD feedback
# Dependencies: wpctl, swayosd-client, canberra-gtk-play

# Increase volume by 5%
wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.05+

# Display volume OSD via SwayOSD (if available)
if command -v swayosd-client &> /dev/null; then
  swayosd-client --output-volume
fi

# Play volume change sound in background
canberra-gtk-play -i audio-volume-change &
