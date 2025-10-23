#!/bin/bash

# Check if a file name is provided as an argument
if [ -z "$1" ]; then
	echo "Error: A file name must be provided, e.g., \"the wonderful thing about tiggers\"."
	exit 1
fi

# Replace spaces with hyphens in the file name
# file_name=$(echo "$1" | tr ' ' '-')
file_name=$(echo "$1")

# Format the file name with the current date
formatted_file_name=$(date "+%Y-%m-%d")_${file_name}.md

# Change directory to the target location, or exit if it fails
cd "$SECOND_BRAIN" || exit

echo "$PWD"
echo "$formatted_file_name"
# Create the new file in the inbox directory
touch "+ Encounters/${formatted_file_name}"

# Open the new file in Neovim
nvim "./+ Encounters/${formatted_file_name}"
