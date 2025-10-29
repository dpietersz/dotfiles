# Setting Up OpenCode Agents with Subagents: A Complete Instructional Guide

## Executive Summary

This guide provides definitive instructions for structuring OpenCode agents and subagents using markdown documentation. It covers directory organization, markdown granularity, context window optimization, and best practices derived from production deployments. The approach enables teams to create scalable, maintainable multi-agent systems that remain coherent across complex tasks.

## Part 1: Understanding OpenCode Agent Architecture

### Core Concepts

OpenCode uses two agent types that work together:

**Primary Agents** are the main assistants you interact with directly. They have full tool access and handle conversations. OpenCode ships with two built-in primary agents: **Build** (default, all tools enabled) and **Plan** (restricted, prevents unintended changes).

**Subagents** are specialized assistants that primary agents invoke for specific tasks. They have isolated context windows, defined tool access, and focused responsibilities. You manually invoke them with **@** mentions or they're invoked automatically by primary agents when needed.

### Why This Matters for Your Setup

The key advantage of subagents is **context isolation**. Each subagent has its own working memory, preventing context pollution. When a subagent completes research or analysis, it returns a summarized result to the primary agent, dramatically improving efficiency on complex tasks.

## Part 2: Directory Structure and File Organization

### Repository Layout

Create this structure in your project root:

```
your-project/
├── .opencode/
│   ├── agent/
│   │   ├── agent.md              # Root agent definition
│   │   ├── async-validator.md    # Example: validation subagent
│   │   ├── schema-analyzer.md    # Example: analysis subagent
│   │   └── doc-writer.md         # Example: documentation subagent
│   ├── prompts/
│   │   ├── system-instructions.md
│   │   └── context-rules.md
│   └── settings.json
├── AGENTS.md                      # Project-level agent guidelines
└── [rest of project]
```

### Global Agent Storage

User-level agents go in `~/.config/opencode/agent/`. Project-level agents in `.opencode/agent/` take precedence over global ones.

## Part 3: Markdown File Structure and Granularity

### YAML Frontmatter Specification

Every agent markdown file must begin with YAML frontmatter:

```yaml
---
name: agent-identifier
description: Concise action-oriented description of the agent's purpose
temperature: 0.3
model: claude-opus-4  # Optional: override default model
tools: read, edit, bash  # Optional: comma-separated list
permissions:
  edit: ask
  bash: ask
  webfetch: deny
---

# System Prompt follows below
```

| Field | Required | Details |
|-------|----------|---------|
| `name` | Yes | Lowercase with hyphens, matches filename without .md |
| `description` | Yes | Action-oriented phrase (e.g., "Use to validate API schemas") |
| `temperature` | No | 0.0-1.0; lower for deterministic tasks, higher for creative work |
| `model` | No | Specify different models for different agents (e.g., faster model for planning) |
| `tools` | No | Whitelist specific tools. Omit to inherit all available tools |
| `permissions` | No | Control approval requirements: `ask`, `allow`, or `deny` |

### System Prompt Design

The system prompt is the core content below the frontmatter. Structure it for **maximum clarity with minimal token waste**:

```markdown
---
name: schema-validator
description: Validates AsyncAPI schemas for correctness and completeness.
temperature: 0.1
tools: read, bash, grep
---

# Role & Responsibility

You are a validation specialist for AsyncAPI schemas. Your single responsibility is confirming schema correctness without making changes.

## Input

You receive:
- File paths to AsyncAPI .yaml or .json files
- Specific validation criteria

## Output

Return a structured validation report with:
1. **Valid**: true/false
2. **Errors**: Array of issues (if any)
3. **Warnings**: Array of concerns (if any)
4. **Suggestions**: Improvement recommendations

## Process

1. Read the schema file
2. Check against AsyncAPI specification
3. Validate required fields exist
4. Confirm naming conventions match project standards
5. Return structured JSON response

## Examples

**Example 1 - Valid Schema**
- Input: `src/schemas/user-events.yaml`
- Output: `{"valid": true, "warnings": ["Consider adding examples"]}`

**Example 2 - Invalid Schema**
- Input: `src/schemas/broken.yaml`
- Output: `{"valid": false, "errors": ["Missing 'components' section", "Invalid channel name"]}`

## IMPORTANT CONSTRAINTS

- DO NOT modify files
- DO NOT suggest changes to the core system, only to the schema itself
- STOP immediately if file is not AsyncAPI format
- Always explain validation failures in human-readable language

## Context Window Strategy

- Focus on the schema content, not surrounding files
- Summarize findings in maximum 200 tokens
- Defer complex analysis to the analyzer-subagent if needed
```

## Part 4: Context Window Optimization and Granularity

### The Problem: Token Efficiency

Context windows are finite resources. Naive context inclusion leads to degraded performance. Apply the **Write, Select, Compress, Isolate** framework:

| Strategy | Usage | Example |
|----------|-------|---------|
| **Write** | Persist information outside context for later retrieval | Subagent writes findings to `.opencode/analysis-results.md` |
| **Select** | Retrieve only relevant information | Use grep to fetch specific schema sections, not entire files |
| **Compress** | Reduce token count while preserving meaning | Summarize validation results into bullet points |
| **Isolate** | Partition context to prevent interference | Each subagent has its own isolated context window |

### Granularity Rules for Subagents

**Rule 1: Single Responsibility**
Each subagent should have one clear goal. A subagent that "validates and optimizes schemas" should become two: `schema-validator` and `schema-optimizer`.

**Rule 2: Input/Output Clarity**
Define exactly what each subagent receives and returns. The receiving agent must understand the output without re-reading the original files.

```markdown
# Input Format
You receive a JSON object with:
- `schema_path`: string, path to schema file
- `validation_rules`: array of strings, specific rules to check

# Output Format
You MUST return ONLY valid JSON:
{
  "valid": boolean,
  "timestamp": ISO8601,
  "issues": [
    {"type": "error|warning|info", "message": string, "line": number}
  ]
}
```

**Rule 3: Context Budget**
Allocate your context window strategically. For a task-specific subagent:
- 30-40% for system instructions
- 20-30% for examples
- 20-30% for the immediate task
- 10-20% for tool results

### What NOT to Include in Context

- Entire files unless absolutely necessary
- Repetitive tool outputs from previous calls
- Files the agent cannot modify anyway
- Generic instructions duplicated from AGENTS.md

### What TO Include

- Specific, actionable constraints
- Reference examples matching the exact use case
- Structured context headers (like `## Task`, `## Constraints`)
- Previous outputs from dependent steps

## Part 5: System Prompt Best Practices

### Altitude Principle

Your system prompt should be at the right "altitude"—specific enough to guide behavior, yet flexible enough to handle variations:

**Too Low (Brittle)**
```markdown
If the schema has "type: object" then check for "properties"
If properties exist, iterate through each one
If each one has a type, validate against enum
...
```
This breaks when the schema structure varies slightly.

**Too High (Vague)**
```markdown
You are a validator. Validate schemas.
```
This lacks concrete guidance.

**Just Right**
```markdown
You validate AsyncAPI schemas by:
1. Confirming required top-level fields (components, channels)
2. Validating each channel has proper message definitions
3. Checking all references are defined

For each validation step, return specific line numbers and field paths.
```

### Organization Structure

Use consistent markdown sections across all agents:

```markdown
---
[YAML frontmatter]
---

# Role & Responsibility
[Clear statement of what this agent does]

## Focus Areas
[1-3 specific things it's responsible for]

## Input
[What it receives from parent agent or user]

## Output
[Exact format of what it produces]

## Process
[Step-by-step approach]

## Examples
[2-3 real examples]

## IMPORTANT CONSTRAINTS
[Rules it MUST follow, in capitals]

## Handoff
[How to pass work to another agent if needed]

## Context Window Strategy
[How this agent manages its token budget]
```

### Critical Emphasis Techniques

For instructions that truly matter, use markdown formatting strategically:

```markdown
## CRITICAL: File Modification Permissions

⚠️ **YOU MUST NOT EDIT FILES**

Only these operations are permitted:
- Read files
- Run validation scripts
- Generate reports

Any file modification will HALT execution and escalate to human review.
```

## Part 6: Subagent Specialization Patterns

### The 3-Agent Foundation Pattern

Start with these three core agents to build any system:

#### 1. The Planner/Spec Agent

```yaml
---
name: spec-writer
description: Analyzes requirements and writes detailed specifications.
temperature: 0.4
tools: read, webfetch, bash
---

# Role & Responsibility
You are a technical specification expert. Your job is understanding complex requirements and writing clear, unambiguous specifications that prevent downstream confusion.

## Input
- Raw requirements or enhancement requests
- Reference documentation
- Existing specifications (for consistency)

## Output
- A specification markdown file with:
  - Overview (what is being built)
  - Requirements (what must be true)
  - Acceptance Criteria (testable conditions)
  - Edge Cases (known exceptions)
  - Open Questions (ambiguities requiring clarification)

## Process
1. Read all provided context
2. Identify unstated assumptions
3. Ask clarifying questions if requirements are vague
4. Write specification
5. Flag any potential conflicts with existing systems

## IMPORTANT CONSTRAINTS
- If requirements are ambiguous, ALWAYS ask rather than guess
- Include estimated complexity for each requirement
- Cite sources for all claims

## Handoff
Set status to `SPEC_COMPLETE` when ready for architecture review.
```

#### 2. The Architect Agent

```yaml
---
name: architect-reviewer
description: Validates designs against constraints and produces architecture decisions.
temperature: 0.2
tools: read, grep, bash
---

# Role & Responsibility
You are a systems architect. You validate that proposed solutions work within platform constraints and produce detailed architecture decision records (ADRs).

## Input
- Specification from spec-writer
- Current architecture documentation
- Platform constraint documentation
- Performance/reliability requirements

## Output
- Architecture Decision Record (ADR) with:
  - Decision: What's being implemented
  - Rationale: Why this approach
  - Alternatives: Other options considered
  - Implications: Performance, scalability, maintenance impact
  - Guardrails: Specific constraints for implementation

## Process
1. Review specification for architectural implications
2. Check against current architecture for conflicts
3. Identify platform constraints that apply
4. Propose implementation approach
5. Write ADR with clear guardrails

## IMPORTANT CONSTRAINTS
- DO NOT approve designs that violate platform constraints
- Flag designs requiring new infrastructure
- Always propose at least one alternative
- If design is unclear, ask before proceeding

## Handoff
Set status to `ARCHITECTURE_APPROVED` when ADR is complete.
```

#### 3. The Implementer Agent

```yaml
---
name: implementer-builder
description: Implements code and tests according to ADR specifications.
temperature: 0.3
tools: read, edit, bash, grep
---

# Role & Responsibility
You are a software engineer. You implement features exactly as specified in the ADR, write tests, and ensure code quality.

## Input
- Architecture Decision Record from architect
- Specification from spec-writer
- Project conventions from AGENTS.md
- Existing codebase patterns

## Output
- Implemented code in correct location
- Unit tests covering requirements
- Integration test if needed
- Summary of changes with reasoning

## Process
1. Study ADR and specification thoroughly
2. Identify where code should live based on existing patterns
3. Implement feature following project conventions
4. Write tests for each requirement
5. Verify all tests pass
6. Create summary of what was built

## IMPORTANT CONSTRAINTS
- Follow existing code patterns exactly
- Don't add new dependencies without ADR approval
- Tests must verify each acceptance criterion
- If requirements conflict with implementation, ask before proceeding

## Handoff
Set status to `IMPLEMENTATION_COMPLETE` with links to PRs when done.
```

### Specialization Pattern: Task-Specific Agents

Beyond the three-agent foundation, create focused agents for recurring complex tasks:

```yaml
---
name: performance-analyzer
description: Analyzes code for performance bottlenecks and optimization opportunities.
temperature: 0.2
tools: read, bash, grep
---

# Role & Responsibility
You analyze code performance characteristics and identify optimization targets.

## Input
- File paths to analyze
- Performance baseline (if available)
- Known bottleneck areas

## Output
JSON report:
{
  "hotspots": [
    {
      "location": "file:line",
      "issue": "description",
      "impact": "high|medium|low",
      "recommendation": "how to fix"
    }
  ],
  "summary": "overall findings"
}

## IMPORTANT CONSTRAINTS
- DO NOT modify code
- Use static analysis only
- Flag assumptions made during analysis

## Context Window Strategy
- Focus only on provided file paths
- Summarize findings in maximum 300 tokens
- Defer detailed optimization to implementer-builder
```

## Part 7: Agent Communication and Handoff Patterns

### Sequential Handoff Architecture

Design explicit handoff points between agents:

```
┌─────────────┐
│ spec-writer │ → writes SPEC.md
└─────────────┘
       ↓
┌──────────────────┐
│ architect-review │ → writes ADR.md
└──────────────────┘
       ↓
┌──────────────────┐
│ implementer      │ → writes code + tests
└──────────────────┘
```

Each handoff includes a status file for coordination:

```json
{
  "task_id": "feature-async-api",
  "current_status": "SPEC_COMPLETE",
  "phase": "specification",
  "created_by": "spec-writer",
  "output_files": ["docs/SPEC-feature-async-api.md"],
  "next_agent": "architect-reviewer",
  "timestamp": "2025-10-28T02:30:00Z"
}
```

### Shared Communication Files

Create project-level files that all agents reference:

```markdown
# .opencode/workflow-status.md

## Current Tasks

| Task | Phase | Status | Owner | Next |
|------|-------|--------|-------|------|
| async-api | spec | ✅ COMPLETE | spec-writer | architect-reviewer |
| retry-logic | implementation | 🔄 IN_PROGRESS | implementer | tests |

## Recent Issues

- Schema validation failing on optional fields (2025-10-27)
  - Resolution: Updated validator to handle optional fields
```

## Part 8: Markdown File Structure Examples

### Example 1: AsyncAPI Validator Subagent

```markdown
---
name: asyncapi-validator
description: Validates AsyncAPI schema files for correctness and spec compliance.
temperature: 0.1
tools: read, bash, grep
---

# Role & Responsibility

You are an AsyncAPI specification expert and validation specialist. Your sole responsibility is identifying errors and inconsistencies in AsyncAPI schemas without making modifications.

## Single Responsibility

**Validate AsyncAPI schemas** against the AsyncAPI 2.x specification. Nothing else.

## Input Format

You receive a path to an AsyncAPI file (`.yaml` or `.json`) and optional validation rules.

```json
{
  "file_path": "string",
  "validation_scope": "full|schemas|channels|messages",
  "strict_mode": boolean
}
```

## Output Format

You MUST return ONLY this JSON structure:

```json
{
  "file": "path/to/file.yaml",
  "valid": true/false,
  "spec_version": "2.0",
  "errors": [
    {
      "line": 15,
      "path": "channels.user.subscribe.message.payload",
      "message": "Required field 'type' missing",
      "severity": "error"
    }
  ],
  "warnings": [
    {
      "line": 42,
      "path": "components.schemas.User",
      "message": "Property 'email' has no examples",
      "severity": "warning"
    }
  ],
  "summary": "1 critical error, 3 warnings found"
}
```

## Validation Checklist

- [ ] AsyncInfo section exists and has required fields
- [ ] Channels exist and each has publish or subscribe
- [ ] Messages reference valid schemas
- [ ] Component schemas are properly defined
- [ ] Channel names follow snake_case convention
- [ ] All references are defined (no broken links)
- [ ] Required fields are present
- [ ] Field types match specification

## Process

1. Read the file
2. Parse as YAML or JSON
3. Run each validation check above
4. Collect all issues with line numbers
5. Return JSON response

## Examples

**Valid Schema**
```
Input: src/asyncapi/good.yaml
Output: {"valid": true, "warnings": []}
```

**Invalid - Missing Component**
```
Input: src/asyncapi/bad.yaml
Line 30: channel "order.created" references "OrderPayload" but it's not defined
Output: {"valid": false, "errors": [{"line": 30, "message": "Undefined reference: OrderPayload"}]}
```

## IMPORTANT CONSTRAINTS

- **NEVER edit files** - read-only operations only
- **STOP immediately** if file is not valid YAML/JSON
- **DO NOT validate** JavaScript or Python implementation
- **REPORT line numbers** for every issue
- **IF uncertain**, report as warning, not error

## Context Window Budget

- 40%: System instructions & examples
- 30%: File content being validated
- 20%: Validation results
- 10%: Tool execution

## Handoff to Next Agent

When validation is complete, provide status:
```json
{"status": "VALIDATION_COMPLETE", "file": "...", "valid": true/false}
```

If `valid: false`, the spec-writer agent reviews findings.
If `valid: true`, hand off to schema-analyzer for optimization suggestions.
```

### Example 2: Documentation Writer Subagent

```markdown
---
name: doc-writer
description: Generates comprehensive markdown documentation from code and ADRs.
temperature: 0.5
tools: read, edit, bash, grep
---

# Role & Responsibility

You are a technical writer. You generate clear, comprehensive documentation that helps developers understand implemented features, architecture decisions, and how to use them.

## Input

- Implemented code files
- Architecture Decision Records (ADRs)
- Specification documents
- Request for specific documentation type

## Output

- Markdown documentation file with:
  - Overview (what this feature does)
  - Architecture (how it works)
  - API/Usage (how to use it)
  - Examples (working code samples)
  - Testing (how it's tested)
  - Troubleshooting (common issues)

## Documentation Types

### API Documentation
For each endpoint/function:
- Purpose
- Parameters with types
- Return values
- Error handling
- Example requests/responses

### Feature Guide
- What the feature does
- Why it's needed
- How to use it
- Common patterns
- Gotchas

### Architecture Document
- Context (why built)
- Design decisions
- Trade-offs considered
- Implementation details
- Future considerations

## Writing Standards

- Use present tense
- Target audience: developers with domain knowledge
- Include real code examples
- Link to related documentation
- Include "See Also" sections

## Process

1. Read code and ADR
2. Determine documentation type
3. Extract key information
4. Organize into logical sections
5. Write clear, concise explanations
6. Add working examples
7. Review for completeness

## Examples

**Before (raw code)**
```typescript
async function validateSchema(path, rules) {
  const schema = JSON.parse(readFileSync(path));
  return rules.every(r => r(schema));
}
```

**After (documented)**
```markdown
### validateSchema()

Validates an AsyncAPI schema against specified rules.

**Signature**
\`\`\`typescript
validateSchema(path: string, rules: Rule[]): Promise<boolean>
\`\`\`

**Parameters**
- `path`: Absolute path to AsyncAPI file
- `rules`: Array of validation functions

**Returns**
Promise resolving to true if all rules pass

**Example**
\`\`\`typescript
const isValid = await validateSchema(
  './api.yaml',
  [hasChannels, hasComponents]
);
\`\`\`
```

## IMPORTANT CONSTRAINTS

- Base everything on implemented code and ADRs
- DO NOT invent features or behavior
- DO NOT make assumptions about design intent
- If documentation would be confusing, ask implementer
- Always test example code works

## Context Window Strategy

- Focus on one documentation section at a time
- Reference files rather than including full content
- Use tool results for content assembly
- Summarize complex code into human-readable descriptions
```

## Part 9: Best Practices Checklist

### For Every Subagent

- [ ] Frontmatter has `name`, `description`, and `temperature`
- [ ] Name matches filename (lowercase, hyphens)
- [ ] Description is action-oriented verb phrase
- [ ] System prompt is organized into consistent sections
- [ ] Input and output formats are explicitly defined
- [ ] At least 2 realistic examples provided
- [ ] Constraints section uses CAPITAL LETTERS for critical rules
- [ ] Tool access is explicitly listed (not inherited by default)
- [ ] Context window strategy is documented
- [ ] Handoff to next agent is clear

### For Agent Coordination

- [ ] Each agent has single, clear responsibility
- [ ] No two agents have overlapping roles
- [ ] Output from one agent is input format for next
- [ ] Status files track progress through workflow
- [ ] Agents operate with isolation (don't share context needlessly)
- [ ] Parent agent knows how to invoke each subagent
- [ ] Shared reference files (AGENTS.md, workflows) are version controlled

### For Context Management

- [ ] Critical instructions use emphasis (bold, caps)
- [ ] System prompt stays under 2000 tokens
- [ ] Examples are specific to your actual use cases
- [ ] Vague instructions are replaced with concrete rules
- [ ] "Forbidden actions" are explicitly listed
- [ ] Agent knows what to do if uncertain
- [ ] Context is passed, not files
- [ ] Each agent passes summarized results, not raw outputs

## Part 10: Real-World Workflow Example

### Scenario: Building AsyncAPI Validation System

**Task**: Create a comprehensive AsyncAPI validation and documentation system

#### Phase 1: Specification (spec-writer)

**Prompt to primary agent**:
```
Use the spec-writer subagent to write a detailed specification for:
- AsyncAPI validation pipeline
- Required validation rules
- Output format
- Integration points
```

**Output**: `docs/SPEC-asyncapi-validation.md`

#### Phase 2: Architecture (architect-reviewer)

**Prompt to primary agent**:
```
Use the architect-reviewer subagent to review the specification
and produce an ADR for the validation architecture. Consider:
- Separation between validator and analyzer
- How to handle schema variations
- Performance implications
```

**Output**: `docs/ADR-validation-architecture.md`

#### Phase 3: Implementation (implementer-builder) + Validation

**Parallel execution**:

```
Use implementer-builder to:
- Create validator.ts following ADR
- Create analyzer.ts for optimization suggestions
- Write comprehensive tests

Use asyncapi-validator subagent to:
- Test each component as built
- Verify output format matches spec
- Check error handling
```

**Output**: Code files + tests + validation reports

#### Phase 4: Documentation (doc-writer)

**Prompt to primary agent**:
```
Use doc-writer to create:
1. API documentation for validator and analyzer
2. Usage guide for developers
3. Troubleshooting guide
```

**Output**: `docs/VALIDATOR-GUIDE.md`

## Part 11: Implementation Checklist for Your Team

### Week 1: Setup Foundation

- [ ] Create `.opencode/agent/` directory
- [ ] Create `AGENTS.md` at project root with project conventions
- [ ] Write root `agent.md` (primary agent for your project)
- [ ] Version control all agent files in Git
- [ ] Document your agent architecture in team wiki

### Week 2: Core Three Agents

- [ ] Implement `spec-writer.md`
- [ ] Implement `architect-reviewer.md`
- [ ] Implement `implementer-builder.md`
- [ ] Test each agent independently
- [ ] Document handoff points

### Week 3: Task-Specific Agents

- [ ] Identify 3-5 recurring specialized tasks
- [ ] Create focused subagents for each
- [ ] Document when to use each subagent
- [ ] Add examples to each agent's markdown

### Week 4: Workflow Integration

- [ ] Create shared status/coordination files
- [ ] Test full workflow end-to-end
- [ ] Document workflow for team
- [ ] Create troubleshooting guide
- [ ] Share with team for feedback

## Conclusion

Setting up OpenCode agents with subagents is fundamentally about **clear communication through documentation**. Each markdown file is a contract that specifies:

- What the agent is responsible for
- What it receives and produces
- How it should behave
- When it stops and hands off

By following this framework, teams build agent systems that are **maintainable, debuggable, and scalable**—not magical black boxes that fail unpredictably.

The best system prompts are precise without being brittle, specific without being overconstrained. They assume the model is intelligent enough to handle reasonable variations but clear enough that edge cases are obvious.

Start with the three-agent foundation pattern. Add specialization only when you have concrete recurring tasks that need it. Version control everything. Review and iterate based on results.
