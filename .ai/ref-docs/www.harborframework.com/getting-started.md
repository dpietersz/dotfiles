---
title: "Getting Started"
description: "Installing the package and running your first eval"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/getting-started"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"99a7cd87ba5a0346310b2853ab2b0f9c\""
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
Getting StartedInstallation
# Getting Started
Copy Markdown
Installing the package and running your first eval
Harbor is a framework for evals, post-training, and prompt optimization using agentic environments.
## [Installation](https://www.harborframework.com/docs/getting-started#installation)

```
uv tool install harbor
```

## [Getting started](https://www.harborframework.com/docs/getting-started#getting-started)
Run the following command to see a list of all available commands:

```
harbor --help
```

## [Running an eval](https://www.harborframework.com/docs/getting-started#running-an-eval)
The primary command is `harbor run`, which is used to run evals or generate rollouts.

```
harbor run --help
```

To view registered datasets, run

```
harbor dataset list
```

### [Running a registered dataset](https://www.harborframework.com/docs/getting-started#running-a-registered-dataset)
To evaluate an agent and model one of these datasets, you can use the following command:

```
harbor run -d "<org/name>" -m "<model>" -a "<agent>"
```

Harbor will automatically download registered datasets.
### [Running a local dataset](https://www.harborframework.com/docs/getting-started#running-a-local-dataset)
Local datasets (directories of tasks) can also be run using

```
harbor run -p "<path/to/dataset>" -m "<model>" -a "<agent>"
```

### [Running a cloud sandbox](https://www.harborframework.com/docs/getting-started#running-a-cloud-sandbox)
To run using a cloud sandbox provider like Daytona, you can use the following command:

```
harbor run -d "<org/name>" -m "<model>" -a "<agent>" --env "daytona" -n 32
```

If you run a cloud sandbox using an API model, trials become I/O bounded rather than compute bounded, which means you can typically parallelize far above your CPU count (the example command above runs 32 trials concurrently).
Sandboxed agent evaluations are often slow, because they can require many turns to complete and each command requires time to execute. Horizontal scaling becomes the only viable way to accelerate experimentation, so we recommend using a cloud sandbox provider like Daytona.
[Motivation Why we built Harbor](https://www.harborframework.com/docs)[Core Concepts Core concepts and terminology in Harbor](https://www.harborframework.com/docs/core-concepts)
[Installation](https://www.harborframework.com/docs/getting-started#installation)[Getting started](https://www.harborframework.com/docs/getting-started#getting-started)[Running an eval](https://www.harborframework.com/docs/getting-started#running-an-eval)[Running a registered dataset](https://www.harborframework.com/docs/getting-started#running-a-registered-dataset)[Running a local dataset](https://www.harborframework.com/docs/getting-started#running-a-local-dataset)[Running a cloud sandbox](https://www.harborframework.com/docs/getting-started#running-a-cloud-sandbox)
