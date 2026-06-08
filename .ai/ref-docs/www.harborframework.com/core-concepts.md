---
title: "Core Concepts"
description: "Core concepts and terminology in Harbor"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/core-concepts"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"31700ba02fa78571b11af3f35827ad8a\""
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
Contributing
[](https://github.com/laude-institute/harbor)
Core ConceptsTask
# Core Concepts
Copy Markdown
Core concepts and terminology in Harbor
Harbor has the following core concepts:
## [Task](https://www.harborframework.com/docs/core-concepts#task)
A task is a single instruction, container environment, and test script. Tasks are used to evaluate agents and models. A task is implemented as a directory of files in the [Harbor task format](https://www.harborframework.com/docs/tasks).
## [Dataset](https://www.harborframework.com/docs/core-concepts#dataset)
A [dataset](https://www.harborframework.com/docs/datasets) is a collection of tasks. Datasets are used to evaluate agents and models. Usually, a dataset corresponds to a benchmark (e.g. Terminal-Bench, SWE-Bench Verified, etc.). Datasets can optionally be distributed via the Harbor registry.
## [Agent](https://www.harborframework.com/docs/core-concepts#agent)
An [agent](https://www.harborframework.com/docs/agents) is a program that completes tasks. Agents are defined by implementing the `BaseAgent` or `BaseInstalledAgent` interfaces. Tasks can configure which OS user the agent runs as via the `agent.user` field in `task.toml`.
## [Container environment](https://www.harborframework.com/docs/core-concepts#container-environment)
Environments in Harbor are containers, typically defined as Docker images using a `Dockerfile`. The `BaseEnvironment` interface provides a unified interface for interacting with environments. Many cloud container runtimes are already supported out of the box, including [Daytona](https://www.daytona.io/), [Modal](https://modal.com/), [E2B](https://e2b.dev/), [Runloop](https://runloop.ai/) and [Tensorlake](https://docs.tensorlake.ai/sandboxes/harbor). Other container runtimes can be supported by implementing the `BaseEnvironment` interface.
The target container OS is declared per task via `[environment].os` in `task.toml` (`"linux"` by default; set to `"windows"` for Windows containers — see [Windows tasks](https://www.harborframework.com/docs/tasks/windows-container-support)).
## [Trial](https://www.harborframework.com/docs/core-concepts#trial)
A trial is an agent's attempt at completing a task. Trials can be configured using the `TrialConfig` class.
Essentially, a trial is a rollout that produces a reward.
## [Job](https://www.harborframework.com/docs/core-concepts#job)
A job is a collection of trials. Jobs are used to evaluate agents and models. A job can consist of multiple datasets, agents, tasks, and models. Jobs can be configured using the `JobConfig` class.
Once you define your `job.yaml` or `job.json` file, you can run it using the following command:

```
harbor run -c "<path/to/job.yaml>"
```

Alternatively, you can create an adhoc job by configuring the `harbor run` flags.
Under the hood, a job generates a bunch of `TrialConfig` objects and runs them in parallel.
[Getting Started Installing the package and running your first eval](https://www.harborframework.com/docs/getting-started)[Migrating from Terminal-Bench Migrating from Terminal-Bench to Harbor](https://www.harborframework.com/docs/migration)
[Task](https://www.harborframework.com/docs/core-concepts#task)[Dataset](https://www.harborframework.com/docs/core-concepts#dataset)[Agent](https://www.harborframework.com/docs/core-concepts#agent)[Container environment](https://www.harborframework.com/docs/core-concepts#container-environment)[Trial](https://www.harborframework.com/docs/core-concepts#trial)[Job](https://www.harborframework.com/docs/core-concepts#job)
