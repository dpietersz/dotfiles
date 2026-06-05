# Agent Model Mapping

Managed subagents use Pi `provider/model` notation. Validate available models with `pi --list-models`.

## Current Mapping

| Agent | Model | Thinking | Purpose |
|---|---|---|---|
| **scout** | `google/gemini-3.5-flash` | — | Fast codebase recon |
| **eagle-scout** | `opencode-go/kimi-k2.6` | medium | Deep multi-file research |
| **planner** | `openai-codex/gpt-5.5` | high | Highest-leverage planning artifact |
| **engineer** | `opencode-go/kimi-k2.6` | medium | Standard implementation |
| **lead-engineer** | `opencode/claude-opus-4-8` | high | Complex architecture-sensitive implementation |
| **researcher** | `google/gemini-3.5-flash` | — | Web research synthesis |
| **perplexity-researcher** | `google/gemini-3.5-flash` | — | Direct Perplexity Sonar API research |
| **reviewer** | `openai-codex/gpt-5.4-mini` | medium | Design/code review |
| **code-reviewer** | `openai-codex/gpt-5.4-mini` | medium | Deep code quality review |
| **context-builder** | `openai-codex/gpt-5.4-mini` | low | Context/meta-prompt generation |
| **project-manager** | `openai-codex/gpt-5.4-mini` | medium | Linear PM operations |

## Strategy

Choose the cheapest strong model per task shape, then specialize behavior with:

1. **Agent context** — role, tools, output format, domain-specific workflow.
2. **Traits** — dynamic expertise/personality/approach overlays.
3. **Chains** — structured artifact handoffs between focused contexts.

Chain step `model:` overrides agent defaults. When changing an agent model, update both the agent file and chain overrides that call that agent.
