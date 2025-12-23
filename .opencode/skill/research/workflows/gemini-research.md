---
description: Gemini Research - Multi-perspective research using Gemini's capabilities via OpenCode
globs: ""
alwaysApply: false
---

# Gemini Research Workflow

This workflow provides instructions for conducting multi-perspective research using Google's Gemini model through OpenCode's built-in connection.

## Features

- Multi-perspective query decomposition
- Cross-domain synthesis capabilities
- No API key needed (uses OpenCode's Gemini connection via Antigravity OAuth)
- Strong at connecting disparate concepts

## Available Models

Through OpenCode's Antigravity OAuth:
- `google/gemini-3-pro-high` - Deep reasoning, comprehensive analysis
- `google/gemini-3-flash` - Fast responses, good for parallel queries
- `google/gemini-2.5-flash` - Balanced speed and capability

---

## Research Orchestration Process

### Step 1: Query Decomposition (3-10 variations)

When given a research query:

1. **Analyze the main research question**
2. **Break it into 3-10 complementary sub-queries**
3. **Each variation should explore a different angle or aspect**
4. **Ensure variations don't duplicate efforts**

### Decomposition Examples

**Original Query:** "Best mattress above $5,000 for firm support and 300lb person"

**Decomposed Queries (5 variations):**
1. "Top-rated luxury mattresses $5,000+ with firmest support ratings for heavy individuals"
2. "Mattress durability testing results for 300+ pound users - which brands last longest"
3. "Professional mattress reviews comparing firmness levels in premium $5,000+ range"
4. "Customer reviews from heavy users (280-320 lbs) on luxury firm mattresses over 3+ years"
5. "Materials science: which mattress construction types maintain firmness best for heavy sleepers"

**Original Query:** "Latest developments in quantum computing practical applications"

**Decomposed Queries (7 variations):**
1. "Quantum computing breakthroughs in 2025 - practical commercial applications"
2. "Companies successfully deploying quantum computers for real-world problems"
3. "Quantum computing in drug discovery and molecular simulation - recent results"
4. "Financial institutions using quantum computing for optimization and risk analysis"
5. "Quantum computing limitations and challenges preventing widespread adoption"
6. "Comparison of different quantum computing approaches - which is winning"
7. "Timeline predictions for quantum computing mainstream availability from experts"

---

## Execution Process

### Step 2: Launch Parallel Research

For each decomposed query, the gemini-researcher agent will:
1. Use Gemini's capabilities to search and analyze
2. Synthesize information from multiple perspectives
3. Return focused findings for that specific angle

### Step 3: Result Synthesis

Collect all research results and:
1. **Identify patterns** - What themes appear across multiple queries?
2. **Note contradictions** - Where do sources disagree?
3. **Find consensus** - What do most sources agree on?
4. **Highlight unique insights** - What did only one query reveal?

### Synthesis Template

```markdown
## Research Synthesis

### Executive Summary
[2-3 sentences capturing the key findings]

### Consensus Findings (High Confidence)
- [Finding agreed upon by multiple queries]
- [Finding agreed upon by multiple queries]

### Unique Insights
- [Insight from Query 1 angle]
- [Insight from Query 3 angle]

### Conflicting Information
- [Topic]: Query 2 suggests X, while Query 5 suggests Y

### Recommendations
Based on the research:
1. [Actionable recommendation]
2. [Actionable recommendation]

### Research Coverage
- Queries executed: [N]
- Perspectives explored: [list]
- Confidence level: [High/Medium/Low]
```

---

## Gemini's Strengths

Leverage Gemini for:
- **Cross-domain connections** - Finding relationships between disparate fields
- **Creative angles** - Exploring unconventional perspectives
- **Synthesis** - Combining information from multiple sources coherently
- **Multi-modal understanding** - If images/PDFs are involved

---

## Best Practices

### Query Variation
- Each query should explore a genuinely different angle
- Avoid redundant queries that will return similar results
- Include both broad and specific queries

### Parallel Execution
- Launch all queries simultaneously for speed
- Don't wait for one to complete before starting others
- Set reasonable timeouts (2-3 minutes per query)

### Result Integration
- Don't just concatenate results - synthesize them
- Identify the "so what" - actionable conclusions
- Note confidence levels based on source agreement

---

## Example Workflow

**User asks:** "Research the impact of remote work on company culture"

**Decomposed Queries:**
1. "Remote work impact on team collaboration and communication 2025"
2. "Company culture challenges with distributed teams research"
3. "Successful remote-first companies culture strategies"
4. "Remote work employee engagement and satisfaction studies"
5. "Hybrid work models best practices for maintaining culture"
6. "Remote work impact on innovation and creativity in teams"

**Execution:**
1. Launch 6 parallel Gemini queries
2. Each explores a different facet of remote work culture
3. Collect findings from all angles
4. Synthesize into comprehensive analysis covering:
   - Challenges identified
   - Successful strategies
   - Employee perspectives
   - Innovation impacts
   - Recommended approaches
