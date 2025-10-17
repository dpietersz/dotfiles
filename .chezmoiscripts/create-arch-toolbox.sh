#!/bin/bash

# Run this manually on your host to create the arch-toolbox
distrobox create \
  --name arch-toolbox \
  --image quay.io/toolbx/arch-toolbox:latest \
  --pull \
  --yes

echo "Container created. Enter with: distrobox enter arch-toolbox"
echo "Then run: git clone <your-dotfiles-repo> ~/.dotfiles && cd ~/.dotfiles && ./setup"
