#!/usr/bin/env bash
set -e

echo "🚀 Setting up base-applications-toolbox (Fedora 41)..."

# Install applications from repositories
echo "📦 Installing applications from DNF/COPR repositories..."
dnf install -y beekeeper-studio || echo "⚠️  Failed to install beekeeper-studio"
dnf install -y obs-studio || echo "⚠️  Failed to install obs-studio"
dnf install -y vivaldi-snapshot || echo "⚠️  Failed to install vivaldi-snapshot"
dnf install -y zen-browser || echo "⚠️  Failed to install zen-browser"
dnf install -y zed || echo "⚠️  Failed to install zed"
dnf install -y bruno || echo "⚠️  Failed to install bruno"
dnf install -y obsidian || echo "⚠️  Failed to install obsidian"

# Create directory for AppImages
echo "📁 Creating AppImage directory..."
mkdir -p ~/.local/bin/appimages

# Download AppImages
echo "⬇️  Downloading AppImage applications..."

# Cursor AI Editor
echo "  - Downloading Cursor..."
wget -q --show-progress -O ~/.local/bin/appimages/cursor.AppImage 'https://downloader.cursor.sh/linux/appImage/x64' || echo "⚠️  Failed to download Cursor"
chmod +x ~/.local/bin/appimages/cursor.AppImage 2>/dev/null || true

# Legcord (Discord client)
echo "  - Downloading Legcord..."
LEGCORD_URL=$(curl -s https://api.github.com/repos/Legcord/Legcord/releases/latest | grep browser_download_url | grep AppImage | cut -d : -f 2,3 | tr -d '"' | tr -d ' ' | head -1)
if [ -n "$LEGCORD_URL" ]; then
    wget -q --show-progress -O ~/.local/bin/appimages/legcord.AppImage "$LEGCORD_URL" || echo "⚠️  Failed to download Legcord"
    chmod +x ~/.local/bin/appimages/legcord.AppImage 2>/dev/null || true
else
    echo "⚠️  Could not find Legcord download URL"
fi

# Polypane
echo "  - Downloading Polypane..."
wget -q --show-progress -O ~/.local/bin/appimages/polypane.AppImage 'https://app.polypane.app/download/linux/x64' || echo "⚠️  Failed to download Polypane"
chmod +x ~/.local/bin/appimages/polypane.AppImage 2>/dev/null || true

# Anytype
echo "  - Downloading Anytype..."
ANYTYPE_URL=$(curl -s https://api.github.com/repos/anyproto/anytype-ts/releases/latest | grep browser_download_url | grep AppImage | cut -d : -f 2,3 | tr -d '"' | tr -d ' ' | head -1)
if [ -n "$ANYTYPE_URL" ]; then
    wget -q --show-progress -O ~/.local/bin/appimages/anytype.AppImage "$ANYTYPE_URL" || echo "⚠️  Failed to download Anytype"
    chmod +x ~/.local/bin/appimages/anytype.AppImage 2>/dev/null || true
else
    echo "⚠️  Could not find Anytype download URL"
fi

# Export applications to host
echo "📤 Exporting applications to host..."
distrobox-export --app beekeeper-studio 2>/dev/null || echo "⚠️  Failed to export beekeeper-studio"
distrobox-export --app zen-browser 2>/dev/null || echo "⚠️  Failed to export zen-browser"
distrobox-export --app com.obsproject.Studio 2>/dev/null || echo "⚠️  Failed to export OBS Studio"
distrobox-export --app bruno 2>/dev/null || echo "⚠️  Failed to export bruno"
distrobox-export --app vivaldi-snapshot 2>/dev/null || echo "⚠️  Failed to export vivaldi-snapshot"
distrobox-export --app zed 2>/dev/null || echo "⚠️  Failed to export zed"
distrobox-export --app obsidian 2>/dev/null || echo "⚠️  Failed to export obsidian"
distrobox-export --app emacs 2>/dev/null || echo "⚠️  Failed to export emacs"

# Export AppImages
echo "📤 Exporting AppImage applications..."
if [ -f ~/.local/bin/appimages/cursor.AppImage ]; then
    distrobox-export --bin ~/.local/bin/appimages/cursor.AppImage --export-path ~/.local/bin 2>/dev/null || echo "⚠️  Failed to export Cursor"
fi

if [ -f ~/.local/bin/appimages/legcord.AppImage ]; then
    distrobox-export --bin ~/.local/bin/appimages/legcord.AppImage --export-path ~/.local/bin 2>/dev/null || echo "⚠️  Failed to export Legcord"
fi

if [ -f ~/.local/bin/appimages/polypane.AppImage ]; then
    distrobox-export --bin ~/.local/bin/appimages/polypane.AppImage --export-path ~/.local/bin 2>/dev/null || echo "⚠️  Failed to export Polypane"
fi

if [ -f ~/.local/bin/appimages/anytype.AppImage ]; then
    distrobox-export --bin ~/.local/bin/appimages/anytype.AppImage --export-path ~/.local/bin 2>/dev/null || echo "⚠️  Failed to export Anytype"
fi

echo "✅ Setup complete!"
echo ""
echo "📝 Note: teams-for-linux and Azure Storage Explorer are Snap-only."
echo "   Install them on the host with:"
echo "   flatpak install flathub com.github.IsmaelMartinez.teams_for_linux"
echo "   flatpak install flathub com.microsoft.AzureStorageExplorer"

