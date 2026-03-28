# Pi Agent Configuration — Subagents, traits, tools, and skills for the pi coding agent

## Architecture

Chezmoi deploys this directory to `~/.pi/agent/`. The minion-subagents extension provides trait-composed subagent execution: agent context (markdown `.md`) + behavioral traits (`traits.yaml`) + template (`agent-template.hbs`) are composed at runtime into a system prompt. Each subagent runs in an isolated context window and returns compressed findings. Custom tools (pm-tool, docsfetch, fabric, webfetch) extend the agent's capabilities.

## Repository Structure

```
agents/                     # 11 subagent definitions (markdown frontmatter)
extensions/
├── auth-sync/              # OAuth token sync across machines via daemon
├── context-window.ts       # /ctx command — visual context usage overlay
├── minion-subagents/       # Subagent framework (execution, chains, traits, TUI)
├── ref-docs.ts             # Injects cached doc indexes into system prompt
└── tools/                  # Custom tools (auto-discovered by index.ts)
skills/                     # 9 skills loaded on-demand via progressive disclosure
standards/                  # Code quality and security rules
settings.json               # Pi preferences: model, theme, packages
traits.yaml                 # Behavioral trait definitions (expertise, personality, approach)
```

## Key Files

- `settings.json` — Default model (`claude-opus-4-6`), theme (`midnight-ocean`), thinking level (`high`), installed packages
- `traits.yaml` — Three trait dimensions (expertise, personality, approach) + presets (security-auditor, careful-implementer, deep-researcher, etc.)
- `agents/agent-template.hbs` — Handlebars template composing agent context + traits into system prompt
- `extensions/minion-subagents/index.ts` — Main extension: `subagent` tool, `/agents`, `/chain`, `/run` commands
- `extensions/minion-subagents/compose-traits.ts` — Trait resolution and system prompt composition
- `extensions/tools/index.ts` — Auto-discovers `.ts` tool modules in the tools directory
- `extensions/tools/pm-tool.ts` — Linear project management (requires `LINEAR_ACCESS_TOKEN`)
- `standards/code-quality.md` — Code quality rules injected via load-context

## Subagent Model Mapping

| Agent | Model | Thinking | Purpose |
|-------|-------|----------|---------|
| scout | claude-haiku-4-5 | — | Fast codebase recon |
| eagle-scout | claude-sonnet-4-5 | high | Deep multi-file research |
| planner | claude-opus-4-6 | high | Implementation planning |
| engineer | claude-sonnet-4-5 | medium | General implementation |
| lead-engineer | claude-opus-4-6 | high | Complex architecture |
| researcher | claude-sonnet-4-5 | medium | Web research synthesis |
| code-reviewer | openai-codex/gpt-5.4-mini | high | Code review |
| reviewer | claude-sonnet-4-5 | medium | General review |
| project-manager | openai-codex/gpt-5.4-mini | medium | Linear PM operations |
| context-builder | claude-haiku-4-5 | — | Context + meta-prompt generation |

## Conventions

- **Agent files**: Markdown with YAML frontmatter (`name`, `description`, `model`, `thinking`, `tools`, `skills`)
- **Tool files**: `.ts` file + matching `.txt` description file. Export `register(pi)` function.
- **Skills**: Directory with `SKILL.md` (YAML frontmatter: `name`, `description`). Optional `references/` subdirectory.
- **Traits**: Imperative voice, 3-5 lines max per fragment, positive framing
- **Trait dimensions**: `expertise` (domain focus), `personality` (thinking style), `approach` (work methodology)

## Context Engineering

- **Subagent delegation**: Each subagent gets a fresh context window — no inherited noise
- **Trait composition**: `{ agent: "scout", traits: ["security", "skeptical"], task: "..." }` injects behavioral shaping without loading additional context
- **Presets**: Named trait combos — `security-auditor` (scout + security, skeptical, thorough), `careful-implementer` (engineer + implementation, disciplined, systematic)
- **Progressive disclosure**: Skills load on-demand. Only descriptions always in context.
- **Target**: 40-60% context utilization. Delegate exploration to keep main session lean.
