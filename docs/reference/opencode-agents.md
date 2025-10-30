# OpenCode Agents Reference

Quick reference guide for all OpenCode agents in your second brain system. Each agent is a specialized AI assistant with a specific role.

## Agent Overview

| Agent | Purpose | Mode | Temperature | When to Use |
|-------|---------|------|-------------|------------|
| **second-brain** | Orchestrates the entire system | Primary | 0.4 | Main entry point for all tasks |
| **note-clarifier** | Clarifies vague ideas through questions | Subagent | 0.5 | When you have a fuzzy idea to capture |
| **note-processor** | Converts fleeting notes to permanent notes | Subagent | 0.3 | When you want to structure a note |
| **link-strategist** | Finds meaningful connections between notes | Subagent | 0.4 | When you want to link notes together |
| **quality-checker** | Validates notes against guidelines | Subagent | 0.2 | When you want to ensure quality |
| **moc-architect** | Creates Maps of Content for organization | Subagent | 0.4 | When you need to organize related notes |
| **naming-specialist** | Ensures naming consistency and standards | Subagent | 0.2 | When you want to audit naming |
| **review-coordinator** | Guides daily, weekly, monthly reviews | Subagent | 0.3 | When you want to review your system |
| **pitfall-detector** | Identifies common mistakes and pitfalls | Subagent | 0.3 | When you want to scan for issues |
| **inbox-processor** | Processes inbox notes one-by-one | Subagent | 0.4 | When you want to clear your inbox |

## Detailed Agent Descriptions

### Primary Agent: second-brain

**Role**: Orchestrates atomic note-taking, linking, and knowledge graph management

**What it does**:
- Guides you through building your personal knowledge system
- Coordinates with subagents for specialized tasks
- Tracks your system maturity level
- Suggests next steps based on your progress

**Tools available**:
- ✅ Read files
- ✅ Edit/create files
- ✅ Execute bash commands

**When to use**:
- Starting a new session
- Asking general questions about your system
- Requesting guidance on what to do next
- Invoking subagents with `@agent-name`

**Example interactions**:
```
"I have a new idea to capture"
→ second-brain will ask clarifying questions

"/daily-review"
→ second-brain will guide you through the review

"@link-strategist, find connections for this note"
→ second-brain will invoke the link-strategist
```

---

### Subagent: note-clarifier

**Role**: Asks deep questions to refine and clarify fleeting notes into coherent ideas

**What it does**:
- Asks Socratic questions about your idea
- Helps you discover what you actually think
- Progressively deepens understanding
- Summarizes refined understanding

**Tools available**:
- ✅ Read files
- ✅ Execute bash commands
- ❌ Cannot write files

**When to use**:
- You have a vague or fuzzy idea
- You want to think through something
- You're capturing a fleeting note
- You need help articulating your thoughts

**Example interactions**:
```
/create-fleeting
→ note-clarifier asks: "What's the core idea?"
→ "Why is this important?"
→ "How does this relate to other things?"
```

**Key constraint**: Only asks questions, never writes notes

---

### Subagent: note-processor

**Role**: Converts clarified fleeting notes into permanent atomic notes with proper structure

**What it does**:
- Structures notes with title, explanation, connections
- Ensures atomic note principles are followed
- Adds metadata and tags
- Formats for your knowledge system

**Tools available**:
- ✅ Read files
- ✅ Edit/create files
- ✅ Execute bash commands

**When to use**:
- You have a clarified fleeting note
- You want to convert to a permanent note
- You need help with note structure
- You want to ensure consistency

**Example interactions**:
```
/process-fleeting
→ note-processor reads your fleeting note
→ Structures it as a permanent note
→ Adds title, explanation, connections
```

---

### Subagent: link-strategist

**Role**: Identifies meaningful connections between notes and suggests strategic linking

**What it does**:
- Analyzes your note for connection opportunities
- Suggests links to existing notes
- Explains why connections are meaningful
- Helps build your knowledge graph

**Tools available**:
- ✅ Read files
- ✅ Execute bash commands
- ❌ Cannot write files

**When to use**:
- You've created a new note
- You want to find connections
- You're looking for orphan notes
- You want to strengthen your knowledge graph

**Example interactions**:
```
/find-links
→ link-strategist analyzes your note
→ Suggests: "This connects to [note] because..."
→ "Consider linking to [note] for context"
```

---

### Subagent: quality-checker

**Role**: Validates notes against guidelines and suggests improvements before finalizing

**What it does**:
- Checks note structure and completeness
- Validates against atomic note guidelines
- Identifies weak connections
- Suggests improvements with reasoning

**Tools available**:
- ✅ Read files
- ✅ Execute bash commands
- ❌ Cannot write files

**When to use**:
- You want to validate a note
- You're unsure if a note is ready
- You want to ensure quality
- You want improvement suggestions

**Example interactions**:
```
/validate-note
→ quality-checker reviews your note
→ "Title is clear ✓"
→ "Explanation could be more specific"
→ "Consider adding 2-3 more connections"
```

---

### Subagent: moc-architect

**Role**: Creates and maintains Maps of Content that organize and reveal patterns in your knowledge graph

**What it does**:
- Analyzes clusters of related notes
- Designs MOC structure and organization
- Creates hierarchical organization
- Maintains MOC consistency

**Tools available**:
- ✅ Read files
- ✅ Edit/create files
- ✅ Execute bash commands

**When to use**:
- You have many related notes
- You want to organize a topic
- You need a navigation structure
- You want to reveal patterns

**Example interactions**:
```
/create-moc
→ moc-architect analyzes your notes
→ "I found 15 notes about [topic]"
→ "Suggested structure: [hierarchy]"
→ Creates the MOC file
```

---

### Subagent: naming-specialist

**Role**: Ensures proper naming conventions, IDs, and identification across your knowledge system

**What it does**:
- Audits naming consistency
- Checks file names, titles, IDs
- Validates against naming standards
- Suggests corrections

**Tools available**:
- ✅ Read files
- ✅ Execute bash commands
- ❌ Cannot write files

**When to use**:
- You want to audit naming
- You're unsure about naming conventions
- You want consistency checks
- You want to fix naming issues

**Example interactions**:
```
/fix-naming
→ naming-specialist audits your notes
→ "Found inconsistent ID format in 3 notes"
→ "Suggested corrections: [list]"
```

---

### Subagent: review-coordinator

**Role**: Guides daily, weekly, and monthly review workflows to maintain and evolve your knowledge system

**What it does**:
- Guides daily reviews (5-10 minutes)
- Guides weekly reviews (30-60 minutes)
- Guides monthly reviews (1-2 hours)
- Tracks review progress

**Tools available**:
- ✅ Read files
- ✅ Execute bash commands
- ❌ Cannot write files

**When to use**:
- You want to do a daily review
- You want to do a weekly review
- You want to do a monthly review
- You want review guidance

**Example interactions**:
```
/daily-review
→ review-coordinator guides you through:
→ "Let's process your inbox"
→ "Convert 1-2 fleeting notes"
→ "Find connections"

/weekly-review
→ review-coordinator guides you through:
→ "Link notes from this week"
→ "Update MOCs"
→ "Find orphan notes"
```

---

### Subagent: pitfall-detector

**Role**: Identifies and helps prevent common pitfalls in atomic note-taking and knowledge management

**What it does**:
- Scans for common mistakes
- Identifies scope creep
- Finds weak connections
- Suggests preventions

**Tools available**:
- ✅ Read files
- ✅ Execute bash commands
- ❌ Cannot write files

**When to use**:
- You want to scan for issues
- You're concerned about quality
- You want to prevent mistakes
- You want system health check

**Example interactions**:
```
/check-pitfalls
→ pitfall-detector scans your system
→ "Found 3 notes with scope creep"
→ "Found 5 orphan notes"
→ "Suggested fixes: [list]"
```

---

### Subagent: inbox-processor

**Role**: Intelligently processes inbox notes one-by-one, assessing maturity and routing to appropriate workflow

**What it does**:
- Lists inbox notes
- Assesses maturity level of each
- Routes to appropriate workflow
- Guides you through processing
- Moves notes to permanent locations

**Tools available**:
- ✅ Read files
- ✅ Edit/create files
- ✅ Execute bash commands

**When to use**:
- You want to clear your inbox
- You have many fleeting notes
- You want intelligent routing
- You want guided processing

**Example interactions**:
```
/process-inbox
→ inbox-processor shows first note
→ "This is a fleeting note (vague)"
→ "Recommend: Clarify with @note-clarifier"
→ Guides you through the workflow
→ Moves to permanent location
→ Shows next note
```

---

## Quick Command Reference

| Command | Agent | Purpose |
|---------|-------|---------|
| `/create-fleeting` | note-clarifier | Capture and clarify a new idea |
| `/process-fleeting` | note-processor | Convert fleeting to permanent |
| `/validate-note` | quality-checker | Check note quality |
| `/find-links` | link-strategist | Find connections for a note |
| `/create-moc` | moc-architect | Create a Map of Content |
| `/find-orphans` | link-strategist | Find unlinked notes |
| `/fix-naming` | naming-specialist | Audit and fix naming |
| `/daily-review` | review-coordinator | Daily review workflow |
| `/weekly-review` | review-coordinator | Weekly review workflow |
| `/monthly-review` | review-coordinator | Monthly review workflow |
| `/check-pitfalls` | pitfall-detector | Scan for issues |
| `/process-inbox` | inbox-processor | Process inbox notes |

## Temperature Explanation

Temperature controls how creative vs. focused an agent is:

- **0.2** (Very focused): Naming specialist, quality checker
  - Consistent, rule-based decisions
  - Minimal variation
  - Best for validation and checking

- **0.3** (Focused): Note processor, review coordinator, pitfall detector
  - Structured but thoughtful
  - Some flexibility
  - Best for processing and guidance

- **0.4** (Balanced): Second brain, link strategist, moc architect, inbox processor
  - Balanced between creativity and focus
  - Good for finding connections and organizing
  - Best for strategic thinking

- **0.5** (Thoughtful): Note clarifier
  - More exploratory
  - Asks deeper questions
  - Best for clarification and discovery

## Invoking Subagents

You can invoke subagents in two ways:

### Method 1: Use Commands

```
/create-fleeting
/process-fleeting
/find-links
```

### Method 2: Mention in Conversation

```
"I have a note I want to validate. @quality-checker"
"Find connections for this. @link-strategist"
"Create a MOC for these notes. @moc-architect"
```

## Agent Coordination

The second-brain agent coordinates with subagents:

1. **Assess** - Understand what you need
2. **Route** - Invoke appropriate subagent
3. **Receive** - Get results from subagent
4. **Synthesize** - Combine into actionable guidance
5. **Execute** - Apply changes if approved

## Tips for Working with Agents

### Be Specific

❌ "Process my notes"
✅ "Process my inbox and convert fleeting notes to permanent"

### Provide Context

❌ "Validate this"
✅ "Validate this note about atomic note-taking principles"

### Ask for Explanations

```
"Why do you suggest this connection?"
"Explain how this MOC structure works"
```

### Request Multiple Steps

```
"Clarify my idea, then process it, then find links"
```

Agents can handle multi-step workflows.

## Next Steps

- **Getting Started**: [Getting Started with OpenCode](../getting-started/opencode-setup.md)
- **How-To Guides**: [How to Modify Configurations](../how-to/opencode-modify-config.md)
- **Architecture**: [OpenCode Architecture](../explanation/opencode-architecture.md)

---

**Last Updated**: October 30, 2025
