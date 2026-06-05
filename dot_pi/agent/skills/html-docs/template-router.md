# Template Router

Route documentation requests to one `.doc.html` template using metadata-first hydration.

## Routing Steps

1. List templates:
   ```bash
   find dot_pi/agent/skills/html-docs/templates -name '*.doc.html' -maxdepth 1 -type f
   ```
   If running outside dotfiles, resolve relative to this skill directory.
2. Extract frontmatter only. Use `awk '/^---$/{n++; next} n==1{print}' FILE` or equivalent.
3. Score candidates:
   - direct artifact phrase match in `use_when`: +5
   - Diátaxis intent match: +3
   - required inputs present: +2 each
   - `avoid_when` match: -10
   - explicit user request for template id/name: +10
4. If best score is weak or two templates tie, ask one routing question.
5. Read the full selected template only.

## Diátaxis Compass

- **Tutorial** — action + study. User learns by doing a safe guided lesson.
- **How-to** — action + work. Competent user solves a specific real-world problem.
- **Reference** — cognition + work. Accurate facts, contracts, APIs, configuration, parameters.
- **Explanation** — cognition + study. Context, rationale, why, trade-offs, mental models.

Hybrid docs are allowed. State primary and secondary quadrants in metadata.

## Default Routing

| Request | Template | Quadrant |
| --- | --- | --- |
| PRD, requirements, product spec | `prd` | explanation + reference |
| product brief, executive brief | `product-brief` | explanation |
| architecture, solution design | `architecture` | explanation + reference |
| technical spec, build contract | `technical-spec` | reference + explanation |
| implementation plan | `implementation-plan` | how-to + reference |
| project overview, onboarding overview | `project-overview` | explanation |
| tutorial, learning path | `tutorial` | tutorial |
| how do I, operational task | `how-to` | how-to |
| API/config/CLI/reference | `reference` | reference |
| why, concept, trade-off | `explanation` | explanation |
| research, market/domain/technical report | `research-report` | explanation |
| test strategy, quality plan | `test-strategy` | reference + explanation |
| ADR, decision record | `decision-record` | explanation + reference |

## Ambiguity Handling

Ask concise questions:

- “Should this help someone complete a task, learn a workflow, look up facts, or understand why?”
- “Who will read this and what decision/work should it enable?”
- “Is this a lightweight one-pager or a downstream contract?”
