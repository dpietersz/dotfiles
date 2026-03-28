# Pattern: Fabric Tools System

A config-driven system that dynamically registers Fabric AI pattern tools and pipelines.
Built on top of the [tools-system](tools-system.md) pattern — lives in the same
`~/.pi/agent/extensions/tools/` directory and is auto-discovered by `index.ts`.

## File Layout

```
~/.pi/agent/extensions/tools/
├── fabric.ts               # Main extension: registers tools, pipelines, /fabric command
├── fabric.txt              # LLM-facing description of all f_* and fp_* tools
├── fabric-patterns.json    # Config: patterns, sources, pipelines, default model
```

## Architecture: Three Layers

### 1. Patterns (building blocks) → `f_[name]` tools

Single-step tools that process text through one Fabric pattern via `POST /chat`.
Each accepts `input` (text) and optional `model` (LLM override).

### 2. Sources (internal building blocks)

Data-fetching endpoints (e.g. YouTube transcript via `POST /youtube/transcript`).
**Not exposed as tools** — only used as steps inside pipelines.

### 3. Pipelines (chained tools) → `fp_[name]` tools

Multi-step chains that pipe the output of one step into the next.
Steps can be sources or patterns in any combination.
Each accepts `input` and optional `model`.

## Config: fabric-patterns.json

```json
{
  "defaultModel": "gemini-2.5-flash",

  "patterns": [
    "youtube_summary",
    "extract_wisdom",
    "convert_to_markdown"
  ],

  "sources": {
    "youtube_transcript": {
      "endpoint": "/youtube/transcript",
      "bodyKey": "url",
      "resultKey": "transcript",
      "description": "Fetch YouTube video transcript from a URL",
      "extraBody": { "timestamps": true }
    }
  },

  "pipelines": {
    "yt_summary": {
      "description": "Fetch a YouTube video transcript and create a timestamped summary.",
      "inputDescription": "YouTube video URL",
      "steps": [
        { "source": "youtube_transcript" },
        { "pattern": "youtube_summary" }
      ]
    },
    "html_to_markdown": {
      "description": "Convert HTML content to clean Markdown.",
      "inputDescription": "HTML content to convert",
      "steps": [
        { "pattern": "convert_to_markdown" }
      ]
    }
  }
}
```

### Config fields

| Field | Description |
|-------|-------------|
| `defaultModel` | Model used when the user doesn't specify one |
| `patterns` | Array of Fabric pattern names → each becomes an `f_[name]` tool |
| `sources` | Named data-fetching endpoints used inside pipelines |
| `sources[name].endpoint` | Fabric API path (e.g. `/youtube/transcript`) |
| `sources[name].bodyKey` | JSON key for the input in the request body (e.g. `"url"`) |
| `sources[name].resultKey` | JSON key to extract from the response (e.g. `"transcript"`) |
| `sources[name].extraBody` | Optional extra fields merged into the request body |
| `pipelines` | Named multi-step chains → each becomes an `fp_[name]` tool |
| `pipelines[name].description` | Human/LLM description of what the pipeline does |
| `pipelines[name].inputDescription` | Describes what the input parameter expects |
| `pipelines[name].steps` | Ordered array of `{ "source": "name" }` or `{ "pattern": "name" }` |

## Adding a New Pattern Tool

1. Add the pattern name to the `patterns` array in `fabric-patterns.json`
2. Optionally add a description to the `PATTERN_DESCRIPTIONS` map in `fabric.ts`
3. Run `/reload` — the `f_[name]` tool is immediately available

Or interactively: `/fabric` → "Add a pattern" → enter name → `/reload`

The full list of ~213 available patterns can be fetched from:
```
GET https://fabric.pietersz.me/patterns/names
```

Pattern descriptions are at:
```
https://raw.githubusercontent.com/danielmiessler/Fabric/refs/heads/main/data/patterns/pattern_explanations.md
```

## Adding a New Source

Add an entry to the `sources` object in `fabric-patterns.json`:

```json
"my_source": {
  "endpoint": "/some/endpoint",
  "bodyKey": "input_field",
  "resultKey": "output_field",
  "description": "What this source fetches",
  "extraBody": { "optional": "extra params" }
}
```

Sources are not exposed as tools — they're building blocks for pipelines.

## Adding a New Pipeline

Add an entry to the `pipelines` object in `fabric-patterns.json`:

```json
"yt_cyber_summary": {
  "description": "Fetch YouTube transcript and create a cybersecurity summary.",
  "inputDescription": "YouTube video URL",
  "steps": [
    { "source": "youtube_transcript" },
    { "pattern": "create_cyber_summary" }
  ]
}
```

Or interactively: `/fabric` → "Add a pipeline" → follow prompts → `/reload`

Pipeline steps execute in order. Each step's output becomes the next step's input.
You can chain any number of sources and patterns.

## Fabric REST API

**Base URL:** `https://fabric.pietersz.me`
**Auth:** `X-API-Key` header from `FABRIC_API_KEY` environment variable

### Key endpoints used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat` | POST | Run a pattern on input text (SSE response) |
| `/youtube/transcript` | POST | Extract transcript from YouTube URL |
| `/patterns/names` | GET | List all available pattern names |
| `/models/names` | GET | List available models by vendor |

### /chat request format

```json
{
  "prompts": [{
    "userInput": "text to process",
    "vendor": "gemini",
    "model": "gemini-2.5-flash",
    "patternName": "youtube_summary"
  }],
  "temperature": 0.7,
  "topP": 0.9
}
```

**Important:** The `vendor` field is required. The code auto-detects it from the model name:
- `claude*` / `anthropic*` → `"anthropic"`
- `gemini*` / `gemma*` → `"gemini"`
- `gpt*` / `o1*` / `o3*` / `o4*` → `"openai"`

### /chat SSE response format

The response is Server-Sent Events with `data:` prefixed JSON lines:
```
data: {"type":"content","format":"markdown","content":"partial response..."}
data: {"type":"content","format":"markdown","content":"more content..."}
data: {"type":"complete","format":"plain","content":""}
```

All `content` type chunks must be concatenated. `error` type means failure.
The `parseSSE()` function in `fabric.ts` handles this.

### /youtube/transcript request

```json
{
  "url": "https://youtube.com/watch?v=VIDEO_ID",
  "timestamps": true
}
```

Response includes `videoId`, `title`, `description`, and `transcript`.
The source handler prepends `title` and `description` as context.

## Updating fabric.txt (LLM description)

When patterns or pipelines change, update `fabric.txt` to match. This file tells the LLM
what tools are available and when to use them. Key rules:

- List every `f_*` pattern tool with a one-line description
- List every `fp_*` pipeline tool with description and expected input type
- Include the **IMPORTANT** note: use `fp_yt_*` pipelines for YouTube URLs, not `f_*` patterns
- Keep it concise — this goes into the system prompt

## /fabric Command

Interactive command to manage the config without editing JSON:

- **List active patterns** — shows all `f_*` tools
- **List active pipelines** — shows all `fp_*` tools with their step chains
- **List available sources** — shows building blocks for pipelines
- **Add/remove patterns** — modifies `patterns` array
- **Add/remove pipelines** — modifies `pipelines` object (interactive step builder)
- **Change default model** — updates `defaultModel`

All changes are saved to `fabric-patterns.json`. Run `/reload` to activate.

## Reference Implementation

The live files are the reference:
- `~/.pi/agent/extensions/tools/fabric.ts`
- `~/.pi/agent/extensions/tools/fabric.txt`
- `~/.pi/agent/extensions/tools/fabric-patterns.json`

Full Fabric REST API docs: https://github.com/danielmiessler/Fabric/blob/main/docs/rest-api.md
