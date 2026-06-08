---
title: "Judge Criteria"
description: "Evaluating agent outputs with LLMs or agent CLIs via TOML configuration"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/rewardkit/judge-criteria"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"213d41914731aa295ed2be4fafca4fef\""
---

[harbor](https://www.harborframework.com/)
[harbor](https://www.harborframework.com/)
`⌘``K`
[docs](https://www.harborframework.com/docs)[news](https://www.harborframework.com/news)[](https://hub.harborframework.com)[](https://discord.gg/6xWPKhGDbA)[Motivation](https://www.harborframework.com/docs)[Getting Started](https://www.harborframework.com/docs/getting-started)[Core Concepts](https://www.harborframework.com/docs/core-concepts)[Migrating from Terminal-Bench](https://www.harborframework.com/docs/migration)
Run Jobs
Leaderboard
Tasks
Datasets
Sharing
Agents
Training Workflows
Tutorials
Reward Kit
[Reward Kit](https://www.harborframework.com/docs/rewardkit)[Judge Criteria](https://www.harborframework.com/docs/rewardkit/judge-criteria)[Built-in Criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria)[Motivation & Design](https://www.harborframework.com/docs/rewardkit/motivation)
Contributing
[](https://github.com/laude-institute/harbor)
Judge CriteriaLLM judge
Reward Kit
# Judge Criteria
Copy Markdown
Evaluating agent outputs with LLMs or agent CLIs via TOML configuration
Judge criteria let you use an LLM or agent CLI to evaluate work, configured via TOML files. This makes it trivial to reuse and share rubrics between tasks.
## [LLM judge](https://www.harborframework.com/docs/rewardkit/judge-criteria#llm-judge)
tests/quality.toml

```
[judge]
judge = "anthropic/claude-sonnet-4-6"
files = ["/app/main.py", "/app/utils.py"]

[[criterion]]
description = "Is the code correct?"
type = "binary"

[[criterion]]
description = "How readable is the code?"
type = "likert"
points = 5
weight = 2.0

[[criterion]]
description = "Rate the test coverage on a scale from 0 to 100"
type = "numeric"
min = 0
max = 100
```

The `judge` field accepts any [LiteLLM model string](https://docs.litellm.ai/docs/providers). It can be overridden at invocation time without editing the rubric. See [Provider routing](https://www.harborframework.com/docs/rewardkit#provider-routing).
## [Agent judge](https://www.harborframework.com/docs/rewardkit/judge-criteria#agent-judge)
Agent judges shell out to a CLI like Claude Code or Codex. Unlike LLM judges, they can explore the filesystem and run commands:
tests/review.toml

```
[judge]
judge = "claude-code"
model = "anthropic/claude-sonnet-4-6"
isolated = true

[[criterion]]
description = "Does the solution handle edge cases?"
type = "binary"
```

Agent judges are slower and more expensive but can interact with the workspace directly.
## [Individual mode](https://www.harborframework.com/docs/rewardkit/judge-criteria#individual-mode)
Set `mode = "individual"` to make one LLM call per criterion instead of batching them. Each criterion can scope its own `files`:
tests/quality.toml

```
[judge]
judge = "anthropic/claude-sonnet-4-6"
mode = "individual"

[[criterion]]
description = "Is the analysis correct?"
files = ["/app/analysis.pdf"]

[[criterion]]
description = "Is the spreadsheet well-structured?"
files = ["/app/data.xlsx"]
```

Criteria without `files` fall back to `[judge].files`.
## [Configuration reference](https://www.harborframework.com/docs/rewardkit/judge-criteria#configuration-reference)
### [`[judge]` section](https://www.harborframework.com/docs/rewardkit/judge-criteria#judge-section)
Prop
Type
`judge?`string
`model?`string | null
`files?`list[string]
`mode?`"batched" | "individual"
`timeout?`integer
`reasoning_effort?`"low" | "medium" | "high"
`isolated?`boolean
`reference?`string | null
`atif-trajectory?`string | null
`weight?`number
`prompt_template?`string | null
### [`[[criterion]]` entries](https://www.harborframework.com/docs/rewardkit/judge-criteria#criterion-entries)
Prop
Type
`description?`string
`type?`"binary" | "likert" | "numeric"
`name?`string | null
`points?`integer
`min?`number
`max?`number
`weight?`number
`files?`list[string]
### [`[scoring]` section](https://www.harborframework.com/docs/rewardkit/judge-criteria#scoring-section)
Controls how the judge's criteria are aggregated into a single score. This only affects criteria within this TOML file — it does not change how programmatic and judge scores are combined across the directory.

```
[scoring]
aggregation = "all_pass"  # weighted_mean | all_pass | any_pass | threshold
threshold = 0.7           # only used with "threshold" aggregation
```

## [Score normalization](https://www.harborframework.com/docs/rewardkit/judge-criteria#score-normalization)
  * **Binary** : yes/true/1 → 1.0, anything else → 0.0
  * **Likert** : normalized to [0, 1] as `(raw - 1) / (points - 1)`
  * **Numeric** : normalized to [0, 1] as `(raw - min) / (max - min)`


## [Trajectory evaluation](https://www.harborframework.com/docs/rewardkit/judge-criteria#trajectory-evaluation)
To evaluate the agent's process rather than just its output, point the judge at the trajectory file:

```
[judge]
judge = "anthropic/claude-sonnet-4-6"
atif-trajectory = "/logs/trajectory.json"
files = ["/app/main.py"]

[[criterion]]
description = "Did the agent take an efficient approach?"
type = "likert"
points = 5
```

The trajectory content is truncated proportionally to fit within the model's context window while preserving all steps.
## [Custom prompt templates](https://www.harborframework.com/docs/rewardkit/judge-criteria#custom-prompt-templates)
You can provide your own prompt instead of the built-in one:

```
[judge]
judge = "anthropic/claude-sonnet-4-6"
prompt_template = "my_prompt.md"
```

The template must contain a `{criteria}` placeholder where criterion descriptions get injected.
[Reward Kit Lightweight package to define and run verifiers](https://www.harborframework.com/docs/rewardkit)[Built-in Criteria Reference for all built-in criterion functions](https://www.harborframework.com/docs/rewardkit/built-in-criteria)
[LLM judge](https://www.harborframework.com/docs/rewardkit/judge-criteria#llm-judge)[Agent judge](https://www.harborframework.com/docs/rewardkit/judge-criteria#agent-judge)[Individual mode](https://www.harborframework.com/docs/rewardkit/judge-criteria#individual-mode)[Configuration reference](https://www.harborframework.com/docs/rewardkit/judge-criteria#configuration-reference)[`[judge]` section](https://www.harborframework.com/docs/rewardkit/judge-criteria#judge-section)[`[[criterion]]` entries](https://www.harborframework.com/docs/rewardkit/judge-criteria#criterion-entries)[`[scoring]` section](https://www.harborframework.com/docs/rewardkit/judge-criteria#scoring-section)[Score normalization](https://www.harborframework.com/docs/rewardkit/judge-criteria#score-normalization)[Trajectory evaluation](https://www.harborframework.com/docs/rewardkit/judge-criteria#trajectory-evaluation)[Custom prompt templates](https://www.harborframework.com/docs/rewardkit/judge-criteria#custom-prompt-templates)
