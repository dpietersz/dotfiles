#!/bin/bash

AIRPODS_MAC="68:CA:C4:EC:2D:71"
DEVICE_NAME="Dimitri’s AirPods Pro"

echo "📡 Connecting to $DEVICE_NAME..."

bluetoothctl power on
bluetoothctl agent on
bluetoothctl default-agent

# Wait a second before reconnect
sleep 1

bluetoothctl connect "$AIRPODS_MAC"

echo "🎧 Done. Check your sound settings if needed."

