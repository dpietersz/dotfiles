# Second Brain Agent System

A comprehensive OpenCode agent system for building and maintaining a personal knowledge system using atomic notes, the Zettelkasten method, and markdown-based PKM (Personal Knowledge Management).

## Overview

This system provides a **primary agent** (`second-brain`) that orchestrates your knowledge management workflow, supported by **8 specialized subagents** and **11 commands** for different tasks.

### Key Philosophy

- **Question-Driven**: Agents ask questions to help you clarify and refine your thinking
- **Propose-First**: All changes are proposed with reasoning before execution
- **Maturity-Aware**: System tracks your progress through stages (Day 1 → Week 1 → Month 1 → Mature)
- **Atomic Principle**: One idea per note, self-contained, linkable
- **Guided, Not Dictated**: You provide the content; agents provide structure and guidance

## Primary Agent

### `second-brain`

The orchestrator for your entire knowledge management system.

**Responsibilities**:
- Track your system maturity level
- Route tasks to appropriate subagents
- Guide you through workflows
- Prevent common pitfalls
- Maintain system health

**When to use**: Start here for any knowledge management task

## Subagents

### 1. `note-clarifier`

Asks deep questions to refine fleeting notes into coherent ideas.

**Use when**: You have a vague idea you want to clarify
**Process**: Socratic questioning → refined understanding
**Output**: Clear articulation of your idea

### 2. `note-processor`

Converts clarified fleeting notes into permanent atomic notes.

**Use when**: You're ready to convert a fleeting note to permanent
**Process**: Structure proposal → user approval → file creation
**Output**: Properly formatted permanent note with ID, title, explanation, connections

### 3. `link-strategist`

Identifies meaningful connections between notes.

**Use when**: You want to find or create links for a note
**Process**: Analyze note → search existing notes → suggest links with reasoning
**Output**: 3-7 strategic links with explanations

### 4. `quality-checker`

Validates notes against guidelines and suggests improvements.

**Use when**: You want to ensure a note meets quality standards
**Process**: Validation checklist → identify issues → propose rewrites
**Output**: Validation report with improvement suggestions

### 5. `moc-architect`

Creates and maintains Maps of Content.

**Use when**: You have 7-10 notes on a topic and need organization
**Process**: Analyze clusters → propose MOC structure → create MOC
**Output**: Organized MOC with strategic groupings

### 6. `naming-specialist`

Ensures consistent naming conventions and IDs.

**Use when**: You want to audit or fix naming in your system
**Process**: Check conventions → identify inconsistencies → propose fixes
**Output**: Consistent naming across your system

### 7. `review-coordinator`

Guides daily, weekly, and monthly review workflows.

**Use when**: You want to maintain and evolve your system
**Process**: Guide through review questions → identify improvements → plan next steps
**Output**: Maintained system with new connections and insights

### 8. `pitfall-detector`

Identifies and prevents common mistakes.

**Use when**: You want to check for common pitfalls
**Process**: Analyze system → detect issues → suggest prevention
**Output**: Issues identified with solutions

## Commands

Quick shortcuts for common workflows:

### Review Workflows

- **`/daily-review`** (5-10 min): Process inbox, create permanent notes
- **`/weekly-review`** (30-60 min): Link notes, update MOCs, identify clusters
- **`/monthly-review`** (1-2 hours): Audit system, refine structure, archive projects

### Note Creation & Processing

- **`/create-fleeting`**: Capture new idea with guided clarification
- **`/process-fleeting`**: Convert fleeting note to permanent note
- **`/validate-note`**: Check note quality and suggest improvements

### Linking & Organization

- **`/find-links`**: Identify meaningful connections for a note
- **`/find-orphans`**: Find unlinked notes and suggest connections
- **`/create-moc`**: Create Map of Content for a topic

### Maintenance

- **`/check-pitfalls`**: Scan for common mistakes
- **`/fix-naming`**: Audit and fix naming conventions

## System Maturity Stages

The system tracks your progress through these stages:

- **Stage 0**: No system yet (Day 1)
- **Stage 1**: Folder structure created, first fleeting notes (Week 1)
- **Stage 2**: 5-10 permanent notes, basic linking (Week 2-3)
- **Stage 3**: 20-30 permanent notes, first MOC (Month 1)
- **Stage 4**: 50+ notes, multiple MOCs, regular reviews (Month 2+)
- **Stage 5**: Mature system with 100+ notes, advanced techniques (Month 3+)

The primary agent asks about your current stage at the start of each session and adjusts guidance accordingly.

## Recommended Workflows

### Getting Started (Day 1)

1. Create folder structure: `inbox/`, `literature/`, `permanent/`, `maps/`, `archive/`
2. Use `/create-fleeting` to capture your first idea
3. Use `/process-fleeting` to convert it to a permanent note
4. Use `/find-links` to find connections

### Building Momentum (Week 1)

1. Use `/daily-review` each day to process fleeting notes
2. Use `/weekly-review` to link notes and identify patterns
3. Create your first MOC when you have 7-10 notes on a topic

### Maintaining System (Month 1+)

1. Daily: `/daily-review` (5-10 min)
2. Weekly: `/weekly-review` (30-60 min)
3. Monthly: `/monthly-review` (1-2 hours)
4. As needed: `/check-pitfalls`, `/fix-naming`

## Key Concepts

### Atomic Notes

One idea per note, self-contained, ~half A4 page max.

**Title Format**: Complete sentence, not just topic
- ❌ "Linking"
- ✅ "Bidirectional links create emergent knowledge through explicit relationships"

### Note Types

- **Fleeting Notes**: Quick captures, temporary, tagged #fleeting
- **Literature Notes**: Summaries from sources in your own words
- **Permanent Notes**: Refined atomic ideas that live forever

### Naming Convention

- **ID Format**: YYYYMMDDHHMMSS (timestamp)
- **File Name**: Slugified title with hyphens
- **Aliases**: Alternative names for searching
- **Tags**: 3-5 most relevant tags

### Linking Strategy

- **Forward Links**: Where you're going (expands, applies, contradicts)
- **Backward Links**: What led here (supports, precedes)
- **Context is Critical**: Always explain WHY you're linking

### Maps of Content (MOCs)

Dynamic indexes created when 7-10 notes cluster on a topic.

**Types**:
- **Hub Notes**: Entry points to trains of thought
- **Structure Notes**: Organize ideas for developing arguments
- **Index MOCs**: Organize by category

## Common Pitfalls to Avoid

1. **Scope Creep**: Multiple ideas in one note ("and also...")
2. **Over-Fragmentation**: Notes too small to be useful
3. **Weak Connections**: Links without explanations
4. **Hoarding**: Capturing without processing
5. **Perfect System Paralysis**: Waiting for perfect system before starting
6. **Weak Titles**: Titles that don't capture the idea
7. **Orphan Notes**: Notes with no connections
8. **Inconsistent Naming**: Mix of naming conventions

Use `/check-pitfalls` to scan for these issues.

## File Structure

```
~/.config/opencode/
├── opencode.json              # Global configuration
├── agent/
│   ├── second-brain.md        # Primary orchestrator
│   ├── note-clarifier.md      # Question-driven clarification
│   ├── note-processor.md      # Convert to permanent notes
│   ├── link-strategist.md     # Find meaningful connections
│   ├── quality-checker.md     # Validate note quality
│   ├── moc-architect.md       # Create MOCs
│   ├── naming-specialist.md   # Ensure naming consistency
│   ├── review-coordinator.md  # Guide review workflows
│   └── pitfall-detector.md    # Prevent common mistakes
└── command/
    ├── daily-review.md
    ├── weekly-review.md
    ├── monthly-review.md
    ├── create-fleeting.md
    ├── process-fleeting.md
    ├── find-links.md
    ├── validate-note.md
    ├── create-moc.md
    ├── find-orphans.md
    ├── check-pitfalls.md
    └── fix-naming.md
```

## Getting Started

1. **Apply dotfiles**: `chezmoi apply` (if not already done)
2. **Start OpenCode**: `opencode` in your terminal
3. **Begin with**: `@second-brain` to start the primary agent
4. **First task**: Use `/create-fleeting` to capture your first idea
5. **Build momentum**: Use `/daily-review` each day

## Tips for Success

- **Start simple**: Don't wait for perfect system
- **Process regularly**: Daily reviews are key
- **Link intentionally**: Explain every connection
- **Iterate**: System improves over time
- **Trust the process**: Insights emerge from consistent practice
- **Ask questions**: Agents are here to guide, not dictate

## Advanced Techniques (Introduce Later)

- **Progressive Summarization**: 5 layers of highlighting and summarization
- **Hub Notes**: Entry points to trains of thought
- **Structure Notes**: Organize ideas for developing arguments
- **Bidirectional Semantic Links**: Explicit relationship explanations
- **Graph View Analysis**: Identify orphans, find relationships, spot themes

## Support

For detailed information about the Zettelkasten method and atomic note-taking, see:
- `docs/reference/second-brain-guide.md` - Complete methodology guide
- `.opencode/OPENCODE_AGENT_BEST_PRACTICES.md` - Agent architecture guide

---

**Remember**: This system is a tool to help you think better, not a system to maintain. Start simple, iterate, and let it evolve with your needs.
