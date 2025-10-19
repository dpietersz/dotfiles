#!/usr/bin/env bash
# Install packages for base-applications-toolbox (runs as root in pre_init_hooks)
set -e

echo "📦 Installing applications from DNF/COPR repositories..."

# Install applications (no sudo needed - this runs as root)
dnf install -y beekeeper-studio || echo "⚠️  Failed to install beekeeper-studio"
dnf install -y obs-studio || echo "⚠️  Failed to install obs-studio"
dnf install -y vivaldi-stable || echo "⚠️  Failed to install vivaldi-stable"
dnf install -y zen-browser || echo "⚠️  Failed to install zen-browser"
dnf install -y zed || echo "⚠️  Failed to install zed"
dnf install -y bruno || echo "⚠️  Failed to install bruno"
dnf install -y obsidian || echo "⚠️  Failed to install obsidian"

echo "✅ Package installation complete!"

