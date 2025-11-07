#!/bin/bash
set -euo pipefail

# Script: bluetooth_toggle
# Purpose: Toggle Bluetooth and display OSD feedback
# Dependencies: bluetoothctl, swayosd-client

# Get current Bluetooth status
BLUETOOTH_STATUS=$(bluetoothctl show | grep "Powered:" | awk '{print $2}')

# Toggle Bluetooth
if [ "$BLUETOOTH_STATUS" = "yes" ]; then
  echo "Turning off Bluetooth..."
  bluetoothctl power off
else
  echo "Turning on Bluetooth..."
  bluetoothctl power on
fi

# Display Bluetooth OSD via SwayOSD (if available)
if command -v swayosd-client &> /dev/null; then
  swayosd-client --output-volume=+0
fi
