---
name: chain-design
description: Create, maintain, and debug pi agent chains with proper step design, prompt engineering, artifact handoff, and context engineering. Covers chain lifecycle from design through validation, step modification, artifact flow debugging, and trait integration. Use when creating a chain, modifying a chain step, designing a pipeline, debugging chain output, building a multi-step workflow, or improving an existing chain.
---

# Chain Design

Complete chain lifecycle framework — creation, maintenance, debugging, and system understanding.

**⛔ Do NOT skip Phase 1.** Users often underestimate chain complexity or overengineer solutions. Challenge the request before building.

## How Chains Work

A chain is a sequence of agent steps where each step:
1. Runs in an **isolated context window** (fresh for each step)
2. Gets behavioral traits composed into its **system prompt** (Level 2+3)
3. Gets the step body as its **user message** (Level 4)
4. Produces an **artifact** consumed by the next step
5. Its text output becomes `{previous}` for the next step

```
Step 1 agent receives: system_prompt(context + traits) + user_message(step body with {task})
  → produces artifact.md + text output
Step 2 agent receives: system_prompt(context + traits) + user_message(step body with {previous})
  → reads artifact.md, produces next artifact
```

Chains are the primary implementation of **Frequent Intentional Compaction** — each step compacts its full exploration into a dense artifact, and the next step starts fresh.

## Creating a Chain

### Phase 1: CLARIFY — Challenge the Need

1. **What does this chain produce?** (specific deliverable)
2. **Can a single agent do this?** → If yes, don't build a chain
3. **Can an existing chain handle this?** → Check: implementation, implementation-direct, research-plan-implement, refine-linear-issue
4. **What are the distinct phases?** → Each needs a clear handoff artifact
5. **Where does the human review?** → Highest-leverage review points

**Complexity assessment:**

| Steps | Complexity | Example |
|-------|-----------|---------|
| 2-3 | Simple | Implement → PR |
| 4-5 | Standard | Research → Plan → Implement → PR |
| 6-7 | Complex | Branch → Research → Plan → Implement → Review → PR → Triage |
| 8+ | Reconsider | Split into multiple chains or simplify |

### Phase 2: DESIGN — Architecture

For each step, determine:

| Aspect | Decision |
|--------|----------|
| Agent | Which agent? (engineer, scout, planner, reviewer...) |
| Model | Override? (haiku-4-5 for cheap, opus-4-6:high for quality-critical) |
| Traits | Which behaviors? (1-3 from expertise/personality/approach) |
| Skills | Domain knowledge needed? (skill names, `false` to disable, omit to inherit) |
| Input | `reads: artifact.md` or `{previous}` or `{task}` |
| Output | `output: artifact.md` |
| Enforcement | ⛔ rules? (max 2-3 per step) |

**Agent + trait + model selection:**

| Step purpose | Agent | Traits | Primary model | Fallback |
|-------------|-------|--------|---------------|----------|
| Branch/setup | engineer | systematic | `google/gemini-2.5-flash` | `anthropic/claude-sonnet-4-6` |
| Fast recon | scout | codebase-research, rapid | `google/gemini-2.5-flash` | `openai-codex/gpt-5.2` |
| Deep research | eagle-scout | codebase-research, thorough | `anthropic/claude-sonnet-4-6` | `openai-codex/gpt-5.2` |
| Web research | researcher | (per task) | `google/gemini-2.5-flash` | `openai-codex/gpt-5.2` |
| Planning | planner | planning, analytical | `openai-codex/gpt-5.4` | `anthropic/claude-opus-4-6` |
| Standard impl | engineer | implementation, disciplined | `anthropic/claude-sonnet-4-6` | `openai-codex/gpt-5.2` |
| Complex impl | lead-engineer | implementation, disciplined, systematic | `anthropic/claude-opus-4-6` | `openai-codex/gpt-5.4` |
| Code review | reviewer | code-review, analytical | `openai-codex/gpt-5.4-mini` | `anthropic/claude-sonnet-4-6` |
| PR creation | engineer | systematic | `openai-codex/gpt-5.4-mini` | `anthropic/claude-sonnet-4-6` |
| Review triage | reviewer | code-review, skeptical | `openai-codex/gpt-5.4-mini` | `anthropic/claude-sonnet-4-6` |
| PM / Linear ops | project-manager | (per task) | `openai-codex/gpt-5.4-mini` | `anthropic/claude-sonnet-4-6` |

See **Model Selection for New Agents** (below) for the decision framework behind these choices.

### Phase 3: WRITE — Create the Chain File

```markdown
---
name: my-chain
description: "What this chain does — one sentence."
---

## agent-name
output: artifact.md
reads: previous-artifact.md
model: provider/model-name:thinking-level
traits: expertise, personality, approach

[Step prompt — workflow instructions only. Behaviors are in traits.]

**MANDATORY OUTPUT FORMAT:**
Your complete text response becomes the output artifact. Do NOT describe what you would write — produce the actual content directly.

```markdown
# [Section]
## [Subsection]
[template showing the exact structure the next step expects]
```

⛔ ENFORCEMENT: [Critical rule — max 2-3 per step]

TASK: {task}
PREVIOUS: {previous}
```

**Config lines** go after `## agent-name`, before blank line:
`output:`, `reads:`, `model:`, `traits:`, `skills:`, `progress:`

**Variables**: `{task}` (original input), `{previous}` (prior step output), `{chain_dir}` (shared directory)

**Step prompt writing** (applying `prompting` skill):
- Behavioral instructions → traits (Level 3), NOT inline
- Workflow instructions → step body (Level 4)
- Enforcement blocks → step body, for rules causing cascading failures
- Output format → specify what the NEXT step expects

### ⚠️ Critical: Output Artifact Pattern

The agent's **text response** IS the artifact file. The `output:` config saves it automatically. Getting this wrong is the #1 chain failure mode.

**✅ CORRECT — agent produces content directly:**
```markdown
**MANDATORY OUTPUT FORMAT:**
Your complete text response becomes the output artifact. Do NOT describe what you would write — produce the actual content directly.
```

**❌ WRONG — agent writes a summary ABOUT the content:**
```markdown
**Output format — research.md:**
```
This phrasing triggers meta-description: the agent writes "Here's what I'd put in research.md..." instead of the actual research.

**❌ WRONG — agent tries to use file-write tools:**
```markdown
Write to `{chain_dir}/output.json` with this structure:
```
The `output:` config already handles file saving. Telling agents to write files causes tool-call loops or produces summaries about intended file content.

**Rules (apply to EVERY step in EVERY chain):**
1. Always use `**MANDATORY OUTPUT FORMAT:**` as the header (not "Output format — filename:")
2. Always include `Your complete text response becomes the output artifact. Do NOT describe what you would write — produce the actual content directly.` immediately after the header
3. Never reference `{chain_dir}` in step prompts — the `output:` config handles file paths
4. Never tell agents to "write to" or "save to" a file — their text response IS the file

### Skills in Chain Steps

Chain steps can inject **skills** — specialized instruction sets loaded into the step's system prompt alongside agent context and traits. Skills provide workflow knowledge too large or structured for a trait fragment.

**Syntax** (config line after `## agent-name`):
```
skills: linear-app-integration, advanced-context-engineering
skills: false          # explicitly disable (including agent defaults)
# omitted             # inherits agent's frontmatter skills: field
```

**Resolution cascade** (priority order):
1. **Step-level `skills:`** → overrides agent defaults
2. **Agent-level `skills:`** (from agent .md frontmatter) → used if step doesn't specify
3. **Chain-level skills** (passed via caller's `skill` param) → **merged** with either above
4. `skills: false` at step level → disables ALL skills for that step

**How it works at runtime**: Skill files are resolved, frontmatter stripped, content wrapped in `<skill>` tags, and appended to the step's system prompt after agent context + traits. Pi's built-in skill catalog is disabled (`--no-skills`) to prevent duplicate injection.

**When to use skills vs traits in chain steps:**

| Need | Use | Why |
|------|-----|-----|
| Behavioral shaping (3-5 lines) | `traits:` | Lightweight, composable, no file I/O |
| Domain workflow (20-150 lines) | `skills:` | Too large for a trait, reusable across chains |
| One-off step instructions | Step prompt body | Specific to this chain step only |
| Role + output format | Agent context file | Loaded automatically as Level 2 |

**Example**: A chain step that needs to work with Linear's API:
```markdown
## engineer
output: implementation.md
model: anthropic/claude-sonnet-4-6
traits: implementation, disciplined
skills: linear-app-integration
```

The engineer agent gets its context file (Level 2) + traits (Level 3) + the full linear-app-integration skill instructions in its system prompt, giving it domain knowledge without bloating the step prompt.

### Phase 4: VALIDATE

- [ ] Frontmatter has `name` and `description`
- [ ] Each `## agent-name` references an existing agent
- [ ] `output:`/`reads:` form coherent artifact flow
- [ ] Each artifact is self-contained (<2KB, structured)
- [ ] Each step has `**MANDATORY OUTPUT FORMAT:**` header with "Your complete text response becomes the output artifact" instruction
- [ ] No step uses `{chain_dir}`, "Write to", or "Output format — filename:" (these break artifact output)
- [ ] Skills specified only when step needs domain knowledge beyond traits (don't over-inject)
- [ ] `skills: false` used on steps that must NOT inherit agent-level skills
- [ ] Enforcement blocks ≤3 per step
- [ ] No step does research AND implementation (split them)
- [ ] Cheapest appropriate model per step (cheap < balanced < premium — see Model Tier Mapping)
- [ ] Total steps ≤7 (justify each)

## Maintaining a Chain

### When to Modify vs Create New

| Situation | Action |
|-----------|--------|
| Change agent for a step | Modify chain: swap `## agent-name`, update traits |
| Add a verification step | Modify chain: insert step, update artifact flow |
| Different workflow entirely | Create new chain |
| Step prompt too long (>50 lines) | Move behaviors to traits, keep workflow only |
| Step producing bad output | Check: traits correct? Output format specified? Model adequate? |

### Modifying a Step

1. **Change agent**: Update `## agent-name`. Verify agent exists and has compatible output format.
2. **Change traits**: Update `traits:` line. Verify traits exist in traits.yaml.
3. **Change model**: Update `model:` line. Consider cost vs quality trade-off.
4. **Change artifact flow**: Update `output:` and `reads:` on affected steps. Verify the chain still flows.
5. **After any change**: Walk through the chain mentally — does each step have what it needs?

### Debugging Chain Output

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Step writes summary ABOUT content instead of actual content | Missing "Your complete text response becomes the output artifact" instruction, or uses "Output format — filename:" header | Add MANDATORY OUTPUT FORMAT header with artifact instruction (see Critical: Output Artifact Pattern above) |
| Step tries to use write/bash tools to create artifact files | Prompt says "Write to {chain_dir}/file" | Remove all {chain_dir} references. The `output:` config handles file saving automatically |
| Step produces empty output | Model too weak for task, or output format unclear | Upgrade model or add explicit output format |
| Step ignores artifacts | `reads:` not set, or artifact name mismatch | Check `output:` of prior step matches `reads:` of this step |
| Step does wrong thing | Behavioral instruction in wrong level | Move from step body to trait, or vice versa |
| Step is too slow | Model too expensive for the task | Downgrade model tier (premium → balanced → cheap — see Model Tier Mapping) |
| Step violates a rule | Missing enforcement block | Add ⛔ ENFORCEMENT for the critical rule |
| Step lacks domain knowledge | No skill injected, or agent default overridden | Add `skills: skill-name` or remove `skills: false` |
| Step bloated with domain instructions | Inline instructions that should be a skill | Extract to a skill, reference via `skills:` config |
| Chain fails midway | Prior step's artifact wasn't self-contained | Enrich the output format spec on the producing step |

### Artifact Flow Debugging

Check the chain directory after a run:
```bash
ls /tmp/pi-chain-runs/<runId>/
# Should contain: research.md, plan.md, implementation.md, review.md, etc.
```

Read each artifact — is it self-contained? Could the next step work with ONLY this file?

## Understanding the Chain System

### How Chains Relate to the Four-Level Architecture

Chains are Level 4 (task-specific) but they COMPOSE all four levels:

```
## engineer                          ← selects Level 2 (agent context)
traits: implementation, disciplined  ← selects Level 3 (traits)
skills: linear-app-integration      ← injects skill content into system prompt
                                     ← Level 1 (APPEND_SYSTEM) NOT loaded in subprocess
Implement plan.md phase by phase.    ← Level 4 (task prompt)
```

The subprocess gets: Level 2 (agent .md) + Level 3 (traits via template) + skills as system prompt, and Level 4 (step body) as user message. Level 1 does NOT load in subprocesses. Skills bridge the gap between traits (3-5 lines) and the step prompt — they inject reusable domain knowledge (20-150 lines) without hardcoding it into the agent or step.

### Artifact Handoff = Compaction

Each artifact IS the compaction. The step explores broadly in its own context, then compresses findings into a structured document. The next step starts fresh and reads only the artifact.

**Good artifact**: Self-contained, structured, <2KB, answers what the next step needs.
**Bad artifact**: Requires follow-up questions, prose dump, references context not in the document.

### Model Selection for New Agents

When adding a step to a chain (or creating a new agent), ask two questions to pick the right provider and model.

**Question 1: Is this step primarily shaping the plan or architecture?**

Yes → Use **OpenAI GPT**. GPT-5.x excels at planning, decomposition, structured outputs, and trade-off reasoning.

| Scope | Model | Thinking | Fallback |
|-------|-------|----------|----------|
| Critical planning: requirement digestion, decomposition, risk analysis, test strategy | `openai-codex/gpt-5.4` | high | `anthropic/claude-opus-4-6` |
| Lighter coordination: PM, task routing, progress summaries, dependency graphs | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` |
| Code review, surgical patches, read→critique→modify | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` |

**Question 2: Is this step primarily manipulating code or reasoning over large technical context?**

Yes → Use **Anthropic Claude**. Claude ranks at or near the top for complex coding and long-context tasks.

| Scope | Model | Thinking | Fallback |
|-------|-------|----------|----------|
| Deep refactors, tricky logic, aligning implementation with design intent | `anthropic/claude-opus-4-6` | high | `openai-codex/gpt-5.4` |
| Day-to-day implementation, bug fixes, tests, moderate-context coding | `anthropic/claude-sonnet-4-6` | medium | `openai-codex/gpt-5.2` |

**Neither? The job is fetch, summarize, scout, or lightly transform:**

Use **Google Gemini Flash**. Great value for high-volume, expendable work where correctness is easy to verify.

| Scope | Model | Thinking | Fallback |
|-------|-------|----------|----------|
| File scanning, rough summaries, candidate surfacing, web research, boilerplate | `google/gemini-2.5-flash` | off | `openai-codex/gpt-5.2` |

### Provider Summary

```
Claude  → code manipulation, long-context reasoning (Opus=deep, Sonnet=day-to-day)
GPT     → planning, coordination, structured analysis (5.4=critical, 5.4-mini=routine+review)
Gemini  → cheap scouting, research, utility transforms (Flash=high-volume)
```

### Model Format in Chains

`model:` and `thinking:` are separate fields. Set both when overriding in a chain step.

```yaml
model: anthropic/claude-sonnet-4-6
thinking: medium
```

Formats: `anthropic/claude-{tier}-{version}`, `openai-codex/gpt-{version}`, `google/gemini-{version}`

**⛔ CRITICAL: Chain step `model:` overrides the agent default. When changing an agent's model, update BOTH the agent .md file AND every chain step that uses that agent with a `model:` override. If you only update the agent definition, chains will still use the old model.**

### Agent-to-Model Mapping (Current)

| Agent | Default model | Thinking | Fallback | Why this provider |
|-------|--------------|----------|----------|-------------------|
| scout | `google/gemini-2.5-flash` | off | `openai-codex/gpt-5.2` | Cheap scouting |
| eagle-scout | `anthropic/claude-sonnet-4-6` | medium | `openai-codex/gpt-5.2` | Deep code reasoning |
| researcher | `google/gemini-2.5-flash` | off | `openai-codex/gpt-5.2` | High-volume web research |
| engineer | `anthropic/claude-sonnet-4-6` | medium | `openai-codex/gpt-5.2` | Day-to-day coding |
| lead-engineer | `anthropic/claude-opus-4-6` | high | `openai-codex/gpt-5.4` | Deep refactors, architecture |
| planner | `openai-codex/gpt-5.4` | high | `anthropic/claude-opus-4-6` | Critical planning |
| reviewer | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` | Code review (read→critique→modify) |
| code-reviewer | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` | Code review |
| project-manager | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` | Coordination, task routing |
| context-builder | `openai-codex/gpt-5.4-mini` | low | `anthropic/claude-sonnet-4-6` | Meta-prompt generation |

## Reference

- Chain patterns: [chain-patterns.md](references/chain-patterns.md)
- Example prompts: [example-prompts.md](references/example-prompts.md)

**Related skills** — chains orchestrate the entire agent system:
- `agent-design` — Design the agents and traits that chain steps compose
- `prompting` — Write effective step prompts, output formats, and enforcement blocks
- `advanced-context-engineering` — Chains ARE compaction workflows. Understand the WHY.
- `skill-design` — If a chain step needs specialized instructions, consider a skill instead
- `run-chains` — Execute the chains you've built
