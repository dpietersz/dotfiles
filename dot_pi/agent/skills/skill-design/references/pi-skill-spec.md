# Pi Skill Specification — Quick Reference

Distilled from the [Agent Skills standard](https://agentskills.io/specification) and pi documentation.

## Skill Loading Lifecycle

1. **Startup**: Pi scans skill locations, extracts `name` and `description` from frontmatter
2. **System prompt**: Available skills listed as `<available_skills>` with name, description, location
3. **On match**: Agent uses `read` tool to load full SKILL.md (progressive disclosure)
4. **Execution**: Agent follows instructions, using relative paths for scripts and references

This is progressive disclosure — only descriptions are always in context. Full instructions load on-demand. This is why the description is critical for routing.

## Skill Locations (priority order)

| Location | Path | Priority |
|----------|------|----------|
| CLI | `--skill <path>` | Highest |
| Project | `.pi/skills/`, `.agents/skills/` | High |
| Packages | `skills/` in packages | Medium |
| Global | `~/.pi/agent/skills/`, `~/.agents/skills/` | Low |
| Settings | `skills` array in settings.json | Low |

Discovery: Direct `.md` files in root + recursive `SKILL.md` under subdirectories.

## Frontmatter (YAML)

| Field | Required | Rules |
|-------|----------|-------|
| `name` | Yes | 1-64 chars. Lowercase a-z, 0-9, hyphens. Must match parent directory. No leading/trailing/consecutive hyphens. |
| `description` | Yes | Max 1024 chars. What the skill does + when to use it. **This determines routing.** |
| `license` | No | License name or reference |
| `compatibility` | No | Max 500 chars. Environment requirements. |
| `metadata` | No | Arbitrary key-value pairs |
| `allowed-tools` | No | Space-delimited pre-approved tools (experimental) |
| `disable-model-invocation` | No | When `true`, hidden from system prompt. Users must use `/skill:name`. |

## Required Structure

```
my-skill/                    # Directory name = skill name (kebab-case)
└── SKILL.md                 # Required. Everything else is freeform.
```

## SKILL.md Format

```markdown
---
name: my-skill
description: What this does. When to use it. Be specific.
---

# My Skill

[Instructions for the agent. Use imperative voice.]

## Section

[Structured workflow or reference material.]
```

## Skill Commands

Skills auto-register as `/skill:name`:
```
/skill:my-skill               # Load and execute
/skill:my-skill do something   # Load with arguments
```

Arguments appended as `User: <args>` to the skill content.

## Validation Rules (pi warns but loads)

- Name doesn't match parent directory → warning
- Name exceeds 64 chars → warning
- Name has invalid characters → warning
- Description missing → **not loaded**
- Name collision → warning, first found wins

## Cross-Harness Compatibility

Pi can load Claude Code and Codex skills via settings:
```json
{ "skills": ["~/.claude/skills", "~/.codex/skills"] }
```

## Best Practices

1. **Description is king** — It's the ONLY thing always in context. Make it specific and trigger-rich.
2. **Progressive disclosure** — SKILL.md loads on-demand. Reference files load only when the agent reads them.
3. **Relative paths** — Always reference scripts/references relative to skill directory.
4. **Lean over complete** — A 50-line skill that works beats a 500-line skill that confuses.
5. **Imperative voice** — "Read the config file" not "You should consider reading the config file".
6. **Concrete examples** — Show 1-3 examples of actual usage. Don't hypothesize.
