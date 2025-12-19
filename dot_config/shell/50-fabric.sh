# 50-fabric.sh — Fabric AI CLI integration (shared between bash and zsh)

# Only load if fabric is installed
if command -v fabric >/dev/null 2>&1; then

  # ------------------ Pattern Aliases ------------------

  # Create aliases for all fabric patterns with f_ prefix
  # Patterns are stored in ~/.config/fabric/patterns/
  if [ -d "$HOME/.config/fabric/patterns" ]; then
    for pattern_file in "$HOME/.config/fabric/patterns"/*; do
      [ -e "$pattern_file" ] || continue
      pattern_name=$(basename "$pattern_file")
      # Sanitize: replace hyphens with underscores, remove other special chars
      safe_name=$(echo "$pattern_name" | tr '-' '_' | tr -cd 'a-zA-Z0-9_')
      # Validate: must start with letter, only alphanumeric and underscore
      if [[ "$safe_name" =~ ^[a-zA-Z][a-zA-Z0-9_]*$ ]]; then
        alias "f_${safe_name}"="fabric --pattern $pattern_name"
      fi
    done
  fi

  # ------------------ YouTube Transcript ------------------

  # Fetch YouTube transcript with optional timestamps
  # Usage: yt [-t | --timestamps] youtube-link
  yt() {
    if [ "$#" -eq 0 ] || [ "$#" -gt 2 ]; then
      echo "Usage: yt [-t | --timestamps] youtube-link"
      return 1
    fi

    transcript_flag="--transcript"
    if [ "$1" = "-t" ] || [ "$1" = "--timestamps" ]; then
      transcript_flag="--transcript-with-timestamps"
      shift
    fi
    local video_link="$1"
    fabric -y "$video_link" $transcript_flag
  }

  # ------------------ Local File Transcription ------------------

  # Transcribe local video/audio files using fabric's speech-to-text
  # Always saves to a .txt file (raw transcription, no processing)
  # Usage: transcribe <file> [output-file]
  # Example: transcribe video.mp4                      # saves to video.txt
  # Example: transcribe video.mp4 custom.txt           # saves to custom.txt
  transcribe() {
    local file="$1"
    local output="$2"
    local model="${FABRIC_TRANSCRIBE_MODEL:-gpt-4o-mini-transcribe}"

    if [ -z "$file" ]; then
      echo "Usage: transcribe <file> [output-file]"
      echo ""
      echo "Transcribe local video/audio files using fabric's speech-to-text."
      echo "Saves raw transcription to a .txt file (no processing applied)."
      echo ""
      echo "Examples:"
      echo "  transcribe video.mp4                        # saves to video.txt"
      echo "  transcribe video.mp4 custom.txt             # saves to custom.txt"
      echo "  transcribe \"Course Lesson.mp4\"              # saves to Course Lesson.txt"
      echo ""
      echo "To process transcription with patterns, use:"
      echo "  cat video.txt | f_summarize"
      echo "  cat video.txt | save_to_lifelog summarize 'Lesson Title'"
      echo ""
      echo "Environment variables:"
      echo "  FABRIC_TRANSCRIBE_MODEL  - Model to use (default: gpt-4o-mini-transcribe)"
      return 1
    fi

    if [ ! -f "$file" ]; then
      echo "Error: File not found: $file"
      return 1
    fi

    # If no output specified, derive from input filename
    if [ -z "$output" ]; then
      # Remove video extension and add .txt
      output="${file%.*}.txt"
    fi

    # Ensure .txt extension
    if [[ "$output" != *.txt ]]; then
      output="${output}.txt"
    fi

    # Save to file
    fabric --transcribe-file "$file" --transcribe-model "$model" --split-media-file -o "$output"
    echo "Transcribed: $file -> $output"
  }

  # ------------------ Save to Life Log ------------------

  # Save fabric output to git-life-log transcriptions directory
  # Works with ANY fabric pattern (summarize, extract_wisdom, analyze_claims, etc.)
  # Usage: pbpaste | save_to_lifelog <pattern> [title]
  # Example: pbpaste | save_to_lifelog summarize 'My Article Title'
  # Example: yt "URL" | save_to_lifelog extract_wisdom 'Video Title'
  save_to_lifelog() {
    local pattern="$1"
    local title="$2"
    local transcriptions_dir="$PROJECTS/git-life-log/documents/transcriptions"

    # Validate pattern argument
    if [ -z "$pattern" ]; then
      echo "Usage: save_to_lifelog <pattern> [title]"
      echo "Example: pbpaste | save_to_lifelog summarize 'My Article Title'"
      echo "Example: yt 'URL' | save_to_lifelog extract_wisdom 'Video Title'"
      echo ""
      echo "Available patterns: fabric --listpatterns"
      return 1
    fi

    # If no title provided, prompt interactively
    if [ -z "$title" ]; then
      printf "Enter title for transcription: "
      read title
    fi

    # Validate title
    if [ -z "$title" ]; then
      echo "Error: Title is required"
      return 1
    fi

    # Create filename: YYYYMMDD_title_with_underscores.md
    local date_stamp=$(date +'%Y%m%d')
    local safe_title=$(echo "$title" | tr ' ' '_' | tr -cd 'a-zA-Z0-9_-')
    local filename="${date_stamp}_${safe_title}.md"
    local output_path="${transcriptions_dir}/${filename}"

    # Ensure directory exists
    mkdir -p "$transcriptions_dir"

    # Pull latest changes first
    git -C "$transcriptions_dir/.." pull --quiet

    # Run fabric and save output
    fabric --pattern "$pattern" -o "$output_path"

    # Git add, commit, push
    git -C "$transcriptions_dir/.." add "$output_path"
    git -C "$transcriptions_dir/.." commit -m "Add transcription: $title"
    git -C "$transcriptions_dir/.." push --quiet

    echo "Saved: $output_path"
    echo "Committed and pushed: Add transcription: $title"
  }

fi
