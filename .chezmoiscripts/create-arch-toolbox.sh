#!/bin/bash

# This script can be run manually if needed
# It's also called by chezmoi during initial setup if user opts in

set -euo pipefail

echo "Creating arch-toolbox container..."

distrobox create \
  --name arch-toolbox \
  --image quay.io/toolbx/arch-toolbox:latest \
  --pull \
  --yes

echo "✓ Container created successfully"
echo ""
echo "Next steps:"
echo "  1. Enter container: distrobox enter arch-toolbox"
echo "  2. Clone dotfiles: git clone <your-repo> ~/.dotfiles"
echo "  3. Run setup: cd ~/.dotfiles && ./setup"
