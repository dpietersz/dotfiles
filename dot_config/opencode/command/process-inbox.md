---
description: Process inbox notes one-by-one with intelligent workflow routing
agent: inbox-processor
template: I want to process my inbox. Please go through each note one-by-one, assess its maturity level, and help me decide what to do with it. Ask me questions along the way about what the purpose is and where to stop. Route each note through the appropriate workflow based on its current state.
---

# Process Inbox

Process all notes in your inbox folder one-by-one with intelligent workflow routing.

## What This Does

This command:

1. **Scans your inbox** - Lists all notes in `$HOME/dev/Notes/inbox/`
2. **Assesses each note** - Determines maturity level (fleeting, partial, semi-structured, well-formed)
3. **Recommends workflow** - Suggests the right process for that note's current state
4. **Asks for guidance** - Questions about purpose, next steps, and where to stop
5. **Routes intelligently** - Invokes appropriate subagents based on note maturity
6. **Moves notes** - Relocates processed notes to permanent/fleeting folders
7. **Tracks progress** - Updates your maturity tracker

## Note Maturity Levels

**Level 1: Fleeting** (< 50 words, very vague)
- Single phrase or sentence
- Needs significant clarification
- Routes to: @note-clarifier

**Level 2: Partial** (50-150 words, some clarity)
- Multiple sentences with some structure
- Needs refinement and clarification
- Routes to: Direct questions + @note-processor

**Level 3: Semi-Structured** (150-300 words, mostly clear)
- Clear main idea with explanation
- Needs formatting and linking
- Routes to: @note-processor + @link-strategist

**Level 4: Well-Formed** (300+ words, clear structure)
- Complete explanation, ready for permanent
- Needs linking and validation
- Routes to: @link-strategist + @quality-checker

## Workflow Options

For each note, you can:

1. **Clarify & Refine** - Ask questions to improve clarity
2. **Structure & Format** - Convert to permanent atomic note
3. **Find Connections** - Link to other notes in your system
4. **Validate Quality** - Check against atomic note guidelines
5. **Skip This Note** - Leave in inbox for later
6. **Delete This Note** - Remove from system
7. **Stop Processing** - Exit and process later

## Example Session

```
📝 Inbox Processing Started
Found 5 notes in inbox

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Note 1/5: 20241029120000.md
📊 Maturity: Level 1 (Fleeting)
💡 Recommendation: Clarify & refine

Content:
"Atomic notes are better"

This is a fleeting note - very short and vague. It needs clarification
to understand what you mean by "better" and in what context.

What would you like to do?
1. Clarify & refine (ask questions)
2. Skip this note
3. Delete this note
4. Stop processing

> 1

Invoking @note-clarifier...

[Questions asked, answers provided]

Ready to convert to permanent note? (y/n)
> y

Invoking @note-processor...

[Note structured and formatted]

Should we find links for this note? (y/n)
> y

Invoking @link-strategist...

[Links suggested and added]

✅ Note moved to permanent folder
📝 New filename: 20241029120000-atomic-notes-better.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Note 2/5: 20241029130000.md
[Continue with next note...]
```

## Processing Tips

- **Take your time**: Process one note at a time, don't rush
- **Be honest**: If a note isn't ready, skip it
- **Ask questions**: The system will ask clarifying questions
- **Trust the workflow**: Each maturity level has a recommended path
- **Stop anytime**: You can exit and resume later

## After Processing

You'll get a summary:

```
📊 Inbox Processing Summary
✅ Processed: 5 notes
📝 Moved to permanent: 3
📋 Moved to fleeting: 1
⏭️ Skipped: 1
🗑️ Deleted: 0
📦 Remaining in inbox: 0
```

## Related Commands

- `/daily-review` - Process fleeting notes from yesterday
- `/create-fleeting` - Capture a new fleeting note
- `/process-fleeting` - Convert a specific fleeting note
- `/validate-note` - Check note quality
- `/find-links` - Find connections for a note

