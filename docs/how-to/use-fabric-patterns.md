# How to Use Fabric Patterns

This guide shows you how to use fabric AI patterns with the custom shell aliases and save function configured in this dotfiles repository.

## Overview

[Fabric](https://github.com/danielmiessler/fabric) is an AI CLI tool that applies reusable "patterns" to text. Patterns are prompts designed for specific tasks like summarizing content, extracting wisdom, or analyzing claims. This dotfiles setup provides convenient aliases and functions for common fabric workflows.

## Prerequisites

- Fabric is installed automatically via the dotfiles setup
- Run `fabric --setup` to configure your API keys (OpenAI, Anthropic, etc.)

```bash
# First-time setup
fabric --setup
```

## Using Pattern Aliases

All fabric patterns are available with the `f_` prefix. This makes them easy to discover and use.

### Common Patterns

```bash
# Summarize content from clipboard
pbpaste | f_summarize

# Extract key insights and wisdom
pbpaste | f_extract_wisdom

# Analyze claims for accuracy
pbpaste | f_analyze_claims

# Create a study guide
pbpaste | f_create_study_guide

# Extract article content
pbpaste | f_extract_article
```

### Discovering Patterns

```bash
# List all available patterns
fabric --listpatterns

# List all f_ aliases (bash/zsh)
alias | grep "^f_"
```

## YouTube Transcripts

The `yt` function fetches transcripts from YouTube videos.

### Basic Usage

```bash
# Get transcript without timestamps
yt "https://youtube.com/watch?v=VIDEO_ID"

# Get transcript with timestamps
yt -t "https://youtube.com/watch?v=VIDEO_ID"
yt --timestamps "https://youtube.com/watch?v=VIDEO_ID"
```

### Piping to Patterns

```bash
# Summarize a YouTube video
yt "https://youtube.com/watch?v=VIDEO_ID" | f_summarize

# Extract wisdom from a video
yt "https://youtube.com/watch?v=VIDEO_ID" | f_extract_wisdom

# Create study notes from a lecture
yt "https://youtube.com/watch?v=VIDEO_ID" | f_create_study_guide
```

## Local File Transcription

The `transcribe` function converts local video/audio files to text using fabric's speech-to-text capabilities. This is useful for course videos, podcasts, or any media files.

The function always saves to a `.txt` file with the raw transcription (no processing applied).

### Basic Usage

```bash
# Transcribe using input filename (video.mp4 -> video.txt)
transcribe video.mp4

# Transcribe with custom output filename
transcribe video.mp4 custom.txt

# Transcribe course video (preserves spaces in filename)
transcribe "1.1 Design Philosophy.mp4"
# -> Creates "1.1 Design Philosophy.txt"
```

### Processing Transcriptions

After transcribing, use the `.txt` file with patterns:

```bash
# Summarize the transcription
cat "1.1 Design Philosophy.txt" | f_summarize

# Extract wisdom
cat "1.1 Design Philosophy.txt" | f_extract_wisdom

# Save processed output to life log
cat "1.1 Design Philosophy.txt" | save_to_lifelog summarize "Design Philosophy Lesson"
```

### Course Video Workflow

After downloading a course video with `download_video`:

```bash
# 1. Download the video
download_video "https://example.com/video.m3u8"
# Enter title: "10.1 Auth Package"

# 2. Transcribe to text file
transcribe "10.1 Auth Package.mp4"
# -> Creates "10.1 Auth Package.txt"

# 3. Process with any pattern
cat "10.1 Auth Package.txt" | f_summarize
cat "10.1 Auth Package.txt" | f_extract_wisdom

# 4. Or save to life log
cat "10.1 Auth Package.txt" | save_to_lifelog summarize "Auth Package Lesson"
```

### Configuration

Set a custom transcription model via environment variable:

```bash
export FABRIC_TRANSCRIBE_MODEL="gpt-4o-mini-transcribe"  # default
```

## Saving to Life Log

The `save_to_lifelog` function processes content through **any** fabric pattern and saves the output to your git-life-log repository.

### Location

Files are saved to: `$PROJECTS/git-life-log/documents/transcriptions/`

### Filename Format

Files are named: `YYYYMMDD_Title_With_Underscores.md`

### Usage

```bash
# With title argument (using any pattern)
pbpaste | save_to_lifelog summarize "My Article Title"
pbpaste | save_to_lifelog extract_wisdom "Deep Insights Article"
pbpaste | save_to_lifelog analyze_claims "Fact Check Article"

# Interactive (prompts for title)
pbpaste | save_to_lifelog summarize
```

### What It Does

1. Pulls latest changes from git-life-log
2. Runs the specified fabric pattern (any pattern works!)
3. Saves output to the transcriptions directory
4. Commits with message: "Add transcription: [Title]"
5. Pushes to remote

## Common Workflows

### Summarize a YouTube Video and Save

```bash
yt "https://youtube.com/watch?v=VIDEO_ID" | save_to_lifelog summarize "Video Title"
```

### Extract Wisdom from a YouTube Video and Save

```bash
yt "https://youtube.com/watch?v=VIDEO_ID" | save_to_lifelog extract_wisdom "Video Title"
```

### Process an Article from Clipboard

```bash
# Copy article text to clipboard, then:
pbpaste | f_extract_wisdom

# Or save it:
pbpaste | save_to_lifelog extract_wisdom "Article Title"
```

### Analyze Claims in an Article

```bash
pbpaste | f_analyze_claims
```

### Chain Multiple Patterns

```bash
# First summarize, then extract key points
pbpaste | f_summarize | f_extract_wisdom
```

## Tips

### Real-Time Streaming Output

Use `--stream` for real-time output on long content:

```bash
pbpaste | fabric --pattern summarize --stream
```

### View All Options

```bash
fabric -h
```

### Pattern Location

Custom patterns can be added to: `~/.config/fabric/patterns/`

Each pattern is a directory containing a `system.md` file with the prompt.

## See Also

- [Fabric GitHub Repository](https://github.com/danielmiessler/fabric) - Official documentation
- [Shell Aliases Reference](../reference/shell-aliases.md) - All shell aliases including fabric
