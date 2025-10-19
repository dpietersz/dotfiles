#!/bin/bash
# Setup script for base-applications-toolbox distrobox container
# This script installs any missing AUR packages that weren't available in Chaotic-AUR
# Most packages should already be installed via Chaotic-AUR during container creation

set -e

echo "🔧 Checking base-applications-toolbox setup..."

# Check if we're inside the container
if [ -z "$CONTAINER_ID" ]; then
    echo "⚠️  This script should be run inside the base-applications-toolbox container"
    echo "Run: distrobox enter base-applications-toolbox"
    exit 1
fi

# List of packages that should be installed
PACKAGES=(
    "beekeeper-studio"
    "storageexplorer"
    "teams-for-linux"
    "zen-browser-bin"
    "legcord"
    "obs-studio-git"
    "bruno-bin"
    "polypane"
    "anytype-bin"
    "vivaldi-snapshot"
    "vivaldi-snapshot-ffmpeg-codecs"
    "cursor-bin"
)

# Check which packages are missing
MISSING_PACKAGES=()
for pkg in "${PACKAGES[@]}"; do
    if ! pacman -Q "$pkg" &> /dev/null; then
        MISSING_PACKAGES+=("$pkg")
    fi
done

if [ ${#MISSING_PACKAGES[@]} -eq 0 ]; then
    echo "✅ All packages are already installed!"
    echo ""
    echo "💡 You can now export applications to your host:"
    echo "   distrobox-export --app zen-browser"
    echo "   distrobox-export --app beekeeper-studio"
    echo "   distrobox-export --app teams-for-linux"
    exit 0
fi

echo "📦 Found ${#MISSING_PACKAGES[@]} missing packages: ${MISSING_PACKAGES[*]}"
echo "   Installing via yay..."

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
fi

# Install missing packages
echo "📦 Installing missing AUR packages..."
yay -S --noconfirm --needed "${MISSING_PACKAGES[@]}"

# Clean up
echo "🧹 Cleaning up package cache..."
sudo pacman -Scc --noconfirm

echo "✅ base-applications-toolbox setup complete!"
echo ""
echo "💡 You can now export applications to your host:"
echo "   distrobox-export --app zen-browser"
echo "   distrobox-export --app beekeeper-studio"
echo "   distrobox-export --app teams-for-linux"

