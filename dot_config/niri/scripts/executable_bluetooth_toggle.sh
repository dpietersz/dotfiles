#!/bin/bash
set -euo pipefail

# Script: bluetooth_toggle
# Purpose: Toggle Bluetooth and display OSD feedback
# Dependencies: bluetoothctl, swayosd-client, notify-send

# Get current Bluetooth status
BLUETOOTH_STATUS=$(bluetoothctl show | grep "Powered:" | awk '{print $2}')

# Toggle Bluetooth
if [ "$BLUETOOTH_STATUS" = "yes" ]; then
  echo "Turning off Bluetooth..."
  bluetoothctl power off
  STATUS="Bluetooth OFF"
else
  echo "Turning on Bluetooth..."
  bluetoothctl power on
  STATUS="Bluetooth ON"
fi

# Display Bluetooth OSD via SwayOSD (if available)
# Use output-volume to show the OSD with status message
if command -v swayosd-client &> /dev/null; then
  swayosd-client --output-volume=+0
fi

# Also send a notification for clarity
if command -v notify-send &> /dev/null; then
  notify-send -u low -t 2000 "Bluetooth" "$STATUS"
fi
