#!/bin/bash

# Directory containing markdown files
VAULT_DIR="$SECOND_BRAIN"
SOURCE_DIR="Cards/Zettelkasten"
DEST_DIR="Cards"

# Iterate through all markdown files in the source directory
find "$VAULT_DIR/$SOURCE_DIR" -type f -name "*.md" | while read -r file; do
	echo "Processing $file"

	# Extract the tag from the file. This assumes the tag is on the line immediately following "tags:"
	# tag=$(awk '/MOC:/{getline; print; exit}' "$file" | sed -e 's/^ *- *//' -e 's/^ *//;s/ *$//')
	# tag=$(grep "MOCs" "$file" | grep "^[[:space:]]*- " | awk -F'[[]|[]]' '{print $3}' | awk -F'/' '{print $NF}')
	tag=$(grep "MOCs" "$file" | grep "^[[:space:]]*- " | awk -F'[[]|[]]' '{print $3}' | awk -F'/' '{print $NF}' | awk -F'|' '{print $NF}')

	echo "Found MOC $tag"

	# If a tag is found, proceed with moving the file
	if [ -n "$tag" ]; then
		# Create the target directory if it doesn't exist
		TARGET_DIR="$VAULT_DIR/$DEST_DIR/$tag"
		mkdir -p "$TARGET_DIR"

		# Move the file to the target directory
		mv "$file" "$TARGET_DIR/"
		echo "Moved $file to $TARGET_DIR"
	else
		echo "No tag found for $file"
	fi

done

echo "Done 🪷"
