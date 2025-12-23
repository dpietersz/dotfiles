---
description: Extract content from YouTube videos using Fabric API. Automatically retrieves transcripts and processes with optional pattern application.
globs: ""
alwaysApply: false
---

# YouTube Extraction Workflow

Extract content from YouTube videos using the Fabric API hosted at fabric.pietersz.me.

## Prerequisites

- `FABRIC_API_KEY` environment variable must be set
- Fabric API accessible at https://fabric.pietersz.me

## When to Use This Workflow

- Extract content from YouTube video
- Get YouTube transcript
- Analyze YouTube video
- Summarize YouTube content
- Process YouTube video with Fabric patterns

---

## Fabric API Endpoints

### Get YouTube Transcript

**Endpoint:** `POST https://fabric.pietersz.me/youtube/transcript`

**Headers:**
```
X-API-Key: $FABRIC_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "language": "en",
  "timestamps": false
}
```

**Response:**
```json
{
  "videoId": "VIDEO_ID",
  "title": "Video Title",
  "description": "Video description...",
  "transcript": "The full transcript text..."
}
```

### Process with Pattern

**Endpoint:** `POST https://fabric.pietersz.me/chat`

**Headers:**
```
X-API-Key: $FABRIC_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompts": [{
    "userInput": "The transcript or content to process",
    "patternName": "extract_wisdom"
  }]
}
```

---

## Extraction Process

### Step 1: Get the Transcript

```bash
curl -X POST https://fabric.pietersz.me/youtube/transcript \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "language": "en",
    "timestamps": false
  }'
```

### Step 2: Process with Pattern (Optional)

If user wants analysis/summarization, apply a Fabric pattern:

```bash
curl -X POST https://fabric.pietersz.me/chat \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [{
      "userInput": "[TRANSCRIPT FROM STEP 1]",
      "patternName": "extract_wisdom"
    }]
  }'
```

---

## Common Patterns for YouTube Content

| Pattern | Use Case |
|---------|----------|
| `extract_wisdom` | Extract key insights and wisdom |
| `summarize` | Create concise summary |
| `youtube_summary` | YouTube-specific summary format |
| `extract_main_idea` | Get core message |
| `create_summary` | Detailed summary |
| `extract_insights` | Extract actionable insights |
| `analyze_claims` | Analyze claims made in video |

---

## Example Workflows

### Extract Raw Transcript

**User:** "Get the transcript from this YouTube video: https://youtube.com/watch?v=abc123"

**Execution:**
1. Call `/youtube/transcript` endpoint with the URL
2. Return the transcript text to user

### Extract Wisdom from Video

**User:** "Extract wisdom from this video: https://youtube.com/watch?v=abc123"

**Execution:**
1. Call `/youtube/transcript` to get transcript
2. Call `/chat` with `patternName: "extract_wisdom"` and transcript as input
3. Return the extracted wisdom

### Summarize Video

**User:** "Summarize this YouTube video: https://youtube.com/watch?v=abc123"

**Execution:**
1. Call `/youtube/transcript` to get transcript
2. Call `/chat` with `patternName: "youtube_summary"` and transcript as input
3. Return the summary

---

## Output Format

### Raw Transcript Output
```markdown
## Video: [Title]

**Video ID:** [ID]
**Description:** [First 200 chars of description]

### Transcript
[Full transcript text]
```

### Processed Output
```markdown
## Video: [Title]

**Pattern Applied:** [pattern_name]

### Results
[Output from Fabric pattern processing]

### Source
- Video: [URL]
- Video ID: [ID]
```

---

## Error Handling

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Invalid URL or playlist URL | Ensure single video URL, not playlist |
| 401 Unauthorized | Invalid API key | Check FABRIC_API_KEY is set correctly |
| 500 Internal Error | Transcript unavailable | Video may not have captions; inform user |

**If transcript unavailable:**
- Some videos don't have captions/transcripts
- Auto-generated captions may not be available for all languages
- Inform user and suggest alternative (manual transcription or different video)

---

## Best Practices

1. **Always get transcript first** - Don't try to process without transcript
2. **Check video accessibility** - Some videos are private or region-locked
3. **Use appropriate pattern** - Match pattern to user's intent
4. **Handle long videos** - Very long transcripts may need chunking
5. **Preserve metadata** - Include video title and ID in output
