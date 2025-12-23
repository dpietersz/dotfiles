---
description: Intelligently extracts knowledge and signal points from any input source (URLs, YouTube videos, PDFs, text). Auto-detects content type and generates structured insights.
globs: ""
alwaysApply: false
---

# Extract Knowledge Workflow

Intelligently extracts knowledge and signal points from any input source (URLs, YouTube videos, PDFs, presentations, research papers, etc.). Automatically detects content type, fetches content using appropriate methods, analyzes the domain focus, and generates structured insights with actionable recommendations.

## Usage

```
Extract knowledge from [source] [--focus=domain]
```

**Examples:**
- "Extract knowledge from https://example.com/article"
- "Extract knowledge from https://youtube.com/watch?v=abc123"
- "Extract knowledge from this text: [content]"
- "Extract knowledge from https://arxiv.org/paper --focus=security"

**Focus domains:** security, business, research, wisdom, general (auto-detected if not specified)

---

## Implementation

### Step 1: Detect Source Type and Fetch Content

**YouTube Videos** (youtube.com, youtu.be):
- Use Fabric API `/youtube/transcript` endpoint
- Get transcript, title, and description

**Web URLs** (http/https):
- Try WebFetch first
- If blocked, use BrightData MCP (see retrieve.md workflow)

**Direct Text**:
- Process the provided text directly

**Research Papers** (arxiv, doi):
- Treat as web content but mark as research domain

### Step 2: Analyze Content Domain

If `--focus` is not specified, auto-detect from content:

| Domain | Keywords to Detect |
|--------|-------------------|
| **Security** | vulnerability, hack, exploit, cybersecurity, attack, defense, threat |
| **Business** | money, revenue, profit, market, strategy, business, growth |
| **Research** | study, experiment, methodology, findings, academic, hypothesis |
| **Wisdom** | philosophy, principle, life, wisdom, insight, experience, lesson |
| **General** | Everything else |

### Step 3: Extract Knowledge by Domain

**For Security Content:**
- Extract attack vectors, vulnerabilities, defensive measures
- Identify security tools and frameworks mentioned
- Generate technical security recommendations

**For Business Content:**
- Extract revenue opportunities, market insights
- Identify business strategies and growth tactics
- Generate business action items

**For Research Content:**
- Extract key findings and methodology insights
- Identify technical contributions
- Note future work directions
- Rate research quality

**For Wisdom Content:**
- Extract life principles and philosophical insights
- Identify practical wisdom and lessons learned
- Generate memorable quotes and aphorisms

**For General Content:**
- Extract key concepts and important facts
- Identify learning opportunities
- Generate actionable takeaways

### Step 4: Structure Output

```markdown
## Knowledge Extraction Results

**Source:** [source URL or description]
**Type:** [detected type: YouTube, Web Article, Research Paper, Text]
**Domain:** [detected or specified domain]
**Quality Rating:** [1-10]/10
**Confidence:** [1-10]/10

---

### Content Summary
[2-3 sentence summary of the content]

---

### Key Insights
- [Insight 1]
- [Insight 2]
- [Insight 3]
- [Insight 4]
- [Insight 5]

---

### Signal Points
[Important signals or indicators worth noting]
- [Signal point 1]
- [Signal point 2]
- [Signal point 3]

---

### Actionable Recommendations
Based on this content, consider:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

---

### Related Concepts
[Comma-separated list of key terms and related topics]

---

### [Domain-Specific Section]

**For Security:**
#### Technical Details
- [Technical detail 1]
- [Technical detail 2]

**For Wisdom:**
#### Extracted Wisdom
> "[Key quote or insight]"

**For Research:**
#### Methodology Notes
- [Methodology insight]

**For Business:**
#### Business Implications
- [Business implication]
```

---

## Domain-Specific Signal Points

### Security Domain
- New attack vectors identified
- Defensive strategies recommended
- Vulnerability assessment techniques
- Security tools and frameworks mentioned
- Compliance or regulatory implications

### Business Domain
- Revenue opportunities identified
- Market insights discovered
- Business strategies outlined
- Growth tactics documented
- Competitive advantages noted

### Research Domain
- Research findings summarized
- Methodology insights extracted
- Key contributions identified
- Future work directions noted
- Reproducibility assessment

### Wisdom Domain
- Life principles identified
- Philosophical insights extracted
- Practical wisdom discovered
- Universal truths highlighted
- Actionable life lessons

---

## Quality Rating Criteria

| Rating | Description |
|--------|-------------|
| **9-10** | Comprehensive, actionable, high-value insights |
| **7-8** | Good insights with clear recommendations |
| **5-6** | Moderate value, some useful information |
| **3-4** | Limited insights, basic information |
| **1-2** | Poor quality or insufficient content |

---

## Example Execution

**User:** "Extract knowledge from https://example.com/ai-security-article"

**Process:**
1. Detect: Web URL
2. Fetch: Use WebFetch to get content
3. Analyze: Detect "security" domain from keywords
4. Extract: Security-focused knowledge extraction
5. Output: Structured report with security insights, attack vectors, defensive recommendations

**Output:**
```markdown
## Knowledge Extraction Results

**Source:** https://example.com/ai-security-article
**Type:** Web Article
**Domain:** Security
**Quality Rating:** 8/10
**Confidence:** 9/10

---

### Content Summary
This article discusses emerging AI security threats in 2025, focusing on adversarial attacks against machine learning models and recommended defensive strategies for enterprise deployments.

---

### Key Insights
- Adversarial attacks on ML models increased 340% in 2024
- Model poisoning is the fastest-growing attack vector
- Defense-in-depth approaches are most effective
- Regular model auditing reduces risk by 60%
- Supply chain attacks on ML pipelines are emerging

---

### Signal Points
- New attack category: "Model Inversion Attacks"
- Regulatory pressure increasing (EU AI Act)
- Insurance industry developing AI-specific policies

---

### Actionable Recommendations
1. Implement model monitoring and anomaly detection
2. Audit training data sources quarterly
3. Deploy adversarial training techniques
4. Establish ML security incident response procedures

---

### Related Concepts
adversarial ML, model security, AI governance, ML ops security, model poisoning, data poisoning, AI risk management

---

### Technical Details
- Attack success rate: 73% against undefended models
- Defense effectiveness: Adversarial training reduces success to 12%
- Recommended tools: IBM ART, Microsoft Counterfit, Google CleverHans
```
