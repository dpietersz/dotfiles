#!/bin/bash

# Try to get GPU temperature from various possible paths
GPU_TEMP_PATH=""
for path in /sys/class/drm/card0/device/hwmon/hwmon*/temp1_input /sys/class/hwmon/hwmon*/temp1_input; do
    if [ -f "$path" ]; then
        GPU_TEMP_PATH="$path"
        break
    fi
done

if [ -z "$GPU_TEMP_PATH" ]; then
    # Fallback if no temp sensor found
    echo '{"text": "  N/A", "class": "custom-gpu", "tooltip": "GPU temp not available"}'
else
    raw_temp=$(cat "$GPU_TEMP_PATH" 2>/dev/null)
    if [ -z "$raw_temp" ]; then
        temperature="N/A"
    else
        temperature=$(($raw_temp/1000))
    fi

    deviceinfo=$(glxinfo -B 2>/dev/null | grep 'Device:' | sed 's/^.*: //' || echo "Unknown")
    driverinfo=$(glxinfo -B 2>/dev/null | grep "OpenGL version" || echo "Unknown")

    echo '{"text": "  '$temperature'°C", "class": "custom-gpu", "tooltip": "<b>'$deviceinfo'</b>\n'$driverinfo'"}'
fi

