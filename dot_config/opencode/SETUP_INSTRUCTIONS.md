# Second Brain Agent System - Setup Instructions

## What You Have

A complete, production-ready OpenCode agent system for building a personal knowledge system using atomic notes and the Zettelkasten method.

**Components**:
- ✅ 1 Primary Agent (`second-brain`)
- ✅ 8 Specialized Subagents
- ✅ 11 Quick Commands
- ✅ 4 User Guides
- ✅ Complete Configuration

**Status**: Ready to deploy via `chezmoi apply`

## Installation Steps

### Step 1: Apply Dotfiles

```bash
chezmoi apply
```

This will copy all files from `dot_config/opencode/` to `~/.config/opencode/`

### Step 2: Verify Installation

```bash
# Check agents are installed
ls ~/.config/opencode/agent/

# Check commands are installed
ls ~/.config/opencode/command/

# Verify configuration
cat ~/.config/opencode/opencode.json
```

Expected output:
- 9 agent files (second-brain.md + 8 subagents)
- 11 command files
- opencode.json configuration

### Step 3: Start OpenCode

```bash
opencode
```

You should see the OpenCode prompt. Now you can start using the system!

## First Session

### Option A: Start with Primary Agent

```
@second-brain I want to start building my second brain system. What should I do first?
```

The agent will:
1. Check your maturity stage
2. Explain the system
3. Guide you through first steps

### Option B: Use a Command

```
/create-fleeting
```

This will guide you through capturing your first fleeting note.

### Option C: Invoke a Subagent Directly

```
I have an idea about atomic notes. @note-clarifier can you help me clarify it?
```

The subagent will ask clarifying questions to help you refine your thinking.

## Key Files to Know

### User Guides

- **QUICK_START.md** - Get started in 5 minutes
- **SECOND_BRAIN_README.md** - Comprehensive documentation
- **MATURITY_TRACKER.md** - Track your progress

### System Files

- **opencode.json** - Configuration (don't edit manually)
- **agent/second-brain.md** - Primary agent (reference only)
- **agent/*.md** - Subagents (reference only)
- **command/*.md** - Commands (reference only)

### Reference

- **IMPLEMENTATION_COMPLETE.md** - Architecture overview
- **SETUP_INSTRUCTIONS.md** - This file

## Recommended First Week

### Day 1: Setup & First Note
- [ ] Run `chezmoi apply`
- [ ] Verify installation
- [ ] Use `/create-fleeting` to capture first idea
- [ ] Use `/process-fleeting` to convert to permanent note
- [ ] Use `/find-links` to find connections

### Day 2-7: Daily Reviews
- [ ] Each day: Use `/daily-review` (5-10 min)
- [ ] Capture fleeting notes
- [ ] Convert 1-2 to permanent notes
- [ ] Identify connections

### End of Week: Weekly Review
- [ ] Use `/weekly-review` (30-60 min)
- [ ] Link all notes created this week
- [ ] Identify emerging clusters
- [ ] Plan next week

## Common Commands

| Command | Purpose | Time |
|---------|---------|------|
| `/create-fleeting` | Capture new idea | 2-5 min |
| `/process-fleeting` | Convert to permanent | 5-10 min |
| `/find-links` | Find connections | 5-10 min |
| `/validate-note` | Check quality | 5 min |
| `/daily-review` | Process inbox | 5-10 min |
| `/weekly-review` | Link & organize | 30-60 min |
| `/monthly-review` | Audit system | 1-2 hours |
| `/check-pitfalls` | Scan for issues | 10 min |
| `/fix-naming` | Fix consistency | 10-15 min |

## Subagent Quick Reference

Mention these with @ when you need specialized help:

- **@note-clarifier** - Ask clarifying questions
- **@note-processor** - Structure notes
- **@link-strategist** - Find connections
- **@quality-checker** - Validate quality
- **@moc-architect** - Create MOCs
- **@naming-specialist** - Fix naming
- **@review-coordinator** - Guide reviews
- **@pitfall-detector** - Prevent mistakes

## Troubleshooting

### OpenCode not found

```bash
# Install OpenCode if not already installed
npm install -g @opencode/cli
# or
brew install opencode
```

### Configuration errors

```bash
# Verify configuration is valid
opencode --version

# Check configuration file
cat ~/.config/opencode/opencode.json
```

### Agents not loading

```bash
# Verify agent files exist
ls ~/.config/opencode/agent/

# Check file permissions
chmod 644 ~/.config/opencode/agent/*.md
chmod 644 ~/.config/opencode/command/*.md
```

## Key Principles

1. **Start Simple**: Don't wait for perfect system
2. **Process Regularly**: Daily reviews are key
3. **Link Intentionally**: Explain every connection
4. **One Idea Per Note**: Split if "and also..." appears
5. **Ask Questions**: Agents guide, don't dictate
6. **Propose First**: See changes before they're made
7. **Trust the Process**: Insights emerge over time

## Next Steps

1. **Today**: Run `chezmoi apply` and start with `/create-fleeting`
2. **This Week**: Build daily review habit
3. **Next Week**: Do your first weekly review
4. **Next Month**: Do your first monthly review

## Support

- **Questions**: Ask the primary agent: `@second-brain what should I do next?`
- **Documentation**: See QUICK_START.md or SECOND_BRAIN_README.md
- **Progress**: Check MATURITY_TRACKER.md to see your stage
- **Issues**: Use `/check-pitfalls` to scan for common mistakes

## Remember

This system is a tool to help you think better, not a system to maintain. Start simple, iterate, and let it evolve with your needs.

**Your second brain is ready. Let's build something great!** 🧠

---

**Questions?** Start with `@second-brain` and ask anything. The system is designed to guide you.
