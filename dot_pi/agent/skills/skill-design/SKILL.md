---
name: skill-design
description: Create, maintain, and validate pi skills with proper structure, prompt engineering, and progressive disclosure. Covers skill lifecycle from design through validation, dynamic loading patterns, and context budget optimization. Use when creating a skill, modifying a skill, validating skill structure, fixing skill format, or understanding how skills work.
---

# Skill Design

Complete skill lifecycle framework — creation, maintenance, and system understanding.

## How Skills Work

1. **Startup**: Pi scans skill locations, extracts `name` and `description` from YAML frontmatter
2. **System prompt**: Available skills listed as `<available_skills>` with name, description, location
3. **On match**: Agent uses `read` tool to load full SKILL.md (progressive disclosure)
4. **Execution**: Agent follows instructions, using relative paths for scripts and references

This is progressive disclosure — only descriptions are always in context. Full instructions load on-demand. The description is the most important line in the skill.

## Creating a Skill

### Phase 1: CLARIFY — Challenge the Request

Ask before building:
1. **What does this skill do?** (one sentence — if more, it's too broad)
2. **When should it trigger?** (specific phrases, not vague categories)
3. **What's the simplest version that solves the problem?**

Anti-overengineering checks:
- "Does this need to be a skill, or is it a one-off prompt?" → If used <3 times, probably not a skill
- "Can an existing skill handle this?" → Check existing skills first
- "How many reference files does this actually need?" → Most skills need zero

### Phase 2: RESEARCH — Read Before Building

1. Read [pi-skill-spec.md](references/pi-skill-spec.md) for format requirements
2. Read 1-2 existing skills for patterns (e.g., `prompting/SKILL.md`, `agent-design/SKILL.md`)
3. If the skill involves prompts, load the `prompting` skill
4. If the skill involves agents/chains, load `agent-design` or `chain-design`

### Phase 3: DESIGN — Structure

**Naming**: lowercase, kebab-case. `name` must match parent directory.

**Simple skill** (most cases):
```
my-skill/
└── SKILL.md
```

**Skill with references** (when SKILL.md would exceed ~150 lines):
```
my-skill/
├── SKILL.md              # Lean router (~80-120 lines)
├── patterns.md           # Loaded on-demand
└── references/
    └── examples.md       # Deep reference material
```

### Phase 4: WRITE — Create the Skill

```markdown
---
name: skill-name
description: What it does. Specific trigger phrases. Use when [scenarios].
---

# Skill Name

[1-2 sentence purpose.]

## [Workflow / Sections]

[Instructions. Imperative voice. Tell what TO do.]
```

**Writing guidelines** (from `prompting` skill):
- Imperative voice: "Read the config" not "You should read the config"
- Positive framing: "Write in prose" not "Don't use bullet points"
- Context budget: every line in SKILL.md consumes attention when loaded
- 1-3 examples beat paragraphs of rules
- ⛔ ENFORCEMENT blocks for critical rules only (2-3 max)

**Frontmatter rules**:
- `name`: 1-64 chars, lowercase a-z 0-9 hyphens, must match directory
- `description`: Max 1024 chars. Trigger-rich — this determines when the LLM loads the skill

### Phase 5: VALIDATE

- [ ] Directory name matches `name` field (lowercase, kebab-case)
- [ ] Description is trigger-rich and under 1024 chars
- [ ] SKILL.md is ≤150 lines (use dynamic loading if larger)
- [ ] Instructions use imperative voice, positive framing
- [ ] Reference files use relative paths from skill directory
- [ ] Cross-references to other skills use `load the [name] skill` pattern

## Maintaining a Skill

### When to Modify vs Create New

| Situation | Action |
|-----------|--------|
| New capability in existing domain | Modify the skill |
| Overlapping domain with different workflow | Merge into existing skill |
| Fundamentally different domain | Create new skill |
| Skill growing beyond 150 lines | Extract reference files, keep SKILL.md as router |

### Modification Checklist

- [ ] Description updated if capabilities changed
- [ ] New trigger phrases added to description if scope expanded
- [ ] Reference file paths still valid
- [ ] Cross-references to/from other skills still accurate
- [ ] SKILL.md still under 150 lines

### Dynamic Loading Pattern

When SKILL.md exceeds ~150 lines, split into router + reference files:

**SKILL.md** = Minimal router (80-120 lines): frontmatter, description, workflow overview, pointers to reference files

**Reference files** = Depth loaded on-demand: `patterns.md`, `standards.md`, `examples.md`

The agent loads SKILL.md first. If it needs more depth, it reads the reference file. This preserves context budget.

### Description Best Practices

The description is the SINGLE most important line. It determines routing — when the LLM loads the skill.

✅ Good: `Create and maintain subagents with traits. Use when creating an agent, modifying an agent, designing traits.`
❌ Bad: `Helps with agents.`
❌ Bad: `A comprehensive framework for the creation, management, and lifecycle maintenance of agents.` (verbose, wastes tokens)

## Understanding the Skill System

### Skill Discovery Locations (priority order)

| Location | Path | Priority |
|----------|------|----------|
| CLI | `--skill <path>` | Highest |
| Project | `.pi/skills/` | High |
| Packages | `skills/` in packages | Medium |
| Global | `~/.pi/agent/skills/` | Low |

### How Skills Relate to the Four-Level Architecture

Skills are loaded **on-demand into the primary agent context** (Level 1). They temporarily expand the context window with specialized instructions. This is different from agent context files (Level 2) which load in subprocesses.

**Implication**: Skills should be lean. A 500-line skill loaded into the primary agent's context alongside APPEND_SYSTEM.md, tool descriptions, and conversation history can push utilization past the 40-60% target.

### Skill vs Agent vs Trait

| Concept | What | When Loaded | Who Uses It |
|---------|------|-------------|-------------|
| **Skill** | Specialized workflow instructions | On-demand in primary context | Primary agent |
| **Agent context** | Role, knowledge, output format | In subprocess only | Subagent |
| **Trait** | Behavioral fragment (3-5 lines) | Composed into agent at runtime | Any subagent |

Don't create a skill when you need an agent (different execution context) or a trait (reusable behavior fragment).

## Reference

- Spec: [pi-skill-spec.md](references/pi-skill-spec.md)
- Prompts: [example-prompts.md](references/example-prompts.md)

**Related skills** — skills are one building block in the system:
- `prompting` — Apply prompt engineering standards when writing skill instructions
- `agent-design` — Understand when to create a skill vs an agent vs a trait
- `chain-design` — Skills can be loaded by chain steps via the `skills:` config line
- `advanced-context-engineering` — Skills use progressive disclosure, the core ACE pattern
- `run-chains` — Chains that use skills via `skills:` config
