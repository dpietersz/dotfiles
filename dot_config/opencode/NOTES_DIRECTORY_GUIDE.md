# Notes Directory Guide

## Overview

Your second-brain agent system manages your personal knowledge system stored in `$HOME/dev/Notes`. This guide explains the directory structure, how agents access it, and best practices for organizing your notes.

## Directory Structure

The recommended structure for your Notes directory:

```
$HOME/dev/Notes/
├── inbox/                    # Fleeting notes (temporary captures)
│   ├── 20250101120000.md    # Timestamp-based IDs
│   ├── 20250101120015.md
│   └── ...
├── fleeting/                 # Organized fleeting notes
│   ├── #fleeting-tag/
│   └── ...
├── literature/               # Notes from external sources
│   ├── book-title/
│   ├── article-title/
│   └── ...
├── permanent/                # Atomic permanent notes
│   ├── 20250101120000-atomic-notes-increase-linkability.md
│   ├── 20250101120015-zettelkasten-method-overview.md
│   └── ...
├── maps/                     # Maps of Content (MOCs)
│   ├── knowledge-management.md
│   ├── personal-development.md
│   └── ...
├── archive/                  # Completed projects and old notes
│   ├── project-name/
│   └── ...
├── MATURITY_TRACKER.md       # Progress tracking (created by agents)
└── README.md                 # Your notes system overview
```

## File Naming Conventions

### Fleeting Notes
- **Location**: `inbox/` or `fleeting/`
- **Format**: `YYYYMMDDHHMMSS.md` (timestamp-based)
- **Example**: `20250101120000.md`
- **Tag**: Include `#fleeting` tag in frontmatter

### Permanent Notes
- **Location**: `permanent/`
- **Format**: `YYYYMMDDHHMMSS-descriptive-title.md`
- **Example**: `20250101120000-atomic-notes-increase-linkability.md`
- **ID**: Use timestamp in filename and frontmatter

### Literature Notes
- **Location**: `literature/source-name/`
- **Format**: `YYYYMMDDHHMMSS-source-title.md`
- **Example**: `literature/how-to-take-smart-notes/20250101120000-chapter-3-summary.md`

### Maps of Content
- **Location**: `maps/`
- **Format**: `topic-name.md`
- **Example**: `maps/knowledge-management.md`

## Note Frontmatter Format

All notes should include YAML frontmatter:

```yaml
---
id: YYYYMMDDHHMMSS
aliases: [alternative titles]
tags: [#concept, #domain, #type]
created: 2025-01-01T12:00:00Z
updated: 2025-01-01T12:00:00Z
---

# Note Title as Complete Sentence

Content here...
```

## Agent Access

All agents have full read/write access to `$HOME/dev/Notes`:

| Agent | Read | Write | Purpose |
|-------|------|-------|---------|
| second-brain | ✅ | ✅ | Orchestration and coordination |
| note-clarifier | ✅ | ❌ | Analyze existing notes |
| note-processor | ✅ | ✅ | Create and update permanent notes |
| link-strategist | ✅ | ❌ | Analyze connections |
| quality-checker | ✅ | ❌ | Validate note quality |
| moc-architect | ✅ | ✅ | Create and update MOCs |
| naming-specialist | ✅ | ❌ | Audit naming conventions |
| review-coordinator | ✅ | ✅ | Guide reviews and updates |
| pitfall-detector | ✅ | ❌ | Scan for issues |

## Cross-Machine Compatibility

The configuration uses `$HOME` environment variable, making it work on any machine:

- **Linux**: `$HOME` = `/home/username`
- **macOS**: `$HOME` = `/Users/username`
- **Remote (Docker/Devcontainer)**: `$HOME` = `/root` or `/home/user`

After `chezmoi apply`, the system automatically expands `$HOME` to your actual home directory.

## Getting Started

### Step 1: Create Directory Structure

```bash
mkdir -p $HOME/dev/Notes/{inbox,fleeting,literature,permanent,maps,archive}
```

### Step 2: Create Initial README

```bash
cat > $HOME/dev/Notes/README.md << 'EOF'
# My Second Brain

Personal knowledge system using atomic notes and Zettelkasten method.

## Quick Stats
- Total notes: 0
- Permanent notes: 0
- MOCs: 0
- Last review: Never

## Recent Activity
- Created: [date]
EOF
```

### Step 3: Start Using

```bash
opencode
@second-brain I want to start building my second brain system
```

## Best Practices

1. **Keep fleeting notes temporary**: Move to permanent within 1-2 days
2. **One idea per permanent note**: Enforce atomic principle
3. **Use complete sentence titles**: Not just topics
4. **Link intentionally**: Explain every connection
5. **Review regularly**: Daily (5-10 min), Weekly (30-60 min), Monthly (1-2 hours)
6. **Archive completed projects**: Keep system clean
7. **Update MOCs monthly**: Reflect emerging patterns

## Troubleshooting

### Agents can't find notes
- Verify `$HOME/dev/Notes` directory exists
- Check file permissions: `chmod 755 $HOME/dev/Notes`
- Verify files are readable: `ls -la $HOME/dev/Notes/`

### Notes not being updated
- Check write permissions: `touch $HOME/dev/Notes/test.md`
- Verify agent has edit permission in opencode.json
- Check disk space: `df -h $HOME/dev/`

### Cross-machine sync issues
- Use git to version control your notes
- Or use cloud sync (Dropbox, iCloud, OneDrive)
- Or use rsync for manual sync

## Next Steps

1. Create the directory structure
2. Run `chezmoi apply` to install agents
3. Start with `/create-fleeting` to capture your first idea
4. Use `/daily-review` to process notes
5. Let the system guide you from there

---

**Your Notes directory is now ready for your second brain system!** 🧠

