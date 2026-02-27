---
name: research
description: Comprehensive research, analysis, and content extraction system. Multi-source parallel research using available researcher agents. Deep content analysis with extended thinking. Intelligent retrieval for difficult sites. USE WHEN user says 'do research', 'extract wisdom', 'analyze content', 'find information about', or requests web/content research.
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

## API Keys Available

This skill uses API keys from your environment:

| Feature | Environment Variable |
|---------|---------------------|
| Perplexity Research | `PERPLEXITY_API_KEY` |
| BrightData Scraping | `BRIGHTDATA_API_TOKEN` |
| Brave Search | `BRAVE_API_KEY` |

**Works without API keys:**
- Claude-based research (uses built-in web search)
- Basic web fetching

---

## Multi-Source Research

### Three Research Modes

**QUICK RESEARCH MODE:**
- User says "quick research" → Launch 1 agent per researcher type
- **Timeout: 2 minutes**

**STANDARD RESEARCH MODE (Default):**
- Default for most research requests → Launch 3 agents per researcher type
- **Timeout: 3 minutes**

**EXTENSIVE RESEARCH MODE:**
- User says "extensive research" → Launch 8 agents per researcher type
- **Timeout: 10 minutes**

### Available Research Agents

- `claude-researcher` - Uses built-in web search (no API key needed)
- `perplexity-researcher` - Uses Perplexity API (requires PERPLEXITY_API_KEY)
- `gemini-researcher` - Uses Gemini model (no API key needed)

---

## Intelligent Content Retrieval

### Two-Layer System

**Layer 1: Built-in Tools (FREE)**
- Web fetch — Basic web content fetching
- Web search — Search engine queries
- **When to use: Default for most content retrieval**

**Layer 2: BrightData MCP (requires BRIGHTDATA_API_TOKEN)**
- CAPTCHA solving via Scraping Browser
- Residential proxy network
- **When to use: Bot detection blocking, CAPTCHA protection (last resort)**

---

## Key Principles

1. **Parallel execution** - Launch multiple agents simultaneously
2. **Hard timeouts** - Don't wait indefinitely, proceed with partial results
3. **Simplest first** - Always try free tools before paid services
4. **Auto-routing** - Skill analyzes intent and activates appropriate workflow
