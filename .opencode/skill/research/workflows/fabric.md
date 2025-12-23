---
description: Intelligent pattern selection for Fabric API. Automatically selects the right pattern from 242+ specialized prompts based on intent.
globs: ""
alwaysApply: false
---

# Fabric Workflow

Intelligent pattern selection for Fabric API hosted at fabric.pietersz.me. Automatically selects the right pattern from 242+ specialized prompts based on your intent.

## Prerequisites

- `FABRIC_API_KEY` environment variable must be set
- Fabric API accessible at https://fabric.pietersz.me

## When to Use This Workflow

- "Create a threat model for..."
- "Summarize this article/video/paper..."
- "Extract wisdom/insights from..."
- "Analyze this [code/malware/claims/debate]..."
- "Improve my writing/code/prompt..."
- "Create a [visualization/summary/report]..."
- "Rate/review/judge this content..."

**The Goal:** Select the RIGHT pattern from 242+ available patterns based on what you're trying to accomplish.

---

## Fabric API Usage

### Chat Endpoint (Apply Pattern)

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
    "userInput": "Your content to process",
    "patternName": "extract_wisdom",
    "model": "gpt-4o-mini"
  }]
}
```

**Response:** Server-Sent Events (SSE) stream with processed content

### Get Pattern Details

**Endpoint:** `GET https://fabric.pietersz.me/patterns/{name}`

**Headers:**
```
X-API-Key: $FABRIC_API_KEY
```

**Response:**
```json
{
  "name": "extract_wisdom",
  "description": "Extract wisdom and insights from content",
  "pattern": "The full pattern prompt..."
}
```

### Apply Pattern with Variables

**Endpoint:** `POST https://fabric.pietersz.me/patterns/{name}/apply`

**Headers:**
```
X-API-Key: $FABRIC_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "input": "Content to process",
  "variables": {
    "key": "value"
  }
}
```

---

## Pattern Selection Strategy

When a user requests Fabric processing, follow this decision tree:

### 1. Identify Intent Category

**Threat Modeling & Security:**
- Threat model → `create_threat_model` or `create_stride_threat_model`
- Threat scenarios → `create_threat_scenarios`
- Security update → `create_security_update`
- Security rules → `create_sigma_rules`, `write_nuclei_template_rule`, `write_semgrep_rule`
- Threat analysis → `analyze_threat_report`, `analyze_threat_report_trends`

**Summarization:**
- General summary → `summarize`
- 5-sentence summary → `create_5_sentence_summary`
- Micro summary → `create_micro_summary` or `summarize_micro`
- Meeting → `summarize_meeting`
- Paper/research → `summarize_paper`
- Video/YouTube → `youtube_summary`
- Newsletter → `summarize_newsletter`
- Code changes → `summarize_git_changes` or `summarize_git_diff`

**Wisdom Extraction:**
- General wisdom → `extract_wisdom`
- Article wisdom → `extract_article_wisdom`
- Book ideas → `extract_book_ideas`
- Insights → `extract_insights` or `extract_insights_dm`
- Main idea → `extract_main_idea`
- Recommendations → `extract_recommendations`
- Controversial ideas → `extract_controversial_ideas`

**Analysis:**
- Malware → `analyze_malware`
- Code → `analyze_code` or `review_code`
- Claims → `analyze_claims`
- Debate → `analyze_debate`
- Logs → `analyze_logs`
- Paper → `analyze_paper`
- Threat report → `analyze_threat_report`
- Product feedback → `analyze_product_feedback`
- Sales call → `analyze_sales_call`

**Content Creation:**
- PRD → `create_prd`
- Design document → `create_design_document`
- User story → `create_user_story`
- Visualization → `create_visualization`, `create_mermaid_visualization`, `create_markmap_visualization`
- Essay → `write_essay`
- Report finding → `create_report_finding`
- Newsletter entry → `create_newsletter_entry`

**Improvement:**
- Writing → `improve_writing`
- Academic writing → `improve_academic_writing`
- Prompt → `improve_prompt`
- Report finding → `improve_report_finding`
- Code → `review_code`

**Rating/Evaluation:**
- AI response → `rate_ai_response`
- Content quality → `rate_content`
- Value assessment → `rate_value`
- General judgment → `judge_output`

### 2. Execute Pattern

```bash
curl -X POST https://fabric.pietersz.me/chat \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [{
      "userInput": "Your content here",
      "patternName": "selected_pattern"
    }]
  }'
```

---

## Pattern Categories (242 Total)

### Threat Modeling & Security (15 patterns)
- `create_threat_model` - General threat modeling
- `create_stride_threat_model` - STRIDE methodology
- `create_threat_scenarios` - Threat scenario generation
- `create_security_update` - Security update documentation
- `create_sigma_rules` - SIGMA detection rules
- `write_nuclei_template_rule` - Nuclei scanner templates
- `write_semgrep_rule` - Semgrep static analysis rules
- `analyze_threat_report` - Threat report analysis
- `analyze_incident` - Incident analysis
- `analyze_risk` - Risk analysis

### Summarization (20 patterns)
- `summarize` - General summarization
- `create_5_sentence_summary` - Ultra-concise 5-line summary
- `create_micro_summary` - Micro summary
- `summarize_meeting` - Meeting notes summary
- `summarize_paper` - Academic paper summary
- `summarize_newsletter` - Newsletter summary
- `summarize_debate` - Debate summary
- `summarize_git_changes` - Git changes summary
- `youtube_summary` - YouTube video summary

### Extraction (30+ patterns)
- `extract_wisdom` - General wisdom extraction
- `extract_article_wisdom` - Article-specific wisdom
- `extract_book_ideas` - Book ideas
- `extract_insights` - General insights
- `extract_main_idea` - Core message
- `extract_recommendations` - Recommendations
- `extract_ideas` - Ideas from content
- `extract_questions` - Questions raised
- `extract_predictions` - Predictions made
- `extract_controversial_ideas` - Controversial points

### Analysis (35+ patterns)
- `analyze_claims` - Claim analysis
- `analyze_malware` - Malware analysis
- `analyze_code` - Code analysis
- `analyze_paper` - Paper analysis
- `analyze_logs` - Log analysis
- `analyze_debate` - Debate analysis
- `analyze_incident` - Incident analysis
- `analyze_personality` - Personality analysis
- `analyze_presentation` - Presentation analysis

### Creation (50+ patterns)
- `create_prd` - Product Requirements Document
- `create_design_document` - Design documentation
- `create_user_story` - User stories
- `create_mermaid_visualization` - Mermaid diagrams
- `create_markmap_visualization` - Markmap mindmaps
- `create_visualization` - General visualizations
- `create_academic_paper` - Academic papers
- `create_flash_cards` - Study flashcards
- `create_quiz` - Quizzes

### Improvement (10 patterns)
- `improve_writing` - General writing improvement
- `improve_academic_writing` - Academic writing
- `improve_prompt` - Prompt engineering
- `review_code` - Code review
- `humanize` - Humanize AI text
- `clean_text` - Text cleanup

### Rating/Judgment (8 patterns)
- `rate_ai_response` - Rate AI outputs
- `rate_content` - Rate content quality
- `rate_value` - Rate value proposition
- `judge_output` - General judgment

---

## Pattern Selection Decision Matrix

| User Request Contains | Likely Intent | Recommended Patterns |
|----------------------|---------------|----------------------|
| "threat model" | Security modeling | `create_threat_model`, `create_stride_threat_model` |
| "summarize", "summary" | Summarization | `summarize`, `create_5_sentence_summary` |
| "extract wisdom", "insights" | Wisdom extraction | `extract_wisdom`, `extract_insights` |
| "analyze [X]" | Analysis | `analyze_[X]` (match X to pattern) |
| "improve", "enhance" | Improvement | `improve_writing`, `improve_prompt` |
| "create [visualization]" | Visualization | `create_mermaid_visualization` |
| "rate", "judge", "evaluate" | Rating | `rate_content`, `judge_output` |
| "main idea", "core message" | Core extraction | `extract_main_idea` |

---

## Example Usage

**Threat Modeling:**
```bash
curl -X POST https://fabric.pietersz.me/chat \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [{
      "userInput": "API that handles user authentication and payment processing",
      "patternName": "create_threat_model"
    }]
  }'
```

**Summarization:**
```bash
curl -X POST https://fabric.pietersz.me/chat \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [{
      "userInput": "[Article content here]",
      "patternName": "create_5_sentence_summary"
    }]
  }'
```

**Wisdom Extraction:**
```bash
curl -X POST https://fabric.pietersz.me/chat \
  -H "X-API-Key: $FABRIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [{
      "userInput": "[Content to extract wisdom from]",
      "patternName": "extract_wisdom"
    }]
  }'
```

---

## Key Insight

**The workflow's value is in selecting the RIGHT pattern for the task.**

When user says "Create a threat model using Fabric", your job is to:
1. Recognize "threat model" intent
2. Know available options: `create_threat_model`, `create_stride_threat_model`, `create_threat_scenarios`
3. Select the best match (usually `create_threat_model` unless STRIDE specified)
4. Execute via Fabric API immediately

**Not:** "Here are the patterns, pick one"
**Instead:** "I'll use `create_threat_model` for this" → execute immediately
