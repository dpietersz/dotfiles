---
description: Perplexity Research - Fast web search with query decomposition via Perplexity API
globs: ""
alwaysApply: false
---

# Perplexity Research Workflow

This workflow provides instructions for conducting web research using the Perplexity API with intelligent query decomposition.

## Prerequisites

- `PERPLEXITY_API_KEY` environment variable must be set
- API key available from: https://perplexity.ai/settings/api

## Features

- Intelligent query decomposition into multiple focused searches
- Fast web search via Perplexity API
- Real-time, up-to-date information
- Citation support for source verification

---

## Perplexity API Usage

### Endpoint
```
POST https://api.perplexity.ai/chat/completions
```

### Headers
```
Authorization: Bearer $PERPLEXITY_API_KEY
Content-Type: application/json
```

### Models Available
- **sonar** - Fast web search (default for initial queries)
- **sonar-pro** - Deeper analysis (used for follow-ups)

### Request Format
```json
{
  "model": "sonar",
  "messages": [
    {
      "role": "user",
      "content": "Your search query here"
    }
  ],
  "return_citations": true
}
```

---

## Query Decomposition Strategy

When given a research question, decompose it into 4-8 targeted sub-queries:

### Considerations for Decomposition

1. **Different aspects/angles** of the topic
2. **Background/context** queries
3. **Current state/recent developments**
4. **Comparisons/alternatives**
5. **Technical details** if relevant
6. **Implications/consequences**
7. **Expert opinions/analysis**
8. **Data/statistics** if relevant

---

## Execution Process

### Step 1: Analyze and Decompose

Use Perplexity to intelligently decompose the question:

```bash
curl -X POST https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar",
    "messages": [{
      "role": "system",
      "content": "You are a research query decomposition expert. Return only valid JSON arrays."
    }, {
      "role": "user", 
      "content": "Analyze this research question and decompose it into 4-8 focused sub-queries: [QUESTION]"
    }],
    "temperature": 0.3
  }'
```

### Step 2: Execute Parallel Searches

For each sub-query, execute a Perplexity search:

```bash
curl -X POST https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar",
    "messages": [{
      "role": "user",
      "content": "[SUB-QUERY]"
    }],
    "return_citations": true
  }'
```

Execute all queries in parallel for speed.

### Step 3: Collect and Analyze Results

For each response:
1. Extract the content from `choices[0].message.content`
2. Extract citations from the `citations` array
3. Note the query that produced each finding

### Step 4: Follow-up with Sonar-Pro (If Needed)

If initial results need deeper analysis or recent information is critical:

```bash
curl -X POST https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar-pro",
    "messages": [{
      "role": "user",
      "content": "Most recent updates and developments as of [TODAY] regarding: [TOPIC]"
    }],
    "return_citations": true
  }'
```

### Step 5: Synthesize Findings

Combine all results into a comprehensive report:

```markdown
## Research Summary

### Key Findings
- [Finding 1] (Source: [citation])
- [Finding 2] (Source: [citation])
- [Finding 3] (Source: [citation])

### Detailed Analysis

#### [Topic Area 1]
[Synthesized information with citations]

#### [Topic Area 2]
[Synthesized information with citations]

### Recent Developments
[Latest news and updates]

### Sources
- [Citation 1 - URL]
- [Citation 2 - URL]
- [Citation 3 - URL]

### Research Metrics
- Queries executed: [N]
- Model used: sonar / sonar-pro
- Citations gathered: [N]
```

---

## Best Practices

### Query Formulation
- Include current year for time-sensitive topics
- Be specific to get focused results
- Use natural language (Perplexity handles it well)

### Model Selection
- Use `sonar` for initial broad searches (faster)
- Use `sonar-pro` for follow-up deep dives (more thorough)

### Citation Handling
- Always include `return_citations: true`
- Verify important claims against cited sources
- Note when citations are missing or weak

---

## Example

**User Question:** "What is the current state of AI regulation in the EU?"

**Decomposed Queries:**
1. "EU AI Act current status 2025"
2. "EU AI regulation requirements for companies"
3. "EU AI Act high-risk AI systems classification"
4. "EU AI regulation enforcement penalties"
5. "EU AI Act timeline implementation dates"
6. "EU AI regulation comparison with US approach"

**Execution:** Run all 6 queries via Perplexity API in parallel, collect citations, synthesize into comprehensive overview of EU AI regulation landscape.
