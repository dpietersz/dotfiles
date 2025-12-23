---
description: Comprehensive multi-source research - orchestrate researcher subagents in parallel
globs: ""
alwaysApply: false
---

# Comprehensive Research Workflow

**This workflow provides instructions for orchestrating comprehensive multi-source research by invoking researcher subagents in parallel.**

## Mission

When a user asks for research, deliver **FAST RESULTS** through massive parallelization:

## Three Research Modes

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

**Workflow for all modes:**
1. Decompose question into focused sub-questions (appropriate to mode)
2. Launch all agents in parallel (SINGLE message with multiple @agent calls)
3. Each agent does ONE query + ONE follow-up max
4. Collect results as they complete
5. Synthesize findings into comprehensive report

---

## Available Research Agents

Use these subagents by @mentioning them:
- `@claude-researcher` - Uses Claude's WebSearch (FREE, no API key needed)
- `@perplexity-researcher` - Uses Perplexity API (requires PERPLEXITY_API_KEY)
- `@gemini-researcher` - Uses Gemini via OpenCode (FREE, no API key needed)

---

## Extensive Research Mode (24 AGENTS)

**ACTIVATION:** User says "extensive research" or "do extensive research on X"

### Step 0: Generate Creative Research Angles

Think deeply and extensively about the research topic:
- Explore multiple unusual perspectives and domains
- Question all assumptions about what's relevant
- Make unexpected connections across different fields
- Consider edge cases, controversies, and emerging trends
- Think about historical context, future implications, and cross-disciplinary angles
- What questions would experts from different fields ask?

Generate 8 unique research angles per researcher type. Each should be distinct, creative, and explore a different facet of the topic.

### Step 1: Launch All Research Agents in Parallel (8 per type)

**CRITICAL: Use a SINGLE message with all @agent mentions**

Example:
```
@claude-researcher Research quantum computing breakthroughs 2025
@claude-researcher Research quantum computing practical applications
@claude-researcher Research quantum computing companies leading
...
@perplexity-researcher Research quantum computing news recent
@perplexity-researcher Research quantum computing investments
...
@gemini-researcher Research quantum computing scientific papers
@gemini-researcher Research quantum computing limitations
...
```

**Each agent prompt should:**
- Include the specific creative query angle
- Instruct: "Do 1-2 focused searches and return findings. Return results as soon as you have useful findings."
- Keep it concise but thorough

### Step 2: Wait for Agents to Complete (UP TO 10 MINUTES FOR EXTENSIVE)

**CRITICAL TIMEOUT RULE: After 10 minutes from launch, proceed with synthesis using only the agents that have returned results.**

- **HARD TIMEOUT: 10 minutes** - After 10 minutes from launch, DO NOT wait longer
- Proceed with synthesis using whatever results have been returned
- Note which agents didn't respond in your final report
- **TIMELY RESULTS > PERFECT COMPLETENESS**

### Step 3: Synthesize Extensive Research Results

**Report structure:**
```markdown
## Executive Summary
[1-2 paragraph overview of comprehensive findings]

## Key Findings by Domain
### [Domain 1]
**High Confidence (5+ sources):**
- Finding with extensive corroboration

**Medium Confidence (2-4 sources):**
- Finding with moderate corroboration

### [Domain 2]
...

## Unique Insights
**From Perplexity Research (Web/Current):**
- Novel findings from broad web search

**From Claude Research (Academic/Detailed):**
- Deep analytical insights

**From Gemini Research (Multi-Perspective):**
- Cross-domain connections and synthesis

## Coverage Map
- Aspects covered: [list]
- Perspectives explored: [list]
- Time periods analyzed: [list]

## Conflicting Information & Uncertainties
[Note any disagreements or gaps]

## Research Metrics
- Total Agents: [N] (8 per researcher type)
- Total Queries: ~[2N]+ (each agent 1-2 queries)
- Services Used: [List all researcher services used]
- Confidence Level: [High/Medium] ([%])
```

---

## Quick Research Workflow (1 AGENT PER TYPE)

**ACTIVATION:** User says "quick research" or simple/straightforward queries

### Step 1: Identify Core Angles (1 per researcher type)

Break the question into focused sub-questions - one optimized for each available researcher type. Tailor each query to leverage that researcher's specific strengths.

### Step 2: Launch All Researcher Agents in Parallel (1 of each)

```
@claude-researcher [Query optimized for Claude's analytical depth]
@perplexity-researcher [Query optimized for current web information]
@gemini-researcher [Query optimized for multi-perspective synthesis]
```

### Step 3: Quick Synthesis (2 MINUTE TIMEOUT)

**CRITICAL TIMEOUT RULE: After 2 minutes from launch, proceed with synthesis using only the agents that have returned results.**

- **HARD TIMEOUT: 2 minutes from launch** - Do NOT wait longer
- Synthesize perspectives that returned into cohesive answer
- Note any non-responsive agents in report

---

## Standard Research Workflow (3 AGENTS PER TYPE)

**ACTIVATION:** Default mode for most research requests

### Step 1: Decompose Question & Launch All Research Agents

**Step 1a: Break Down the Research Question**

Decompose the user's question into specific sub-questions (3 per researcher type).

Each question should:
- Cover different angles of the topic
- Target specific aspects to investigate
- Explore related areas that provide context
- Consider edge cases or controversies
- Be optimized for each researcher's specific strengths

**Step 1b: Launch All Research Agents in Parallel (3 of each type)**

```
@claude-researcher [Query 1 - analytical angle]
@claude-researcher [Query 2 - detailed exploration]
@claude-researcher [Query 3 - edge cases]
@perplexity-researcher [Query 4 - current news]
@perplexity-researcher [Query 5 - recent developments]
@perplexity-researcher [Query 6 - trending discussions]
@gemini-researcher [Query 7 - cross-domain connections]
@gemini-researcher [Query 8 - alternative perspectives]
@gemini-researcher [Query 9 - synthesis angle]
```

**CRITICAL RULES FOR SPEED:**
1. **Launch ALL agents in ONE message** (parallel execution)
2. **Each agent gets ONE specific sub-question** (focused research)
3. **3 agents per researcher type** (balanced coverage)
4. **Each agent does 1 query + 1 follow-up max** (quick cycles)
5. **Results return in ~30 seconds** (parallel processing)
6. **DON'T launch sequentially** (kills speed benefit)
7. **DON'T give broad questions** (forces multiple iterations)

### Step 2: Collect Results (UP TO 3 MINUTES FOR STANDARD)

**CRITICAL TIMEOUT RULE: After 3 minutes from launch, proceed with synthesis using only the agents that have returned results.**

- **Typical time:** Most agents return in 30-120 seconds
- **HARD TIMEOUT: 3 minutes** - After 3 minutes from launch, DO NOT wait longer
- Proceed with synthesis using whatever results have been returned
- Note which agents didn't respond in your final report
- **TIMELY RESULTS > PERFECT COMPLETENESS**

### Step 3: Synthesize Results

Create a comprehensive report that:

**A. Identifies Confidence Levels:**
- **HIGH CONFIDENCE**: Findings corroborated by multiple sources
- **MEDIUM CONFIDENCE**: Found by one source, seems reliable
- **LOW CONFIDENCE**: Single source, needs verification

**B. Structures Information:**
```markdown
## Key Findings

### [Topic Area 1]
**High Confidence:**
- Finding X (Sources: perplexity-researcher, claude-researcher)
- Finding Y (Sources: perplexity-researcher, claude-researcher)

**Medium Confidence:**
- Finding Z (Source: claude-researcher)

### [Topic Area 2]
...

## Source Attribution
- **Perplexity-Researcher**: [summary of unique contributions]
- **Claude-Researcher**: [summary of unique contributions]
- **Gemini-Researcher**: [summary of unique contributions]

## Conflicting Information
- [Note any disagreements between sources]
```

**C. Calculate Research Metrics:**
- **Total Queries**: Count all queries across all research agents
- **Services Used**: List unique services (Perplexity API, Claude WebSearch, Gemini)
- **Confidence Level**: Overall confidence percentage
- **Result**: 1-2 sentence answer to the research question

---

## Critical Rules

### Timeout Rules (MOST IMPORTANT):
**After the timeout period, STOP WAITING and synthesize with whatever results you have.**
- **Quick (1 per type): 2 minute timeout**
- **Standard (3 per type): 3 minute timeout**
- **Extensive (8 per type): 10 minute timeout**
- Proceed with partial results after timeout
- Note non-responsive agents in final report
- TIMELY RESULTS > COMPLETENESS
- DO NOT wait indefinitely for slow/failed agents
- DO NOT let one slow agent block the entire research

### Mode Selection:
- **QUICK:** User says "quick research" → 1 agent per researcher type → **2 min timeout**
- **STANDARD:** Default for most requests → 3 agents per researcher type → **3 min timeout**
- **EXTENSIVE:** User says "extensive research" → 8 agents per researcher type → **10 min timeout**

### Speed Checklist:
- Launched agents in ONE message? (parallel execution)
- Each agent has ONE focused sub-question?
- Using all available researcher types for broad coverage?
- Agents instructed to do 1 query + 1 follow-up max?
- Expected results in under 1 minute?

---

## Handling Blocked or Failed Crawls

If research agents report being blocked, encountering CAPTCHAs, or facing bot detection, note this in your synthesis and recommend using the retrieve workflow with BrightData MCP:
- Load `workflows/retrieve.md` for escalation strategy
- Use `mcp__brightdata__scrape_as_markdown` for CAPTCHA bypass
- Use `mcp__brightdata__search_engine` for search with bypass

---

## Example Execution

### Example: Standard Research (3 agents per type)

**User asks:** "Research the latest developments in quantum computing"

**Your workflow:**
1. Recognize research intent
2. **Decompose into focused sub-questions (3 per researcher type)**
3. **Launch ALL researcher agents in PARALLEL (ONE message):**
   ```
   @claude-researcher What are the major quantum computing breakthroughs in 2025?
   @claude-researcher What are the current limitations of quantum computers?
   @claude-researcher Which quantum algorithms show most promise?
   @perplexity-researcher Latest quantum computing news and announcements 2025
   @perplexity-researcher Quantum computing company funding and investments recent
   @perplexity-researcher Quantum computing practical applications deployed
   @gemini-researcher Compare different quantum computing approaches (superconducting vs trapped ion)
   @gemini-researcher Quantum computing impact on cryptography and security
   @gemini-researcher Timeline predictions for quantum computing mainstream adoption
   ```
4. **Wait for ALL agents to complete** (~30 seconds)
5. **Synthesize their findings:**
   - Common themes → High confidence
   - Unique insights → Medium confidence
   - Disagreements → Note and flag
6. **Calculate metrics** (total agents, queries, services, confidence %)
7. **Return comprehensive report**

**Result:** User gets comprehensive quantum computing research from parallel agents (3 per researcher type) in ~30 seconds, with balanced multi-source validation, source attribution, and confidence levels.
