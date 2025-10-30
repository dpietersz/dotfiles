# OpenCode Architecture: Understanding the Agent System

This document explains the "why" behind OpenCode's design—how and why the agent system exists, how agents coordinate, and how it ensures quality.

## Why OpenCode Exists

Managing dotfiles across multiple environments (local machines, containers, DevPods, DevContainers) is complex. You need to:

- **Modify configurations** without manually editing files
- **Install applications** consistently across environments
- **Manage secrets** securely
- **Maintain knowledge** in a structured way
- **Ensure quality** of changes before applying them

Traditional approaches require:
- Manual file editing (error-prone)
- Remembering file locations (cognitive load)
- Repeating changes across environments (tedious)
- No guidance on best practices (inconsistent)

**OpenCode solves this** by providing AI agents that understand your dotfiles, guide you through changes, and ensure consistency.

## The Agent System Philosophy

OpenCode uses a **multi-agent orchestration model** rather than a single monolithic AI:

### Why Multiple Agents?

Each agent has a specific expertise:

- **note-clarifier** specializes in asking questions (Socratic method)
- **note-processor** specializes in structuring information
- **link-strategist** specializes in finding connections
- **quality-checker** specializes in validation
- **moc-architect** specializes in organization

This is better than one agent trying to do everything because:

1. **Specialization** - Each agent is optimized for its task
2. **Consistency** - Same agent always does the same task
3. **Reliability** - Easier to test and verify each agent
4. **Flexibility** - You can invoke agents in different combinations
5. **Maintainability** - Changes to one agent don't affect others

### The Orchestration Pattern

The **second-brain** agent acts as an orchestrator:

```
User Request
    ↓
second-brain (understands request)
    ↓
Routes to appropriate subagent(s)
    ↓
Subagent executes specialized task
    ↓
second-brain synthesizes results
    ↓
Presents to user
```

This pattern allows:
- **Intelligent routing** - Right agent for the job
- **Coordination** - Multiple agents working together
- **Context preservation** - Orchestrator maintains overall context
- **Flexibility** - Easy to add new agents

## How Agents Coordinate

### Sequential Workflow

For complex tasks, agents work in sequence:

```
User: "I have a new idea to capture"
    ↓
second-brain: "Let me help you clarify this"
    ↓
@note-clarifier: Asks questions, refines understanding
    ↓
second-brain: "Now let's structure this"
    ↓
@note-processor: Creates permanent note
    ↓
second-brain: "Let's find connections"
    ↓
@link-strategist: Suggests links
    ↓
second-brain: "Let's validate quality"
    ↓
@quality-checker: Reviews and suggests improvements
```

### Parallel Workflow

For independent tasks, agents can work in parallel:

```
User: "Process my inbox"
    ↓
@inbox-processor: For each note:
    - Assess maturity
    - Route to appropriate workflow
    - Execute workflow
    - Move to permanent location
```

### Feedback Loop

Agents provide feedback that informs next steps:

```
@quality-checker: "This note needs stronger connections"
    ↓
User: "Find more connections"
    ↓
@link-strategist: "Found 3 additional meaningful connections"
    ↓
User: "Add them"
    ↓
@note-processor: Updates the note
```

## Temperature and Behavior

Each agent has a **temperature** setting that controls its behavior:

### Low Temperature (0.2-0.3): Focused & Consistent

Used by: **naming-specialist**, **quality-checker**, **note-processor**

Characteristics:
- Follows rules strictly
- Minimal variation
- Consistent decisions
- Good for validation and processing

Why: These agents need to be reliable and consistent. You want the same result every time.

### Medium Temperature (0.4): Balanced

Used by: **second-brain**, **link-strategist**, **moc-architect**, **inbox-processor**

Characteristics:
- Balanced between creativity and focus
- Flexible but principled
- Good at finding connections
- Thoughtful decision-making

Why: These agents need to be creative (finding connections) but also reliable (consistent structure).

### Higher Temperature (0.5): Exploratory

Used by: **note-clarifier**

Characteristics:
- More exploratory questions
- Deeper inquiry
- Follows curiosity
- Discovers unexpected insights

Why: Clarification requires exploration. You want the agent to ask questions you might not have thought of.

## Environment Awareness

OpenCode understands different environments:

### Local Machines

- **Fedora, Bluefin-dx, macOS**
- Full system access
- Can install system packages
- Can modify system settings
- Can use GUI applications

### Remote Environments

- **Docker containers, Distrobox, DevContainers, VMs**
- Limited system access
- Can only install in container
- Cannot modify host system
- Limited GUI support

### Universal Configuration

Some configurations work everywhere:
- Shell aliases and functions
- Neovim configuration
- Git configuration
- Application settings

OpenCode knows which configurations apply where and routes changes appropriately.

## Quality Assurance Approach

OpenCode ensures quality through multiple mechanisms:

### 1. Specialized Validation

The **quality-checker** agent validates notes against guidelines:
- Structure completeness
- Atomic note principles
- Connection strength
- Naming consistency

### 2. Pitfall Detection

The **pitfall-detector** agent scans for common mistakes:
- Scope creep (notes too large)
- Weak connections (isolated notes)
- Inconsistent naming
- Missing metadata

### 3. Review Workflows

The **review-coordinator** guides regular reviews:
- **Daily** (5-10 min): Process inbox, create permanent notes
- **Weekly** (30-60 min): Link notes, update MOCs, find orphans
- **Monthly** (1-2 hours): Audit system, refine structure, archive

### 4. Maturity Tracking

The system tracks your knowledge system maturity:

```
Stage 0: No system yet (Day 1)
Stage 1: Folder structure, first fleeting notes (Week 1)
Stage 2: 5-10 permanent notes, basic linking (Week 2-3)
Stage 3: 20-30 permanent notes, first MOC (Month 1)
Stage 4: 50+ notes, multiple MOCs, regular reviews (Month 2+)
Stage 5: Mature system, 100+ notes, advanced techniques (Month 3+)
```

Agents adjust guidance based on your stage.

## Tool Permissions

Agents have different tool permissions based on their role:

### Read-Only Agents

**note-clarifier**, **link-strategist**, **quality-checker**, **naming-specialist**, **pitfall-detector**, **review-coordinator**

- Can read files
- Can execute bash (for searching, listing)
- Cannot write or edit files

Why: These agents provide guidance and analysis, not direct changes.

### Write-Enabled Agents

**second-brain**, **note-processor**, **moc-architect**, **inbox-processor**

- Can read files
- Can edit/create files
- Can execute bash

Why: These agents need to make changes to your knowledge system.

## Design Decisions

### Why Atomic Notes?

Atomic notes are small, focused, single-idea notes. This design:
- **Improves reusability** - One idea can be used in many contexts
- **Enables linking** - Small notes are easier to connect
- **Reduces scope creep** - Focused scope prevents bloat
- **Supports growth** - Easy to add new notes without restructuring

### Why Zettelkasten Method?

The Zettelkasten (slip-box) method provides:
- **Organic growth** - System grows naturally with your thinking
- **Emergent structure** - Patterns emerge from connections
- **Serendipitous discovery** - Unexpected connections reveal insights
- **Scalability** - Works with 10 notes or 10,000 notes

### Why Multiple Review Cycles?

Different review cycles serve different purposes:

- **Daily** (5-10 min): Capture and process
  - Clears inbox
  - Creates permanent notes
  - Maintains momentum

- **Weekly** (30-60 min): Connect and organize
  - Links notes together
  - Updates MOCs
  - Finds orphan notes

- **Monthly** (1-2 hours): Audit and refine
  - Checks system health
  - Refines structure
  - Archives completed projects

Together, they maintain a healthy, growing knowledge system.

## Workflow Patterns

### The Capture-Process-Link-Review Cycle

```
CAPTURE (Daily)
  ↓
Fleeting notes in inbox
  ↓
PROCESS (Daily)
  ↓
Convert to permanent notes
  ↓
LINK (Weekly)
  ↓
Connect to existing notes
  ↓
REVIEW (Weekly/Monthly)
  ↓
Audit, refine, organize
  ↓
Back to CAPTURE
```

This cycle ensures:
- **Regular capture** - Ideas don't get lost
- **Regular processing** - Inbox doesn't accumulate
- **Regular linking** - Knowledge graph grows
- **Regular review** - System stays healthy

### The Clarify-Structure-Validate Pattern

For individual notes:

```
CLARIFY (note-clarifier)
  ↓
Understand the idea
  ↓
STRUCTURE (note-processor)
  ↓
Create permanent note
  ↓
VALIDATE (quality-checker)
  ↓
Ensure quality
  ↓
LINK (link-strategist)
  ↓
Connect to other notes
```

This pattern ensures:
- **Clear thinking** - Ideas are well-articulated
- **Consistent structure** - All notes follow same format
- **High quality** - Notes meet standards
- **Strong connections** - Notes are integrated

## Scalability Considerations

The system is designed to scale:

### Small Systems (10-50 notes)

- Daily reviews are quick
- Manual linking is feasible
- MOCs are optional
- Focus on capture and processing

### Medium Systems (50-200 notes)

- Daily reviews take 5-10 minutes
- Weekly linking becomes important
- First MOCs emerge
- Pitfall detection becomes valuable

### Large Systems (200+ notes)

- Daily reviews are essential
- Weekly linking is critical
- Multiple MOCs organize knowledge
- Monthly audits prevent decay
- Pitfall detection prevents chaos

The agent system scales with you.

## Integration with Dotfiles

OpenCode integrates with your dotfiles through:

### Chezmoi Templates

Configurations use chezmoi templates to adapt to your environment:
```
{{ if .remote }}
# Remote-specific config
{{ else }}
# Local-specific config
{{ end }}
```

### Environment Variables

Agents can read and modify environment variables:
```bash
export OPENCODE_MODEL="anthropic/claude-sonnet-4-5"
export OPENCODE_THEME="kanagawa"
```

### Configuration Files

Agents understand your configuration structure:
- `~/.config/nvim/` - Neovim
- `~/.config/shell/` - Shell
- `~/.config/niri/` - Niri WM
- `~/.config/starship.toml` - Prompt
- `~/.gitconfig` - Git

## Future Extensibility

The agent system is designed to be extended:

### Adding New Agents

New agents can be added by:
1. Creating a new markdown file in `.opencode/agent/`
2. Defining role, tools, and temperature
3. Writing system prompt
4. Registering in `opencode.jsonc`

### Adding New Commands

New commands can be added by:
1. Creating a new markdown file in `.opencode/command/`
2. Defining the command template
3. Specifying which agent to invoke
4. Registering in `opencode.jsonc`

### Adding New Tools

New tools can be integrated by:
1. Implementing the tool
2. Registering with OpenCode
3. Granting permissions to agents that need it

## Comparison to Alternatives

### vs. Manual Editing

**Manual**: You edit files directly
- ✅ Full control
- ❌ Error-prone
- ❌ Cognitive load
- ❌ Inconsistent

**OpenCode**: Agents guide and execute
- ✅ Guided process
- ✅ Consistent
- ✅ Reduced errors
- ✅ Best practices

### vs. Single Monolithic AI

**Monolithic**: One AI does everything
- ✅ Simple interface
- ❌ Less specialized
- ❌ Harder to debug
- ❌ Less reliable

**OpenCode**: Multiple specialized agents
- ✅ Specialized expertise
- ✅ Easier to debug
- ✅ More reliable
- ✅ Flexible coordination

### vs. Automation Scripts

**Scripts**: Pre-written automation
- ✅ Predictable
- ❌ Inflexible
- ❌ No guidance
- ❌ Limited to pre-defined tasks

**OpenCode**: Intelligent agents
- ✅ Flexible
- ✅ Guided process
- ✅ Handles novel situations
- ✅ Learns from context

## Key Principles

### 1. Guidance Over Automation

OpenCode guides you through processes rather than automating them away. You remain in control.

### 2. Specialization Over Generalization

Each agent specializes in one area rather than trying to do everything.

### 3. Quality Over Speed

The system prioritizes quality (validation, review) over speed.

### 4. Scalability Over Simplicity

The system is designed to scale with your knowledge system.

### 5. Transparency Over Magic

Agents show you what they're doing and why.

## Next Steps

- **Get Started**: [Getting Started with OpenCode](../getting-started/opencode-setup.md)
- **Learn Agents**: [OpenCode Agents Reference](../reference/opencode-agents.md)
- **How-To Guides**: [How to Modify Configurations](../how-to/opencode-modify-config.md)

---

**Last Updated**: October 30, 2025
