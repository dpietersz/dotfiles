#!/bin/bash

# The value to be copied to the clipboard
VALUE="/Repos/d.pietersz@hilversum.nl/Lakehouse/azure-databricks/notebooks"

# Function to copy to clipboard on macOS
copy_to_clipboard_macos() {
    echo -n "$VALUE" | pbcopy
}

# Function to copy to clipboard on Linux
copy_to_clipboard_linux() {
    # echo -n "$VALUE" | xclip -selection clipboard
    echo -n "$VALUE" | wl-copy

}

# Determine the OS and copy to clipboard using the appropriate method
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    copy_to_clipboard_macos
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xclip &>/dev/null; then
        copy_to_clipboard_linux
    else
        echo "xclip is not installed. Please install it using your package manager."
        exit 1
    fi
else
    echo "Unsupported OS"
    exit 1
fi
