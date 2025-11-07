#!/bin/bash
set -euo pipefail

# Script: wifi_toggle
# Purpose: Toggle WiFi and display OSD feedback
# Dependencies: nmcli, swayosd-client

# Toggle WiFi using nmcli
nmcli radio wifi toggle

# Display WiFi OSD via SwayOSD (if available)
if command -v swayosd-client &> /dev/null; then
  swayosd-client --output-volume=+0
fi
