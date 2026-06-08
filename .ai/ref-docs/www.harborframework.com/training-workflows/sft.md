---
title: "SFT"
description: "Generating SFT datasets from Harbor trials"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/training-workflows/sft"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"46156ed18f0b5cbd240b2a6d258f1fbf\""
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
[RL](https://www.harborframework.com/docs/training-workflows/rl)[SFT](https://www.harborframework.com/docs/training-workflows/sft)
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
SFTKey options
Training Workflows
# SFT
Copy Markdown
Generating SFT datasets from Harbor trials
Harbor includes utilities for turning trials (agent task completion attempts) into conversational traces that can be fed into supervised fine-tuning pipelines for agentic LLMs. Export helpers live under `harbor.utils.traces_utils` and power several CLI entry points.
Requires ATIF trajectory format
The SFT exporter works with any agent that produces trajectories in the [ATIF format](https://www.harborframework.com/docs/agents/trajectory-format). This includes Terminus-2, OpenHands, Claude Code, Gemini CLI, and other agents with ATIF support. Agents without ATIF trajectory support cannot be exported.
For best results with SFT data export, configure Terminus-2 with appropriate trajectory settings:

```
from harbor.models.agent.trajectory_config import TrajectoryConfig

trajectory_config = TrajectoryConfig(
    raw_content=True,      # Preserve exact LLM responses for SFT
    linear_history=True    # Split on summarization for clean sequences
)
```

Learn more about trajectory configuration options in the [Terminus-2 documentation](https://www.harborframework.com/docs/agents/terminus-2#trajectory-configuration).
  * Each exported row represents one `agent/episode-*` directory and captures the input `debug.json` messages plus the final agent reply from `response.json` or `response.txt`.
  * Rows include metadata such as `agent`, `model`, `model_provider`, `task`, `trial_name`, `episode`, and `run_id`, letting you merge runs from multiple jobs.
  * `--sharegpt` adds a ShareGPT-style column to support instruction-tuning datasets expecting the `{"from": "...", "value": "..."}` schema.
  * Success filtering (`--filter success|failure`) inspects `result.json` and lets you keep only passing or failing attempts for curriculum-style datasets.


Run `harbor traces export` on a trial directory (or a parent directory) to build a `datasets.Dataset`. The command prints the number of rows produced and, when `--push` is set, uploads directly to the Hugging Face Hub.

```
harbor traces export \
  --path trials \
  --recursive \
  --episodes last \
  --filter success \
  --sharegpt \
  --push \
  --repo my-org/harbor-terminus2-sft
```

### [Key options](https://www.harborframework.com/docs/training-workflows/sft#key-options)
Prop
Type
`--episodes?`all | last
`--sharegpt / --no-sharegpt?`flag
`--filter?`success | failure | all
`--push?`flag
`--verbose?`flag
If you want to persist the dataset locally (e.g., to Parquet), call the Python helper directly:

```
from harbor.utils.traces_utils import export_traces

dataset = export_traces("trials", episodes="last", success_filter="success")
dataset.to_parquet("harbor-terminus2-success.parquet")
```

The `datasets` library is an optional dependency; install it if you plan to export traces.
`harbor run` can export traces automatically once a job completes. Pass trace flags alongside your job invocation:

```
harbor run \
  --config examples/configs/job.yaml \
  --agent claude-code \
  --model anthropic/claude-3-sonnet-20240229 \
  --export-traces \
  --export-sharegpt \
  --export-episodes last \
  --export-push \
  --export-repo my-org/harbor-job-run
```

When `--export-traces` is set, Harbor exports from the produced job directory using the same machinery as `harbor traces export`. The `--export-*` options mirror the standalone CLI flags and default to in-memory exports unless `--export-push` is provided. Errors during export are surfaced at the end of the job run without interrupting evaluation.
`harbor sweeps run` can emit split datasets that separate successful and failed trajectories. Supply `--push` together with one of the repo arguments:

```
# Push a DatasetDict with "success" and "failure" splits
harbor sweeps run \
  --config examples/configs/job.yaml \
  --max-sweeps 3 \
  --trials-per-task 2 \
  --push \
  --export-repo my-org/harbor-sweeps
```

You can also push successes and failures to independent repos by combining `--push` with `--export-separate` (alias `--no-export-splits`) plus `--export-repo-success` and `--export-repo-failure`. These exports reuse the same trace discovery logic and default to the last episode from each trial.
[RL Reinforcement learning on Harbor tasks](https://www.harborframework.com/docs/training-workflows/rl)[Running Terminal-Bench Running Terminal-Bench on Harbor](https://www.harborframework.com/docs/tutorials/running-terminal-bench)
[Key options](https://www.harborframework.com/docs/training-workflows/sft#key-options)
