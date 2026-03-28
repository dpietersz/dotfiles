# AGENTS.md Section Templates

Concrete templates for each section. Copy the structure, fill with repo-specific content.

## Title

```markdown
# Project Name — One-line purpose (under 80 chars)
```

Example:
```markdown
# Minions AI Infra — AWS warm-pool EC2 infrastructure for AI coding agents
```

## Architecture

2-4 lines describing data flow. How things connect, not what exists.

```markdown
## Architecture

Two-phase AMI model: **Base AMI** (Packer-built, Debian 12 + tooling) → **Warm AMI**
(snapshotted with dotfiles/auth baked in, boots in ~30s). Permanent infra is Terraform-managed.
Ephemeral pool instances launch from warm AMI, self-terminate after 45min idle.
```

Bad: "The project has a frontend built with React, a backend with Express, and a PostgreSQL database."
Good: "React SPA → Express API (JWT auth) → PostgreSQL. Deployed via Docker Compose on a single VPS with Caddy reverse proxy."

## Repository Structure

Tree format, max 15 entries. One-line purpose comments.

```markdown
## Repository Structure

\`\`\`
terraform/         # AWS permanent infra (IAM, SG, SSM, OIDC)
packer/aws/        # Packer template for base AMI build
scripts/           # pool.sh, dispatch.sh, github-pat-create.sh
dashboard/         # Next.js dashboard (Drizzle ORM, shadcn/ui)
dotfiles/home/     # Chezmoi-managed dotfiles
justfile           # All operational commands (primary entrypoint)
mise.toml          # Tool versions
\`\`\`
```

## Key Files

5-10 files with `path` — purpose. Only files an agent MUST know to work effectively.

```markdown
## Key Files

- `justfile` — All commands; run `just` for overview
- `scripts/pool.sh` — claim/release/drain/status logic
- `terraform/aws/main.tf` — Core AWS infrastructure
- `packer/aws/base.pkr.hcl` — Base AMI definition
- `dashboard/src/app/page.tsx` — Dashboard entry point
```

## Tech Stack

List with versions when pinned. Group by category.

```markdown
## Tech Stack

- **IaC**: Terraform, Packer (HCL)
- **Runtime**: Debian 12, Docker, systemd, Tailscale SSH
- **Tools**: mise (version manager), chezmoi (dotfiles), AWS CLI v2
- **Dashboard**: Next.js 15, TypeScript, Drizzle ORM, shadcn/ui, Bun
- **Task runner**: just
```

## Build/Test Commands

Exact shell commands in a code block. No prose.

```markdown
## Build/Test Commands

\`\`\`bash
mise install                          # Install all tools
npm install                           # Install dependencies
npm run dev                           # Start dev server
npm test                              # Run test suite
npm run lint                          # Lint check
npm run build                         # Production build
\`\`\`
```

## Conventions

Specific, not vague. Include commit format, code style, naming, PR process.

```markdown
## Conventions

- **Commits**: Conventional commits (`type(scope): description`)
- **Code style**: Prettier + ESLint (run `npm run lint` before committing)
- **Naming**: Components PascalCase, utilities camelCase, constants UPPER_SNAKE
- **PRs**: Branch from `main`, require 1 review, squash merge
- **Tests**: Co-locate with source (`*.test.ts` next to `*.ts`)
```

## Conditional: Dotfiles / Chezmoi

Include when `dotfiles/` or `.chezmoiroot` exists.

```markdown
## Dotfiles & Chezmoi

Dotfiles in `dotfiles/home/` managed by chezmoi. `.chezmoiroot` points to `dotfiles/home/`.

**Workflow**: Edit `dotfiles/home/...` → commit+push → `chezmoi apply` to deploy locally.

**Template variables**: See `.chezmoi.toml.tmpl` for available variables (`remote`, `isMacOS`, etc.)

**Key patterns**:
- `dot_` prefix → dotfiles (e.g., `dot_bashrc` → `~/.bashrc`)
- `executable_` prefix → scripts with +x
- `.tmpl` suffix → chezmoi template rendering
```

## Conditional: Pi Agent Configuration

Include when `dot_pi/agent/` or `.pi/agents/` exists.

```markdown
## Pi Agent Configuration

Agent config deployed to `~/.pi/agent/` via chezmoi.

\`\`\`
dot_pi/agent/
├── agents/          # Subagent definitions (markdown frontmatter)
├── extensions/      # Custom tools and extensions
├── skills/          # Specialized instruction packages
├── standards/       # Code quality and security rules
└── traits.yaml      # Behavioral trait definitions for subagent composition
\`\`\`
```

## Conditional: Context Engineering

Include when subagents, chains, or delegation patterns exist.

```markdown
## Context Engineering

- **Subagent delegation**: scout (fast recon), researcher (web), project-manager (Linear)
- **Mandatory delegation**: Linear ops → `project-manager`, code research → `scout`
- **Trait composition**: Add traits to shape behavior — `{ agent: "scout", traits: ["security", "skeptical"] }`
- **Context target**: 40-60% utilization. Delegate exploration to keep main context lean.
```

## Conditional: Project Management

Include when Linear, Jira, or other PM integration detected.

```markdown
## Project Management (Linear)

**Project**: [Project Name](url) (Team, PREFIX-*)
**Workflow**: Backlog → Todo → In Progress → In Review → Done
**Source of truth**: Linear is the source of truth for project docs — not the repo.

| Milestone | Target | Focus |
|-----------|--------|-------|
| Phase 1   | Date   | Description |
| Phase 2   | Date   | Description |
```

## Footnotes Pattern

Use footnotes for borrowed patterns or concepts needing brief explanation.

```markdown
Design influenced by Stripe's Minions[^1] and Frequent Intentional Compaction[^2].

---

[^1]: **Stripe Minions**: Stripe's unattended coding agents on pre-warmed EC2 instances.
[^2]: **Frequent Intentional Compaction**: Split work into research → plan → implement phases,
each producing a dense artifact consumed by the next in a fresh context window.
```
