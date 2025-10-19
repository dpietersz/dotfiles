#!/bin/bash
# Setup script for base-applications-toolbox distrobox container
# This script installs yay and AUR packages inside the container

set -e

echo "🔧 Setting up base-applications-toolbox..."

# Check if we're inside the container
if [ -z "$CONTAINER_ID" ]; then
    echo "⚠️  This script should be run inside the base-applications-toolbox container"
    echo "Run: distrobox enter base-applications-toolbox"
    exit 1
fi

# Install yay if not already installed
if ! command -v yay &> /dev/null; then
    echo "📦 Installing yay AUR helper..."
    cd /tmp
    git clone https://aur.archlinux.org/yay.git
    cd yay
    makepkg -si --noconfirm
    cd /tmp
    rm -rf yay
    echo "✅ yay installed successfully"
else
    echo "✅ yay is already installed"
fi

# Install AUR packages
echo "📦 Installing AUR packages..."
yay -S --noconfirm --needed \
    beekeeper-studio \
    storageexplorer \
    teams-for-linux \
    zen-browser-bin \
    legcord \
    obs-studio-git \
    bruno-bin \
    polypane \
    anytype-bin \
    vivaldi-snapshot \
    vivaldi-snapshot-ffmpeg-codecs \
    cursor-bin

# Clean up
echo "🧹 Cleaning up package cache..."
sudo pacman -Scc --noconfirm

echo "✅ base-applications-toolbox setup complete!"
echo ""
echo "💡 You can now export applications to your host:"
echo "   distrobox-export --app zen-browser"
echo "   distrobox-export --app beekeeper-studio"
echo "   distrobox-export --app teams-for-linux"

