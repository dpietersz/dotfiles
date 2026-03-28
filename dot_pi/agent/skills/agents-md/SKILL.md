---
name: agents-md
description: Create and maintain AGENTS.md files for code repositories. Covers structure, section selection, drift detection, and incremental sync. Use when creating an AGENTS.md, updating an AGENTS.md, syncing AGENTS.md with repo changes, or when a repo has no AGENTS.md.
---

# AGENTS.md Creation & Maintenance

Generate and maintain AGENTS.md — the context file injected into every AI coding agent session for a repository. Every token in this file affects agent output quality.

## What AGENTS.md Is

A dense, accurate reference that gives AI agents the context they need to work effectively in a codebase. It replaces exploration — agents read AGENTS.md instead of spending context window on discovery.

**Priority**: Correctness > Completeness > Conciseness.
- Wrong info → confidently wrong code (worst)
- Missing info → wasted exploration
- Noise → diluted attention

**Target size**: 3-8KB. Dense and useful.

## Creating an AGENTS.md

### Step 1: Gather Repo Context

Read these files (skip what doesn't exist):

1. **Directory structure**: `find . -maxdepth 3 -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/vendor/*' -not -path '*/__pycache__/*' -not -path '*/.next/*' -not -path '*/dist/*' | sort | head -120`
2. **Package manifests**: `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `Makefile`, `Dockerfile`
3. **README.md** (first 8KB)
4. **Config files**: `tsconfig.json`, `eslint.config.*`, `justfile`, `.mise.toml`, `biome.json`
5. **CI config**: `.github/workflows/`, `.gitlab-ci.yml`
6. **Git remote**: `git remote get-url origin`

### Step 2: Select Sections

Include only sections that apply. Read [section-templates.md](references/section-templates.md) for the exact format of each section.

**Always include** (if applicable):

| Section | When |
|---------|------|
| Title + one-liner | Always |
| Architecture | Always (2-4 lines, data flow not component lists) |
| Repository Structure | Always (tree, max 15 entries) |
| Key Files | Always (5-10 files an agent MUST know) |
| Tech Stack | Always |
| Build/Test Commands | Always (exact shell commands) |
| Conventions | Always (commit format, code style, naming) |

**Include when detected**:

| Section | Signal |
|---------|--------|
| Dotfiles / Chezmoi | `dotfiles/` dir or `.chezmoiroot` exists |
| Pi Agent Configuration | `dot_pi/` or `.pi/agents/` exists |
| Context Engineering | Subagent definitions or chains exist |
| Project Management | PM tool, Linear integration, or issue tracker detected |

### Step 3: Write

Follow these rules strictly:

- Every line earns its place. No filler, no marketing, no meta-commentary.
- Actionable over descriptive: `run \`just test\`` beats "the project has tests."
- File paths must be verified. Read the file or confirm it exists before including.
- No unexplained acronyms — explain inline or use a footnote.
- Footnotes at the bottom for concepts needing 1-2 sentences of context.
- Use markdown: headers, tables, code blocks. Agents parse these well.

⛔ ENFORCEMENT: Every file path in AGENTS.md MUST exist. Verify with `ls` or `read` before including.

## Updating an Existing AGENTS.md

### Drift Detection

Check for these three categories of drift:

1. **Stale paths**: Extract file paths from the AGENTS.md, verify each exists
2. **Missing sections**: Compare against the section table above
3. **New signals**: Check for new top-level directories or tools not mentioned

### Incremental Sync

When drift is detected:
- Fix stale paths (update or remove)
- Add missing sections
- Preserve working content — don't rephrase for style
- Don't reorganize sections that are correct

⛔ ENFORCEMENT: Do NOT rewrite from scratch when syncing. Patch what changed, preserve what works.

## Anti-Patterns

❌ **Component lists** — "The project has a frontend, backend, and database." Describe data flow instead.
❌ **Vague conventions** — "Follow best practices." Which practices? Be specific.
❌ **Stale file paths** — References to files that no longer exist. Verify before including.
❌ **Kitchen sink** — Documenting every file. Focus on the 5-10 an agent needs most.
❌ **Marketing copy** — "Our cutting-edge platform..." Agents don't care about sales pitch.
❌ **Duplicate README** — AGENTS.md is agent-optimized context, not a copy of README.md.

## Reference

- Section templates with examples: [section-templates.md](references/section-templates.md)
