---
name: research
description: Comprehensive research, analysis, and content extraction system. Multi-source parallel research using available researcher agents. Deep content analysis with extended thinking. Intelligent retrieval for difficult sites. Fabric pattern selection for 242+ specialized prompts. USE WHEN user says 'do research', 'extract wisdom', 'analyze content', 'find information about', or requests web/content research.
---

# Research Skill

Comprehensive multi-source research system for general knowledge gathering, web research, and content analysis.

## When to Use This Skill

**USE this skill when:**
- User says "research", "do research on", "find information about"
- User wants to investigate a topic broadly
- User needs current events or news
- User asks for multi-source fact-finding
- User wants to "extract wisdom" or "analyze content"
- User provides a URL or YouTube video for analysis

**DO NOT use this skill when:**
- User asks about code implementation details → Use `dev-research` skill
- User asks "how does library X work?" → Use `dev-research` skill
- User wants GitHub code examples → Use `dev-research` skill
- User needs architecture decisions → Use `dev-research` skill

---

## API Keys Available

This skill uses API keys from your environment:

| Feature | Environment Variable | Source |
|---------|---------------------|--------|
| Perplexity Research | `PERPLEXITY_API_KEY` | ~/.bashrc |
| Fabric Patterns | `FABRIC_API_KEY` | ~/.bashrc |
| BrightData Scraping | `BRIGHTDATA_API_TOKEN` | ~/.bashrc |

**Works without API keys:**
- Claude-based research (uses built-in WebSearch)
- Gemini-based research (uses OpenCode's Gemini connection)
- Basic web fetching (uses built-in WebFetch)

---

## Workflow Routing

### Multi-Source Research Workflows

**When user requests comprehensive parallel research:**
Examples: "do research on X", "research this topic", "find information about Y", "investigate this subject"
→ **LOAD:** `workflows/conduct.md`
→ **EXECUTE:** Parallel multi-agent research using available researcher agents

**When user requests Claude-based research:**
Examples: "use claude for research", "claude research on X", "use websearch to research Y"
→ **LOAD:** `workflows/claude-research.md`
→ **EXECUTE:** Intelligent query decomposition with Claude's WebSearch

**When user requests Perplexity research:**
Examples: "use perplexity to research X", "perplexity research on Y"
→ **LOAD:** `workflows/perplexity-research.md`
→ **EXECUTE:** Fast web search with query decomposition via Perplexity API

**When user requests Gemini research:**
Examples: "use gemini to research X", "gemini research on Y"
→ **LOAD:** `workflows/gemini-research.md`
→ **EXECUTE:** Multi-perspective research using Gemini's capabilities

### Content Retrieval Workflows

**When user indicates difficulty accessing content:**
Examples: "can't get this content", "site is blocking me", "CAPTCHA blocking"
→ **LOAD:** `workflows/retrieve.md`
→ **EXECUTE:** Escalation through layers (WebFetch → BrightData MCP)

**When user provides YouTube URL:**
Examples: "get this youtube video", "extract from youtube URL"
→ **LOAD:** `workflows/youtube-extraction.md`
→ **EXECUTE:** YouTube content extraction using Fabric API

### Fabric Pattern Processing

**When user requests Fabric pattern usage:**
Examples: "use fabric to X", "create threat model", "summarize with fabric"
→ **LOAD:** `workflows/fabric.md`
→ **EXECUTE:** Auto-select best pattern from 242+ Fabric patterns via API

### Content Enhancement Workflows

**When user requests knowledge extraction:**
Examples: "extract knowledge from X", "get insights from this"
→ **LOAD:** `workflows/extract-knowledge.md`
→ **EXECUTE:** Knowledge extraction and synthesis

---

## Multi-Source Research

### Three Research Modes

**QUICK RESEARCH MODE:**
- User says "quick research" → Launch 1 agent per researcher type
- **Timeout: 2 minutes**
- Best for: Simple queries, straightforward questions

**STANDARD RESEARCH MODE (Default):**
- Default for most research requests → Launch 3 agents per researcher type
- **Timeout: 3 minutes**
- Best for: Most research needs, comprehensive coverage

**EXTENSIVE RESEARCH MODE:**
- User says "extensive research" → Launch 8 agents per researcher type
- **Timeout: 10 minutes**
- Best for: Deep-dive research, comprehensive reports

### Available Research Agents

The following subagents are available for research:
- `claude-researcher` - Uses Claude's WebSearch (no API key needed)
- `perplexity-researcher` - Uses Perplexity API (requires PERPLEXITY_API_KEY)
- `gemini-researcher` - Uses Gemini via OpenCode's connection (no API key needed)

### Speed Benefits

- **Old approach**: Sequential searches → 5-10 minutes
- **Quick mode**: 1 agent per type → **2 minute timeout**
- **Standard mode**: 3 agents per type → **3 minute timeout**
- **Extensive mode**: 8 agents per type → **10 minute timeout**

---

## Intelligent Content Retrieval

### Two-Layer Escalation System

**Layer 1: Built-in Tools (Try First - FREE)**
- WebFetch - Standard web content fetching
- WebSearch - Search engine queries
- When to use: Default for all content retrieval

**Layer 2: BrightData MCP (requires BRIGHTDATA_API_TOKEN)**
- CAPTCHA solving via Scraping Browser
- Advanced JavaScript rendering
- When to use: Bot detection blocking, CAPTCHA protection

**Critical Rules:**
- Always try simplest approach first (Layer 1)
- Escalate only when previous layer fails
- Document which layers were used and why

---

## Fabric Pattern Selection

### Categories (242+ Patterns)

**Threat Modeling & Security:**
- `create_threat_model`, `create_stride_threat_model`
- `analyze_threat_report`, `analyze_incident`

**Summarization:**
- `summarize`, `create_5_sentence_summary`
- `summarize_meeting`, `summarize_paper`, `youtube_summary`

**Wisdom Extraction:**
- `extract_wisdom`, `extract_article_wisdom`
- `extract_insights`, `extract_main_idea`

**Analysis:**
- `analyze_claims`, `analyze_code`, `analyze_debate`
- `analyze_logs`, `analyze_paper`

**Content Creation:**
- `create_prd`, `create_design_document`
- `create_mermaid_visualization`, `create_user_story`

**Improvement:**
- `improve_writing`, `improve_prompt`, `review_code`

### Usage via Fabric API

```bash
# Apply pattern via API
curl -X POST https://fabric.pietersz.me/chat \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [{
      "userInput": "Your content here",
      "patternName": "extract_wisdom"
    }]
  }'

# Get YouTube transcript
curl -X POST https://fabric.pietersz.me/youtube/transcript \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=VIDEO_ID"}'
```

---

## Key Principles

1. **Parallel execution** - Launch multiple agents simultaneously
2. **Hard timeouts** - Don't wait indefinitely, proceed with partial results
3. **Simplest first** - Always try free tools before paid services
4. **Auto-routing** - Skill analyzes intent and activates appropriate workflow

---

## Workflow Files

| Workflow | File | API Keys Needed |
|----------|------|-----------------|
| Multi-Source Research | `workflows/conduct.md` | Varies by agent |
| Claude Research | `workflows/claude-research.md` | None (FREE) |
| Perplexity Research | `workflows/perplexity-research.md` | PERPLEXITY_API_KEY |
| Gemini Research | `workflows/gemini-research.md` | None (uses OpenCode) |
| Content Retrieval | `workflows/retrieve.md` | Optional: BRIGHTDATA_API_KEY |
| YouTube Extraction | `workflows/youtube-extraction.md` | FABRIC_API_KEY |
| Fabric Patterns | `workflows/fabric.md` | FABRIC_API_KEY |
| Knowledge Extraction | `workflows/extract-knowledge.md` | None |
