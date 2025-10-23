#!/bin/bash

DEVICE="/dev/sda1"           # Replace with the actual device if different
MOUNT_POINT="/mnt/sdcard"

# Check if already mounted
if mountpoint -q "$MOUNT_POINT"; then
    echo "SD card is already mounted at $MOUNT_POINT."
    exit 0
fi

# Mount the device
echo "Mounting $DEVICE to $MOUNT_POINT..."
sudo mount "$DEVICE" "$MOUNT_POINT" && echo "Mounted successfully."

