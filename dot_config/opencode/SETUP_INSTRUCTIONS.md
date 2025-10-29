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
