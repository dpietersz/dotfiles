# Second Brain Agent System - Quick Start Guide

## Installation

1. **Apply dotfiles** (if not already done):
   ```bash
   chezmoi apply
   ```

2. **Verify installation**:
   ```bash
   ls ~/.config/opencode/agent/
   ls ~/.config/opencode/command/
   ```

## Your First Session

### Step 1: Start the Agent

```bash
opencode
```

Then mention the primary agent:

```
@second-brain I want to start building my second brain system. What should I do first?
```

The agent will:
- Ask what stage you're at
- Explain the system
- Guide you through first steps

### Step 2: Create Your First Fleeting Note

Use the command:

```
/create-fleeting
```

Or mention the subagent:

```
I have an idea about atomic notes. @note-clarifier can you help me clarify it?
```

The agent will ask questions like:
- "What do you mean by that?"
- "Can you give a specific example?"
- "Why does this matter?"

Answer these questions to clarify your thinking.

### Step 3: Convert to Permanent Note

Once you have a clarified idea, use:

```
/process-fleeting
```

Or:

```
I'm ready to convert this to a permanent note. @note-processor can you help?
```

The agent will:
- Generate a unique ID (timestamp)
- Suggest a descriptive title
- Propose the note structure
- Ask for approval before creating

### Step 4: Find Connections

After creating a permanent note, use:

```
/find-links
```

Or:

```
I've created a new note. @link-strategist can you find connections to other notes?
```

The agent will suggest meaningful links with explanations.

## Daily Workflow (5-10 minutes)

```bash
opencode
/daily-review
```

This guides you through:
1. Processing fleeting notes from yesterday
2. Converting 1-2 to permanent notes
3. Identifying connections
4. Cleaning up your inbox

## Weekly Workflow (30-60 minutes)

```bash
opencode
/weekly-review
```

This guides you through:
1. Reviewing all notes created this week
2. Linking recent notes to older ones
3. Updating MOCs
4. Identifying emerging clusters
5. Connecting orphan notes

## Monthly Workflow (1-2 hours)

```bash
opencode
/monthly-review
```

This guides you through:
1. Auditing orphan notes
2. Refining MOC structure
3. Archiving completed projects
4. Pruning fleeting notes
5. Planning next month's focus

## Common Commands

| Command | Purpose | Time |
|---------|---------|------|
| `/create-fleeting` | Capture new idea | 2-5 min |
| `/process-fleeting` | Convert to permanent | 5-10 min |
| `/find-links` | Find connections | 5-10 min |
| `/validate-note` | Check quality | 5 min |
| `/create-moc` | Create Map of Content | 10-15 min |
| `/daily-review` | Process inbox | 5-10 min |
| `/weekly-review` | Link & organize | 30-60 min |
| `/monthly-review` | Audit system | 1-2 hours |
| `/check-pitfalls` | Scan for issues | 10 min |
| `/fix-naming` | Fix consistency | 10-15 min |

## Using Subagents

Mention subagents with @ when you need specialized help:

```
I have a fleeting note. @note-clarifier can you help me clarify it?
```

Available subagents:
- `@note-clarifier` - Ask clarifying questions
- `@note-processor` - Convert to permanent notes
- `@link-strategist` - Find connections
- `@quality-checker` - Validate quality
- `@moc-architect` - Create MOCs
- `@naming-specialist` - Fix naming
- `@review-coordinator` - Guide reviews
- `@pitfall-detector` - Prevent mistakes

## Folder Structure

Create this structure for your notes:

```
~/second-brain/
├── inbox/              # Fleeting notes to process
├── literature/         # Notes from sources
├── permanent/          # Your atomic notes
├── maps/               # Maps of Content
└── archive/            # Completed projects
```

## Key Principles

1. **One idea per note**: If you write "and also...", split it
2. **Complete sentence titles**: Not just topics
3. **Explain every link**: Why are you linking this?
4. **Process regularly**: Daily reviews are key
5. **Start simple**: Don't wait for perfect system
6. **Iterate**: System improves over time

## Maturity Tracking

The system tracks your progress through stages:

- **Stage 0**: No system yet (Day 1)
- **Stage 1**: First notes captured (Week 1)
- **Stage 2**: 5-10 permanent notes (Week 2-3)
- **Stage 3**: 20-30 notes, first MOC (Month 1)
- **Stage 4**: 50+ notes, multiple MOCs (Month 2+)
- **Stage 5**: Mature system with 100+ notes (Month 3+)

The agent asks about your stage at the start of each session and adjusts guidance.

## Tips for Success

✅ **Do**:
- Start with one fleeting note today
- Process notes daily (5-10 min)
- Link intentionally with explanations
- Review weekly to find patterns
- Trust the process

❌ **Don't**:
- Wait for perfect system
- Capture without processing
- Link without explaining why
- Skip reviews
- Over-complicate things

## Getting Help

- Read `SECOND_BRAIN_README.md` for comprehensive documentation
- Check `MATURITY_TRACKER.md` to see your progress
- Use `/check-pitfalls` to scan for common mistakes
- Ask the agent: "What should I do next?"

## Next Steps

1. **Today**: Create your first fleeting note with `/create-fleeting`
2. **Tomorrow**: Do your first `/daily-review`
3. **Next week**: Do your first `/weekly-review`
4. **Next month**: Do your first `/monthly-review`

---

**Remember**: This system is a tool to help you think better, not a system to maintain. Start simple, iterate, and let it evolve with your needs.

Good luck building your second brain! 🧠
