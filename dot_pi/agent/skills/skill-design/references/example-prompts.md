# Example Prompts — Advanced Context Engineering

These prompts from HumanLayer demonstrate effective prompt engineering for coding agents using the "research → plan → implement" workflow (Frequent Intentional Compaction). Study the patterns, not the specifics — these are for Claude Code, not pi, but the principles are universal.

**Source**: [humanlayer/humanlayer](https://github.com/humanlayer/humanlayer/tree/main/.claude/commands)

## Key Patterns to Extract

### 1. Role Clarity Without Anthropomorphizing
Each prompt defines WHAT the agent should do, not WHO it should be. "You are tasked with..." not "You are a senior developer..."

### 2. Critical Constraints Up Front
```
## CRITICAL: YOUR ONLY JOB IS TO DOCUMENT AND EXPLAIN THE CODEBASE AS IT EXISTS TODAY
- DO NOT suggest improvements or changes unless explicitly asked
- DO NOT propose future enhancements
- ONLY describe what exists, where it exists, how it works
```
The most important constraints go first, in bold, with explicit negations.

### 3. Mandatory Output Format
Every prompt specifies exact output structure. The research prompt mandates:
```markdown
## Summary
[2-3 sentences]

## Key Files
- `path/to/file:line` - [description]

## Architecture
- Input: [where data comes from]
- Processing: [key components]
- Output: [where data goes]
```

### 4. Step-by-Step Execution Order
```
Steps:
1. Read mentioned files first (before spawning sub-tasks)
2. Analyze and decompose
3. Spawn parallel research tasks
4. Wait for ALL tasks to complete
5. Synthesize findings
6. Generate document
```
Critical ordering is enforced with bold warnings about what must happen before what.

### 5. Interactive Planning (create_plan.md)
The plan prompt doesn't jump to writing. It:
1. Reads all context files completely first
2. Spawns research to gather understanding
3. Presents understanding and asks focused questions
4. Gets alignment before writing structure
5. Gets alignment before writing details
6. Iterates based on feedback

Key principle: "No Open Questions in Final Plan" — if you encounter unknowns, STOP and resolve before continuing.

### 6. Plan-Follows-Reality (implement_plan.md)
```
Plans are carefully designed, but reality can be messy. Your job is to:
- Follow the plan's intent while adapting to what you find
- Implement each phase fully before moving to the next
```
The implementation doesn't blindly follow the plan — it adapts when reality diverges, but notes the deviation.

### 7. Human Verification Gates
```
After completing all automated verification for a phase, pause and inform the human
that the phase is ready for manual testing.
```
Separates automated verification (the agent runs) from manual verification (the human checks).

### 8. ISC Criteria (from our implementation chain)
Every phase has Independent, Specific, Checkable success criteria:
- **"And"/"With" test**: Contains "and" joining two things? → split
- **Independent failure test**: Can part A pass while B fails? → separate
- **Scope word test**: Uses "all", "every", "complete"? → enumerate
- **Domain boundary test**: Crosses UI/API/data? → one per boundary

### 9. Enforcement Blocks
For rules that absolutely cannot be violated:
```
⛔ ENFORCEMENT: You MUST NOT set any issue to `Done`.
Only `In Progress` (start) and `In Review` (after commit).
```
These stand out visually and prevent the most common agent mistakes.

### 10. Artifact Handoff
Each step produces a structured artifact consumed by the next:
- Research → `research.md` (structured findings)
- Plan → `plan.md` (phased implementation with ISC criteria)
- Implementation → commits + `implementation.md` (what changed)
- Review → `review.md` (findings, deviations, concerns)

The artifacts ARE the compaction. Each step's full context exploration gets distilled into a dense handoff document.

## Applying These Patterns to Skills

When writing a skill's SKILL.md:
1. **Define the output format** — What does the skill produce? Specify it.
2. **Order steps by execution** — Don't describe, prescribe.
3. **Front-load constraints** — Most important rules first.
4. **Include enforcement blocks** — For rules that cause cascading failures if violated.
5. **Design for context budget** — Reference files load on-demand. SKILL.md should be the lean router.
6. **Challenge the scope** — Before building, ask: is this the simplest version that works?
