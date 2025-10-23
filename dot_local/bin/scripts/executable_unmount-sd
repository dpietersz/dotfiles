#!/bin/bash

MOUNT_POINT="/mnt/sdcard"

if mountpoint -q "$MOUNT_POINT"; then
    echo "Unmounting $MOUNT_POINT..."
    sudo umount "$MOUNT_POINT" && echo "SD card unmounted successfully."
else
    echo "SD card is not mounted at $MOUNT_POINT."
fi

