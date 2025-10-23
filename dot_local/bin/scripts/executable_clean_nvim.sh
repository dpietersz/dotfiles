#!/bin/bash

# Define Neovim cache and data directories
NVIM_STATE_DIR="$HOME/.local/state/nvim"
NVIM_DATA_DIR="$HOME/.local/share/nvim"
NVIM_CACHE_DIR="$HOME/.cache/nvim"

# Function to remove a directory if it exists
clean_directory() {
    local dir=$1
    if [ -d "$dir" ]; then
        echo "Cleaning $dir"
        rm -rf "$dir"
        echo "✓ Cleaned $dir"
    else
        echo "Directory $dir does not exist, skipping..."
    fi
}

echo "Starting Neovim cleanup..."

# Clean Neovim state, cache, and data directories
clean_directory "$NVIM_STATE_DIR"
clean_directory "$NVIM_DATA_DIR"
clean_directory "$NVIM_CACHE_DIR"

echo "✓ Neovim cleanup complete. Your configuration symlink is preserved."
echo "→ Start Neovim to reinstall plugins and rebuild cache."
