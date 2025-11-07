#!/bin/bash
set -euo pipefail

# Script: wifi_toggle
# Purpose: Toggle WiFi and display OSD feedback
# Dependencies: nmcli, swayosd-client, notify-send

# Get current WiFi status
WIFI_STATUS=$(nmcli radio wifi)

# Toggle WiFi using nmcli
nmcli radio wifi toggle

# Determine new status
if [ "$WIFI_STATUS" = "enabled" ]; then
  STATUS="WiFi OFF"
else
  STATUS="WiFi ON"
fi

# Display WiFi OSD via SwayOSD (if available)
# Use output-volume to show the OSD with status message
if command -v swayosd-client &> /dev/null; then
  swayosd-client --output-volume=+0
fi

# Also send a notification for clarity
if command -v notify-send &> /dev/null; then
  notify-send -u low -t 2000 "WiFi" "$STATUS"
fi
