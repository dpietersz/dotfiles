---
description: Claude Web Research - Intelligent multi-query WebSearch decomposition
globs: ""
alwaysApply: false
---

# Claude Web Research Workflow

This workflow provides instructions for conducting web research using Claude's built-in WebSearch capabilities with intelligent query decomposition.

## Features

- Intelligent query decomposition into multiple focused searches
- Parallel execution using Claude WebSearch for speed
- Iterative follow-up searches based on initial findings
- Comprehensive synthesis of all findings

## Advantages

- Uses Claude's built-in WebSearch (no API keys needed)
- Free and unlimited usage
- Integrated with Claude's knowledge and reasoning

---

## Query Decomposition Strategy

When given a research question, decompose it into 4-8 targeted sub-queries:

### Query Types to Generate

1. **Original Question** - The user's exact query
2. **Background/Context** - "what is [topic] background context"
3. **Recent Developments** - "[topic] latest news [current year]"
4. **Current State** - "[topic] recent developments [current year]"
5. **Technical Details** - "[topic] technical details explained"
6. **Comparisons** - "[topic] comparison alternatives options"
7. **Expert Analysis** - "[topic] expert analysis opinion"
8. **Implications** - "[topic] implications impact consequences"

---

## Execution Process

### Step 1: Analyze the Research Question

Identify:
- Core topic and key terms
- Type of information needed (factual, opinion, technical, current events)
- Scope (broad overview vs. specific detail)
- Time sensitivity (needs current info vs. historical)

### Step 2: Generate Search Queries

Create 4-8 focused queries covering different angles:

```
Query 1: [Original question]
Query 2: [Background context query]
Query 3: [Recent news query with current year]
Query 4: [Technical details query]
Query 5: [Comparison/alternatives query]
Query 6: [Expert opinion query]
Query 7: [Implications query]
Query 8: [Edge cases or controversies query]
```

### Step 3: Execute Searches in Parallel

Use WebSearch tool for each query. Execute as many as possible in parallel.

For each query:
1. Execute WebSearch with the query
2. Analyze results for relevance
3. Extract key findings
4. Note source URLs

### Step 4: Synthesize Findings

Combine results from all searches:

```markdown
## Research Summary

### Key Findings
- [Finding 1 with source]
- [Finding 2 with source]
- [Finding 3 with source]

### Background Context
[Synthesized background information]

### Current State ([Year])
[Recent developments and news]

### Technical Details
[Technical information if relevant]

### Expert Perspectives
[Expert opinions and analysis]

### Implications
[Impact and consequences]

### Sources Consulted
- [URL 1]
- [URL 2]
- [URL 3]
```

### Step 5: Follow-up Searches (If Needed)

If initial results reveal gaps or raise new questions:
1. Identify specific gaps in knowledge
2. Generate targeted follow-up queries
3. Execute additional searches
4. Integrate new findings

---

## Best Practices

### Query Formulation
- Be specific rather than broad
- Include relevant time constraints (e.g., "2025")
- Use domain-specific terminology when appropriate
- Vary query structure to get diverse results

### Result Analysis
- Cross-reference findings across multiple sources
- Note conflicting information
- Prioritize authoritative sources
- Distinguish facts from opinions

### Synthesis
- Organize by theme, not by query
- Highlight high-confidence findings
- Acknowledge uncertainties
- Provide actionable conclusions

---

## Example

**User Question:** "What are the best practices for microservices architecture?"

**Generated Queries:**
1. "best practices microservices architecture"
2. "microservices architecture patterns explained"
3. "microservices vs monolith comparison 2025"
4. "microservices architecture challenges solutions"
5. "microservices communication patterns"
6. "microservices deployment strategies kubernetes"
7. "microservices architecture expert recommendations"
8. "microservices architecture anti-patterns avoid"

**Execution:** Run all 8 WebSearch queries in parallel, then synthesize findings into a comprehensive guide covering patterns, best practices, common pitfalls, and expert recommendations.
