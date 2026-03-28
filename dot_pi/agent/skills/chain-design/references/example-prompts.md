# Example Prompts — Research / Plan / Implement

Reference prompts from HumanLayer demonstrating the "Frequent Intentional Compaction" workflow. These are production prompts used in a 300k LOC Rust codebase. Study the patterns for chain step design.

**Source**: [humanlayer/humanlayer .claude/commands/](https://github.com/humanlayer/humanlayer/tree/main/.claude/commands)

## Research Prompt — Key Patterns

**Purpose**: Understand codebase as-is. Document, don't judge.

**Critical constraint (front-loaded)**:
```
YOUR ONLY JOB IS TO DOCUMENT AND EXPLAIN THE CODEBASE AS IT EXISTS TODAY
- DO NOT suggest improvements
- DO NOT propose future enhancements
- ONLY describe what exists, where, how
```

**Execution pattern**:
1. Read mentioned files FULLY first (before spawning sub-tasks)
2. Decompose into composable research areas
3. Spawn parallel sub-agents for different aspects
4. Wait for ALL to complete before synthesizing
5. Generate structured research document

**Output format** — structured, self-contained:
```markdown
## Summary
## Detailed Findings (with file:line references)
## Code References
## Architecture Documentation
## Open Questions
```

**Key enforcement**: "ALWAYS read mentioned files first before spawning sub-tasks" — critical ordering prevents context corruption.

## Planning Prompt — Key Patterns

**Purpose**: Create actionable implementation plan through interactive iteration.

**Interactive, not one-shot**:
1. Read all context files completely
2. Spawn research to gather understanding
3. Present understanding + focused questions
4. Get alignment on structure before details
5. Get alignment on details before finalizing
6. Iterate based on feedback

**Skeptical by default**:
```
Be Skeptical:
- Question vague requirements
- Identify potential issues early
- Ask "why" and "what about"
- Don't assume — verify with code
```

**No open questions rule**:
```
If you encounter open questions during planning, STOP.
Research or ask for clarification immediately.
Do NOT write the plan with unresolved questions.
```

**Output format** — phased with verification:
```markdown
## Phase N: [Name]
### Changes Required
File: path — Changes: [specific]
### Success Criteria
#### Automated Verification
- [ ] Command: result
#### Manual Verification
- [ ] Human checks: what to verify

Implementation Note: After automated verification passes,
pause for manual confirmation before proceeding.
```

## Implementation Prompt — Key Patterns

**Purpose**: Execute the plan, phase by phase, adapting to reality.

**Plan-follows-reality**:
```
Follow the plan's intent while adapting to what you find.
Implement each phase fully before moving to the next.
```

**Mismatch handling**:
```
Issue in Phase [N]:
Expected: [what plan says]
Found: [actual situation]
Why this matters: [explanation]
How should I proceed?
```

**Human verification gates**:
```
Phase [N] Complete — Ready for Manual Verification
Automated verification passed: [list]
Please perform manual verification: [list from plan]
Let me know when complete so I can proceed to Phase [N+1].
```

**Resume capability**: Check for existing checkmarks (`- [x]`) and pick up from first unchecked item.

## Applying to Chain Design

### What Makes These Prompts Effective

1. **Single responsibility** — Each prompt does ONE thing (research, plan, implement)
2. **Self-contained output** — Each produces an artifact the next step can consume independently
3. **Interactive where needed** — Planning is interactive (human reviews). Implementation is autonomous.
4. **Front-loaded constraints** — Most important rules at the top
5. **Bounded failure** — Max attempts, pause on mismatch, human escalation
6. **Structured output** — Every prompt specifies exact output format
7. **Fresh context per step** — Each step starts clean, reads only its artifacts

### Mapping to Chain Steps

| HumanLayer Prompt | Chain Equivalent | Artifact |
|-------------------|-----------------|----------|
| research_codebase | scout step | research.md |
| create_plan | planner step | plan.md |
| implement_plan | engineer step | commits + implementation.md |

### The Leverage Hierarchy

From Advanced Context Engineering:
> A bad line of code is a bad line of code.
> A bad line of a **plan** could lead to hundreds of bad lines of code.
> A bad line of **research** could lead to thousands of bad lines of code.

This is why:
- Research uses parallel sub-agents for thoroughness
- Planning is interactive with human review
- Implementation is autonomous but bounded (max 3 fix attempts)

Focus human attention on research and plans. Let the agent handle implementation autonomously.
