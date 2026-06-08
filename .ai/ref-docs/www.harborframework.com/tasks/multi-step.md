---
title: "Multi"
description: "Splitting a task into sequential steps with per-step instructions, tests, and setup hooks"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/tasks/multi-step"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"fac79b615b96ec0a1a67cdabe45a0794\""
---

[harbor](https://www.harborframework.com/)
[harbor](https://www.harborframework.com/)
`⌘``K`
[docs](https://www.harborframework.com/docs)[news](https://www.harborframework.com/news)[](https://hub.harborframework.com)[](https://discord.gg/6xWPKhGDbA)[Motivation](https://www.harborframework.com/docs)[Getting Started](https://www.harborframework.com/docs/getting-started)[Core Concepts](https://www.harborframework.com/docs/core-concepts)[Migrating from Terminal-Bench](https://www.harborframework.com/docs/migration)
Run Jobs
Leaderboard
Tasks
[Task Structure](https://www.harborframework.com/docs/tasks)[Publishing a task](https://www.harborframework.com/docs/tasks/publishing)[Differences from Terminal-Bench](https://www.harborframework.com/docs/tasks/task-difference)[Multi-step Tasks](https://www.harborframework.com/docs/tasks/multi-step)[Managing Resources](https://www.harborframework.com/docs/tasks/managing-resources)[Windows tasks](https://www.harborframework.com/docs/tasks/windows-container-support)[Tutorial](https://www.harborframework.com/docs/tasks/task-tutorial)
Datasets
Sharing
Agents
Training Workflows
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
Multi-step TasksDirectory layout
Tasks
# Multi-step Tasks
Copy Markdown
Splitting a task into sequential steps with per-step instructions, tests, and setup hooks
A multi-step task runs an agent through a sequence of ordered steps against a single, shared environment. Each step has its own instruction, tests, and optional setup hook. Steps share an environment, run sequentially, and produce per-step verifier results that roll up into a single trial-level reward.
Multi-step tasks are helpful when implementing long-horizon tasks with early stopping conditions, testing continual learning methods like memory, and observing an agent's ability to build on its prior work.
Agent skill available
Want your coding agent to guide you through creating a multi-step task? Install the `create-task` skill:

```
npx skills add harbor-framework/harbor --skill create-task
```

## [Directory layout](https://www.harborframework.com/docs/tasks/multi-step#directory-layout)
A multi-step task replaces the single-step `instruction.md`, `tests/`, and `solution/` at the task root with a `steps/` directory containing one sub-directory per step:
The task-level `environment/` directory (with the Dockerfile and shared environment assets) still lives at the task root — the environment is built once and shared across all steps. An optional task-level `tests/` directory provides shared test helpers (and optionally a fallback `test.sh`) that every step can use. It's uploaded to `/tests` for each step's verification; any step-level `tests/` files are uploaded afterward and override same-named files, so the step's own `test.sh` wins when present.
## [Configuration](https://www.harborframework.com/docs/tasks/multi-step#configuration)
Declare steps in `task.toml` using `[[steps]]` array-of-tables entries. Order determines execution order.

```
schema_version = "1.3"

[task]
name = "harbor/example-multi-step"
description = "A three-step example task"

[environment]
build_timeout_sec = 600.0
workdir = "/app"

[[steps]]
name = "scaffold"
# Abort the trial if this step's reward falls below 1.0 —
# later steps depend on a working scaffold.
min_reward = 1.0

[steps.agent]
timeout_sec = 60.0

[steps.verifier]
timeout_sec = 30.0

[[steps]]
name = "implement"
min_reward = 0.5

[steps.agent]
timeout_sec = 120.0

[steps.verifier]
timeout_sec = 30.0

[[steps]]
name = "document"

[steps.agent]
timeout_sec = 60.0

[steps.verifier]
timeout_sec = 30.0
```

### [Step fields](https://www.harborframework.com/docs/tasks/multi-step#step-fields)
Prop
Type
`name?`string
`agent.timeout_sec?`float | null
`agent.user?`string | int | null
`verifier.timeout_sec?`float | null
`verifier.env?`dict[str, str]
`verifier.user?`string | int | null
`verifier.environment_mode?`"shared" | "separate" | null
`verifier.environment?`EnvironmentConfig | null
`min_reward?`float | dict[str, float] | null
`healthcheck.command?`string
`healthcheck.interval_sec?`float
`healthcheck.timeout_sec?`float
`healthcheck.start_period_sec?`float
`healthcheck.start_interval_sec?`float
`healthcheck.retries?`int
`artifacts?`list[str | ArtifactConfig]
The per-step healthcheck runs after the step's `workdir/setup.sh` (if any) completes and before the agent starts. It supplements the top-level environment healthcheck rather than replacing it; a failure aborts the step and the trial.
## [The `workdir/` directory](https://www.harborframework.com/docs/tasks/multi-step#the-workdir-directory)
Anything you place under `steps/{name}/workdir/` is uploaded to the container's WORKDIR before the agent runs for that step. This is the mechanism for staging step-specific files — fixtures, configs, seed data — into the location the agent will work from.
Files persist across steps
The container filesystem is shared across all steps in a trial. Files left in WORKDIR by step N are visible to step N+1 (and to its agent and verifier). This is intentional — it's how multi-step tasks compose work — but means step N's `workdir/` uploads can clobber files that an earlier step's agent created. If that matters, either pick non-colliding filenames or have an earlier step's `setup.sh` preserve/rename state.
### [`workdir/setup.sh` (reserved)](https://www.harborframework.com/docs/tasks/multi-step#workdirsetupsh-reserved)
If `steps/{name}/workdir/setup.sh` exists, it is executed after the step's `workdir/` contents are uploaded and before the agent runs. Use it for per-step prep that the agent shouldn't have to do itself: seeding a database, installing a one-off dependency, resetting file permissions, or running a pre-flight check.
Execution contract:
  * **cwd** is WORKDIR (so relative paths to sibling `workdir/` files work naturally).
  * **User** is the step's agent user (same as the agent will run under).
  * **Non-zero exit** aborts the step: `exception_info` is recorded on the step result, the agent and verifier do not run for this step, and remaining steps are skipped.
  * **The script stays in WORKDIR** after execution — it's uploaded like any other `workdir/` file. If the agent shouldn't see it, have the script remove itself on its last line:



```
#!/usr/bin/env bash
set -euo pipefail

# ... your setup work ...

rm -- "$0"
```

## [Early stopping with `min_reward`](https://www.harborframework.com/docs/tasks/multi-step#early-stopping-with-min_reward)
`min_reward` gates whether remaining steps run based on the current step's verifier result. Two shapes are supported:
  * **Scalar** : `min_reward = 1.0` — gates on `rewards["reward"]` (the 1D convention written by `reward.txt`). Abort if below.
  * **Dict** : `min_reward = { correctness = 0.8, style = 0.5 }` — gates on each declared key. Abort if any key falls below its threshold or is missing from the rewards dict. Use this for multi-dim rewards or when you want to gate on a non-default key.


The trial-level reward is computed from whatever steps did run.
  * Missing reward key or no `verifier_result` at all → treated as `-inf` (aborts).
  * When `config.verifier.disable` is true at the trial level, `min_reward` is ignored (there's nothing to compare against) — a debug log notes the skip.


Exceptions during a step (agent crash, setup failure) abort the trial independently of `min_reward`; the threshold check is in addition to, not in place of, the exception path.
## [Trial-level reward: `multi_step_reward_strategy`](https://www.harborframework.com/docs/tasks/multi-step#trial-level-reward-multi_step_reward_strategy)
After all steps that will run have completed, Harbor derives a single trial-level `verifier_result` from the per-step results. The optional `multi_step_reward_strategy` field at the task root selects how (defaults to `"mean"` when unset):
Prop
Type
`"mean"?`strategy
`"final"?`strategy
`"final"` is the right choice when the last step is an end-to-end verifier whose reward dict already represents the full-task signal.
Early stops and `final`
If a step's `min_reward` triggers an abort, `"final"` uses the aborted step's `verifier_result`, not the step the task author thought of as "final." Keep this in mind when designing thresholds alongside `"final"` strategy.
## [Artifacts per step](https://www.harborframework.com/docs/tasks/multi-step#artifacts-per-step)
Artifacts snapshot paths out of the environment into the trial directory. For a multi-step trial, collection runs **once per step** into `steps/{name}/artifacts/` after that step's verification. The list of paths collected at each pass is the concatenation, in order, of:
  1. Task-level `artifacts` (`task.toml` root)
  2. Trial-level `artifacts` (passed via `TrialConfig`)
  3. Step-level `steps[].artifacts`



```
# Snapshotted after every step (e.g., the script that evolves across steps).
artifacts = ["/app/greet.sh"]

[[steps]]
name = "document"
# Only the document step writes README.md, so only collect it here.
artifacts = ["/app/README.md"]
```

After this trial, `steps/document/artifacts/` contains both `greet.sh` (task-level) and `README.md` (step-level); `steps/scaffold/artifacts/` contains only `greet.sh`.
## [Example](https://www.harborframework.com/docs/tasks/multi-step#example)
A comprehensive worked example lives at [`examples/tasks/hello-multi-step-advanced/`](https://github.com/harbor-framework/harbor/tree/main/examples/tasks/hello-multi-step-advanced) in the Harbor repo. It exercises per-step instructions, per-step `workdir/` uploads, per-step verifier environment variables, per-step healthchecks, `min_reward` early-stopping, and artifact collection per step (including a step-level artifact on the final step).
[Differences from Terminal-Bench Explanation of the differences in the task format from Terminal-Bench to Harbor](https://www.harborframework.com/docs/tasks/task-difference)[Managing Resources Declare CPU, memory, storage, GPU, and TPU requirements in tasks and control how Harbor applies them per environment provider.](https://www.harborframework.com/docs/tasks/managing-resources)
[Directory layout](https://www.harborframework.com/docs/tasks/multi-step#directory-layout)[Configuration](https://www.harborframework.com/docs/tasks/multi-step#configuration)[Step fields](https://www.harborframework.com/docs/tasks/multi-step#step-fields)[The `workdir/` directory](https://www.harborframework.com/docs/tasks/multi-step#the-workdir-directory)[`workdir/setup.sh` (reserved)](https://www.harborframework.com/docs/tasks/multi-step#workdirsetupsh-reserved)[Early stopping with `min_reward`](https://www.harborframework.com/docs/tasks/multi-step#early-stopping-with-min_reward)[Trial-level reward: `multi_step_reward_strategy`](https://www.harborframework.com/docs/tasks/multi-step#trial-level-reward-multi_step_reward_strategy)[Artifacts per step](https://www.harborframework.com/docs/tasks/multi-step#artifacts-per-step)[Example](https://www.harborframework.com/docs/tasks/multi-step#example)
