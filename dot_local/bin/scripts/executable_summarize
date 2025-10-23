#!/usr/bin/env bash
# quick-summarize.sh
# Usage: ./quick-summarize.sh recording.mp4

OBS_FILE="$1"
timestamp=$(date +"%Y%m%d%H%M")
OUTPUT_BASE="$NOTES/${timestamp}_meeting"

# Direct processing - Whisper handles video files!
echo "🎤 Processing OBS recording with Whisper..."
whisper "$OBS_FILE" \
    --model small \
    --output_dir "$NOTES" \
    --output_format txt \
    --fp16 False \
    --language nl

# Find the generated transcript
TRANSCRIPT=$(find "$NOTES" -name "*meeting.txt" -newer "$OBS_FILE" | head -1)

# Summarize
echo "📝 Creating summary..."
llm -f "$TRANSCRIPT" \
"Create a meeting summary with:
1. Key decisions made
2. Action items assigned  
3. Problems discussed
4. Next steps
If Dutch, translate to English." \
> "${OUTPUT_BASE}_summary.md"

echo "✅ Summary ready:"
glow "${OUTPUT_BASE}_summary.md" -t

