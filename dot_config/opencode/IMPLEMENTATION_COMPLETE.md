# Second Brain Agent System - Implementation Complete ✅

## Overview

A comprehensive OpenCode agent system for building and maintaining a personal knowledge system using atomic notes, the Zettelkasten method, and markdown-based PKM (Personal Knowledge Management).

**Status**: ✅ Complete and ready to use
**Location**: `~/.config/opencode/` (via chezmoi from `dot_config/opencode/`)
**Scope**: Global system-wide availability

## Architecture

### Primary Agent

**`second-brain`** - Orchestrator for your entire knowledge management system

- **Mode**: Primary (full tool access)
- **Temperature**: 0.4 (balanced for guidance and creativity)
- **Responsibilities**:
  - Track system maturity across sessions
  - Route tasks to appropriate subagents
  - Guide users through workflows
  - Prevent common pitfalls
  - Maintain system health

**Key Features**:
- Reads MATURITY_TRACKER.md at session start
- Invokes subagents with structured context
- Synthesizes subagent results into guidance
- Proposes changes before executing
- Updates maturity tracker at session end

### Subagents (8 Specialized Assistants)

Each subagent has isolated context and specific responsibilities:

| Subagent | Purpose | Temperature | Tools |
|----------|---------|-------------|-------|
| **note-clarifier** | Ask clarifying questions to refine ideas | 0.5 | read, bash |
| **note-processor** | Convert fleeting notes to permanent notes | 0.3 | read, edit, bash |
| **link-strategist** | Identify meaningful connections | 0.4 | read, bash |
| **quality-checker** | Validate notes against guidelines | 0.2 | read, bash |
| **moc-architect** | Create and maintain Maps of Content | 0.4 | read, edit, bash |
| **naming-specialist** | Ensure naming consistency | 0.2 | read, bash |
| **review-coordinator** | Guide daily/weekly/monthly reviews | 0.3 | read, bash |
| **pitfall-detector** | Identify and prevent common mistakes | 0.3 | read, bash |

### Commands (11 Quick Shortcuts)

**Review Workflows**:
- `/daily-review` - Process inbox (5-10 min)
- `/weekly-review` - Link notes, update MOCs (30-60 min)
- `/monthly-review` - Audit system (1-2 hours)

**Note Creation**:
- `/create-fleeting` - Capture with clarification
- `/process-fleeting` - Convert to permanent
- `/validate-note` - Check quality

**Linking & Organization**:
- `/find-links` - Identify connections
- `/find-orphans` - Connect unlinked notes
- `/create-moc` - Create Map of Content

**Maintenance**:
- `/check-pitfalls` - Scan for issues
- `/fix-naming` - Audit naming consistency

## Configuration Files

### Core Configuration

**`opencode.json`** (177 lines)
- Defines 1 primary agent + 8 subagents
- Defines 11 commands with templates
- Sets permissions to "allow" for smooth workflow
- Follows official OpenCode schema

### Agent Definitions

**Primary Agent**:
- `agent/second-brain.md` (200+ lines)
  - Coordination strategy with subagents
  - Session initialization/finalization
  - Maturity tracking integration
  - Context window optimization
  - Critical constraints and rules

**Subagents** (8 files, ~2,500 lines total):
- `agent/note-clarifier.md` - Socratic questioning
- `agent/note-processor.md` - Note structuring
- `agent/link-strategist.md` - Connection finding
- `agent/quality-checker.md` - Quality validation
- `agent/moc-architect.md` - MOC creation
- `agent/naming-specialist.md` - Naming consistency
- `agent/review-coordinator.md` - Review guidance
- `agent/pitfall-detector.md` - Pitfall prevention

**Commands** (11 files, ~600 lines total):
- `command/daily-review.md`
- `command/weekly-review.md`
- `command/monthly-review.md`
- `command/create-fleeting.md`
- `command/process-fleeting.md`
- `command/find-links.md`
- `command/validate-note.md`
- `command/create-moc.md`
- `command/find-orphans.md`
- `command/check-pitfalls.md`
- `command/fix-naming.md`

### Documentation

**User Guides**:
- `QUICK_START.md` - Get started in 5 minutes
- `SECOND_BRAIN_README.md` - Comprehensive documentation
- `MATURITY_TRACKER.md` - Track progress through stages

**System Documentation**:
- `opencode.json` - Configuration
- `IMPLEMENTATION_COMPLETE.md` - This file

## Best Practices Implemented

### From OPENCODE_AGENT_BEST_PRACTICES.md

✅ **Agent Architecture**:
- Primary agent with full tool access
- Subagents with isolated context windows
- Clear single responsibility for each agent
- Explicit handoff patterns between agents

✅ **Markdown Structure**:
- YAML frontmatter with name, description, temperature
- Consistent sections: Role, Input, Output, Process, Examples, Constraints
- Critical constraints marked with ⚠️ and CAPITALS
- Context window strategy documented

✅ **Context Optimization**:
- Write: Persist maturity tracking in MATURITY_TRACKER.md
- Select: Retrieve only relevant information
- Compress: Summarize subagent results
- Isolate: Each subagent has isolated context

✅ **Subagent Coordination**:
- Primary agent knows when to invoke each subagent
- Structured context passed to subagents
- Summarized results returned to primary agent
- No context pollution between agents

✅ **Granularity Rules**:
- Single responsibility per agent
- Clear input/output formats
- Context budget allocation (35% instructions, 25% context, etc.)
- Explicit tool access for each agent

## How It Works

### User Interaction Flow

```
User: "I have a new idea"
  ↓
Primary Agent (second-brain):
  1. Read MATURITY_TRACKER.md
  2. Understand user's stage
  3. Invoke @note-clarifier with idea
  ↓
Subagent (note-clarifier):
  1. Ask clarifying questions
  2. Return refined understanding
  ↓
Primary Agent:
  1. Receive clarified idea
  2. Synthesize into guidance
  3. Suggest next steps
  4. Update MATURITY_TRACKER.md
  ↓
User: Refined idea + guidance
```

### Subagent Invocation Pattern

When invoking a subagent, the primary agent provides:

1. **Clear task**: What specifically needs to be done
2. **Structured context**: Relevant information in organized format
3. **Expected output**: What format should the result be in
4. **Constraints**: Any specific rules or limitations

Example:
```
@note-clarifier I have this fleeting note: "[content]"

Please ask me clarifying questions to help me understand:
- What is the core insight?
- Why does this matter?
- How does it relate to existing ideas?

Return a summary of the refined understanding.
```

## Maturity Tracking

The system tracks progress through 6 stages:

- **Stage 0**: No system yet (Day 1)
- **Stage 1**: Initial captures (Week 1)
- **Stage 2**: Building connections (Week 2-3)
- **Stage 3**: Emerging patterns (Month 1)
- **Stage 4**: Mature system (Month 2+)
- **Stage 5**: Advanced system (Month 3+)

**MATURITY_TRACKER.md** persists this across sessions, allowing the primary agent to:
- Adjust guidance based on current stage
- Suggest appropriate next steps
- Track progress and celebrate milestones
- Recommend when to introduce advanced techniques

## Installation & Setup

### 1. Apply Dotfiles

```bash
chezmoi apply
```

This copies all files to `~/.config/opencode/`

### 2. Verify Installation

```bash
ls ~/.config/opencode/agent/
ls ~/.config/opencode/command/
cat ~/.config/opencode/opencode.json
```

### 3. Start Using

```bash
opencode
@second-brain I want to start building my second brain system
```

## Key Design Decisions

### 1. Question-Driven Approach

All agents emphasize asking questions before writing. This ensures:
- User provides the content
- Agents provide structure and guidance
- Notes sound like the user, not AI
- User discovers insights through dialogue

### 2. Propose-First Pattern

All changes are proposed with reasoning before execution:
- User sees proposed changes
- User understands why changes are suggested
- User approves before changes are made
- User maintains control over their system

### 3. Maturity-Aware Guidance

System tracks progress and adjusts guidance:
- Day 1: Focus on creating first note
- Week 1: Build daily review habit
- Month 1: Create first MOC
- Month 2+: Introduce advanced techniques

### 4. Atomic Principle Enforcement

System enforces one idea per note:
- Detects "and also..." scope creep
- Suggests splitting multi-idea notes
- Validates titles are complete sentences
- Ensures notes are self-contained

### 5. Context Isolation

Each subagent has isolated context:
- Prevents context pollution
- Improves efficiency
- Allows specialization
- Enables parallel processing

## File Structure

```
dot_config/opencode/
├── opencode.json                    # Main configuration
├── QUICK_START.md                   # 5-minute getting started
├── SECOND_BRAIN_README.md           # Comprehensive guide
├── MATURITY_TRACKER.md              # Progress tracking
├── IMPLEMENTATION_COMPLETE.md       # This file
├── agent/
│   ├── second-brain.md              # Primary orchestrator
│   ├── note-clarifier.md            # Clarification specialist
│   ├── note-processor.md            # Structuring specialist
│   ├── link-strategist.md           # Connection specialist
│   ├── quality-checker.md           # Validation specialist
│   ├── moc-architect.md             # Organization specialist
│   ├── naming-specialist.md         # Naming specialist
│   ├── review-coordinator.md        # Review specialist
│   └── pitfall-detector.md          # Prevention specialist
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

## Next Steps

### For You

1. **Today**: Run `chezmoi apply` to install
2. **First session**: Start with `/create-fleeting` to capture your first idea
3. **Daily**: Use `/daily-review` to process notes
4. **Weekly**: Use `/weekly-review` to link and organize
5. **Monthly**: Use `/monthly-review` to audit and refine

### For the System

The system is complete and ready to use. As you use it:
- MATURITY_TRACKER.md will be updated with your progress
- Subagents will learn your preferences and style
- System will evolve based on your needs
- Advanced techniques will be introduced at appropriate times

## Support & Documentation

- **Quick Start**: See `QUICK_START.md`
- **Comprehensive Guide**: See `SECOND_BRAIN_README.md`
- **Progress Tracking**: See `MATURITY_TRACKER.md`
- **Best Practices**: See `.opencode/OPENCODE_AGENT_BEST_PRACTICES.md`
- **Methodology**: See `docs/reference/second-brain-guide.md`

## Summary

✅ **Complete**: 1 primary agent + 8 subagents + 11 commands
✅ **Documented**: 4 user guides + system documentation
✅ **Best Practices**: Follows OPENCODE_AGENT_BEST_PRACTICES.md
✅ **Ready to Use**: Install with `chezmoi apply`
✅ **Maturity Tracking**: Tracks progress across sessions
✅ **Question-Driven**: Emphasizes user input and guidance
✅ **Propose-First**: All changes proposed before execution
✅ **Context Optimized**: Efficient token usage with isolation

---

**Your second brain agent system is ready to help you build a personal knowledge system. Start with `/create-fleeting` and let the system guide you from there.** 🧠
