---
name: research
description: Comprehensive research, analysis, and content extraction system. Multi-source parallel research using available researcher subagents. USE WHEN user says 'do research', 'extract wisdom', 'analyze content', 'find information about', or requests web/content research.
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
- User provides a URL for analysis

**DO NOT use this skill when:**
- User asks about code implementation details → Use `dev-research` skill
- User asks "how does library X work?" → Use `dev-research` skill
- User wants GitHub code examples → Use `dev-research` skill
- User needs architecture decisions → Use `dev-research` skill

---

## Available Subagents

### claude-researcher
**Purpose:** General web research using built-in web search
**Use for:** General queries, current events, no API key needed
**Key Features:** Multi-query decomposition, parallel search execution, citation-rich output

### perplexity-researcher
**Purpose:** Citation-rich deep web research via Perplexity API
**Use for:** Fact-checking, comprehensive investigation, when citations matter
**Key Features:** Perplexity MCP tools, deep research mode, reasoning mode

### gemini-researcher
**Purpose:** Multi-perspective research with cross-domain synthesis
**Use for:** Complex topics needing multiple angles, creative research perspectives
**Key Features:** Query decomposition into 3-10 angles, synthesis across perspectives

---

## Workflow Routing

### Multi-Source Research (Default)
**Trigger:** "research X", "find information about Y", "investigate Z"
→ **EXECUTE:** Launch claude-researcher + perplexity-researcher + gemini-researcher in parallel
→ **SYNTHESIZE:** Combine findings into comprehensive answer

### Quick Research
**Trigger:** "quick research on X", "briefly research Y"
→ **EXECUTE:** Launch claude-researcher only (fastest, no API key needed)

### Citation-Heavy Research
**Trigger:** "find sources on X", "cite research about Y", "fact-check Z"
→ **EXECUTE:** Launch perplexity-researcher (best citations)

### Multi-Perspective Research
**Trigger:** "compare X and Y", "different views on Z", "pros and cons of X"
→ **EXECUTE:** Launch gemini-researcher (best for synthesis across angles)

---

## Research Modes

**QUICK MODE:**
- Launch 1 researcher (claude-researcher)
- Best for: Simple queries, straightforward questions
- Timeout: ~2 minutes

**STANDARD MODE (Default):**
- Launch all 3 researchers in parallel
- Best for: Most research needs, comprehensive coverage
- Timeout: ~3 minutes

**EXTENSIVE MODE:**
- Launch multiple instances of each researcher
- Best for: Deep-dive research, comprehensive reports
- Trigger: "extensive research", "deep research", "thorough investigation"
- Timeout: ~10 minutes

---

## MCP Servers Used

| MCP Server | Purpose |
|------------|---------|
| **perplexity** | Perplexity API for citation-rich research |
| **brave** | Brave Search API for web search |
| **brightdata** | Advanced web scraping with CAPTCHA bypass |
| **playwright** | Browser automation for dynamic content |

---

## Key Principles

1. **Parallel execution** — Launch multiple researchers simultaneously
2. **Hard timeouts** — Don't wait indefinitely, proceed with partial results
3. **Simplest first** — Always try free tools before paid services
4. **Auto-routing** — Skill analyzes intent and activates appropriate workflow
