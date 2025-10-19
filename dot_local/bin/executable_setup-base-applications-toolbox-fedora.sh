#!/usr/bin/env bash
# User-level setup for base-applications-toolbox (runs as container user)
# Package installation happens in pre_init_hooks as root
set -e

echo "🚀 Setting up base-applications-toolbox user environment..."

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
echo "  - Exporting beekeeper-studio..."
distrobox-export --app beekeeper-studio || echo "⚠️  Failed to export beekeeper-studio"
echo "  - Exporting zen-browser..."
distrobox-export --app zen-browser || echo "⚠️  Failed to export zen-browser"
echo "  - Exporting OBS Studio..."
distrobox-export --app com.obsproject.Studio || echo "⚠️  Failed to export OBS Studio"
echo "  - Exporting bruno..."
distrobox-export --app bruno || echo "⚠️  Failed to export bruno"
echo "  - Exporting vivaldi-stable..."
distrobox-export --app vivaldi-stable || echo "⚠️  Failed to export vivaldi-stable"
echo "  - Exporting zed..."
distrobox-export --app zed || echo "⚠️  Failed to export zed"
echo "  - Exporting obsidian..."
distrobox-export --app obsidian || echo "⚠️  Failed to export obsidian"
echo "  - Exporting emacs..."
distrobox-export --app emacs || echo "⚠️  Failed to export emacs"

# Export AppImages
echo "📤 Exporting AppImage applications..."
if [ -f ~/.local/bin/appimages/cursor.AppImage ]; then
    echo "  - Exporting Cursor..."
    distrobox-export --bin ~/.local/bin/appimages/cursor.AppImage --export-path ~/.local/bin || echo "⚠️  Failed to export Cursor"
fi

if [ -f ~/.local/bin/appimages/legcord.AppImage ]; then
    echo "  - Exporting Legcord..."
    distrobox-export --bin ~/.local/bin/appimages/legcord.AppImage --export-path ~/.local/bin || echo "⚠️  Failed to export Legcord"
fi

if [ -f ~/.local/bin/appimages/polypane.AppImage ]; then
    echo "  - Exporting Polypane..."
    distrobox-export --bin ~/.local/bin/appimages/polypane.AppImage --export-path ~/.local/bin || echo "⚠️  Failed to export Polypane"
fi

if [ -f ~/.local/bin/appimages/anytype.AppImage ]; then
    echo "  - Exporting Anytype..."
    distrobox-export --bin ~/.local/bin/appimages/anytype.AppImage --export-path ~/.local/bin || echo "⚠️  Failed to export Anytype"
fi

echo "✅ Setup complete!"
echo ""
echo "📝 Note: teams-for-linux and Azure Storage Explorer are Snap-only."
echo "   Install them on the host with:"
echo "   flatpak install flathub com.github.IsmaelMartinez.teams_for_linux"
echo "   flatpak install flathub com.microsoft.AzureStorageExplorer"

