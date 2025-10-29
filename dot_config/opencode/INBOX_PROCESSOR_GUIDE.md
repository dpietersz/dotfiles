# Inbox Processor Guide

## Overview

The **Inbox Processor** is a specialized subagent that intelligently processes notes from your inbox folder one-by-one, assesses their maturity level, and routes them through the appropriate workflow.

## Quick Start

### Option 1: Use the Command
```
/process-inbox
```

### Option 2: Direct Invocation
```
@inbox-processor I want to process my inbox
```

## How It Works

### 1. Scan Phase
- Lists all notes in `$HOME/dev/Notes/inbox/`
- Sorts by filename
- Shows total count

### 2. Assessment Phase (for each note)
- Reads note content
- Determines maturity level (1-4)
- Explains assessment to you

### 3. Recommendation Phase
- Suggests appropriate workflow
- Shows reasoning
- Offers workflow options

### 4. Processing Phase
- Executes your chosen workflow
- Invokes appropriate subagents
- Asks clarifying questions
- Moves note to appropriate folder

### 5. Tracking Phase
- Updates MATURITY_TRACKER.md
- Shows what was accomplished
- Asks about next note

## Note Maturity Levels

### Level 1: Fleeting (< 50 words, very vague)
**Example**: "Atomic notes are better"

**Characteristics**:
- Single phrase or sentence
- No clear structure
- Vague concepts

**Workflow**: @note-clarifier
- Asks 5-7 clarifying questions
- Helps you articulate the idea
- Summarizes refined understanding

### Level 2: Partial (50-150 words, some clarity)
**Example**: "Atomic notes are better because they're reusable. You can link them together and build a knowledge graph."

**Characteristics**:
- Multiple sentences
- Some structure emerging
- Needs refinement

**Workflow**: Direct questions + @note-processor
- Asks clarifying questions
- Structures the note
- Formats as atomic note

### Level 3: Semi-Structured (150-300 words, mostly clear)
**Characteristics**:
- Clear main idea
- Some explanation
- Needs formatting and linking

**Workflow**: @note-processor + @link-strategist
- Structures properly
- Finds connections
- Adds links

### Level 4: Well-Formed (300+ words, clear structure)
**Characteristics**:
- Complete explanation
- Ready for permanent folder
- Needs linking and validation

**Workflow**: @link-strategist + @quality-checker
- Finds connections
- Validates quality
- Proposes improvements

## User Interaction

For each note, you'll see:

```
📝 Note: [filename]
📊 Maturity: Level [1-4]
💡 Recommendation: [workflow]

[Note content shown here]

What would you like to do?
1. Clarify & refine (ask questions)
2. Structure & format (convert to permanent)
3. Find connections (link to other notes)
4. Validate quality (check against guidelines)
5. Skip this note (leave in inbox)
6. Delete this note (remove from system)
7. Stop processing (exit inbox)

> [your choice]
```

## Workflow Options Explained

### 1. Clarify & Refine
- Invokes @note-clarifier
- Asks Socratic questions
- Helps you think through the idea
- Best for: Vague or unclear notes

### 2. Structure & Format
- Invokes @note-processor
- Formats as atomic note
- Adds title, explanation, connections
- Best for: Notes with good ideas but poor structure

### 3. Find Connections
- Invokes @link-strategist
- Analyzes your note
- Searches existing notes
- Suggests meaningful links
- Best for: Well-formed notes ready for linking

### 4. Validate Quality
- Invokes @quality-checker
- Checks against atomic note guidelines
- Validates one-idea-per-note principle
- Proposes improvements
- Best for: Notes that seem complete but need validation

### 5. Skip This Note
- Leaves note in inbox
- Moves to next note
- Use when: Not ready to process yet

### 6. Delete This Note
- Asks for confirmation
- Removes from system
- Use when: Note is no longer relevant

### 7. Stop Processing
- Shows summary
- Exits inbox processor
- Use when: Need a break or want to continue later

## Processing Tips

### Take Your Time
- Process one note at a time
- Don't rush through the workflow
- Quality over speed

### Be Honest
- If a note isn't ready, skip it
- Come back to it later
- No pressure to process everything

### Trust the Workflow
- Each maturity level has a recommended path
- The system knows what works
- Follow the suggestions

### Ask Questions
- The system will ask clarifying questions
- Answer honestly and thoroughly
- Your answers shape the output

### Stop Anytime
- You can exit and resume later
- No notes are lost
- Progress is tracked

## File Locations

**Inbox**: `$HOME/dev/Notes/inbox/`
**Permanent**: `$HOME/dev/Notes/permanent/`
**Fleeting**: `$HOME/dev/Notes/fleeting/`
**Archive**: `$HOME/dev/Notes/archive/`

## Session Summary

After processing, you'll see:

```
📊 Inbox Processing Summary
✅ Processed: X notes
📝 Moved to permanent: X
📋 Moved to fleeting: X
⏭️ Skipped: X
🗑️ Deleted: X
📦 Remaining in inbox: X
```

## Related Commands

- `/daily-review` - Process fleeting notes from yesterday
- `/create-fleeting` - Capture a new fleeting note
- `/process-fleeting` - Convert a specific fleeting note
- `/validate-note` - Check note quality
- `/find-links` - Find connections for a note
- `/find-orphans` - Find unlinked notes

## Key Principles

✅ **One Note at a Time**
- Sequential processing
- No batch operations
- You control the pace

✅ **Intelligent Routing**
- Assesses maturity level
- Routes to appropriate workflow
- Adapts to note state

✅ **Question-Driven**
- Asks about purpose
- Asks about next steps
- Asks where to stop

✅ **User Control**
- Never moves without confirmation
- Never deletes without confirmation
- Can skip any note
- Can stop anytime

✅ **Progress Tracking**
- Updates MATURITY_TRACKER.md
- Provides session summary
- Shows what was accomplished

## Troubleshooting

### "I'm not sure what maturity level my note is"
- The inbox processor will assess it for you
- It explains the reasoning
- You can ask for clarification

### "I want to skip a note but come back later"
- Choose option 5: Skip this note
- It stays in inbox
- Process it next time

### "I accidentally deleted a note"
- Check your git history
- Notes are tracked in version control
- You can recover from git

### "The workflow isn't working for my note"
- You can always choose a different option
- Try a different workflow
- Or skip and come back later

## Advanced Usage

### Process Specific Notes
```
@inbox-processor I have these notes in my inbox:
- note1.md
- note2.md
- note3.md

Please process them one-by-one.
```

### Process with Context
```
@inbox-processor I'm at Stage 2 of my second brain journey.
I have 5 notes in my inbox. Please help me process them
and move them to the right folders.
```

### Resume Processing
```
@inbox-processor I stopped processing earlier.
I have 3 notes left in my inbox. Let's continue.
```

## Integration with Other Agents

The inbox processor works with:
- **@note-clarifier** - For vague notes
- **@note-processor** - For structuring notes
- **@link-strategist** - For finding connections
- **@quality-checker** - For validating notes
- **@second-brain** - For overall coordination

## Best Practices

1. **Process regularly** - Don't let inbox grow too large
2. **Be specific** - Provide clear answers to questions
3. **Trust the system** - Follow recommended workflows
4. **Take breaks** - Stop when you need to
5. **Review progress** - Check MATURITY_TRACKER.md
6. **Iterate** - You can always improve notes later

## Questions?

Ask the inbox processor directly:
```
@inbox-processor I have a question about...
```

Or ask the main agent:
```
@second-brain How do I use the inbox processor?
```

