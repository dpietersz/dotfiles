#!/bin/bash

# Only run if custom user-dirs.dirs is configured
if ! grep -q "dev/Desktop" "$HOME/.config/user-dirs.dirs" 2>/dev/null; then
  echo "Custom user-dirs not configured yet. Run after reboot."
  exit 0
fi

# Remove old XDG directories if they exist and are empty
for dir in Desktop Documents Downloads Music Pictures Videos Public Templates; do
  old_dir="$HOME/$dir"
  if [ -d "$old_dir" ]; then
    if [ -z "$(ls -A "$old_dir")" ]; then
      rmdir "$old_dir"
      echo "Removed empty $old_dir"
    else
      echo "Skipping $old_dir (not empty)"
    fi
  fi
done
