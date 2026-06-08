---
title: "Datasets"
description: "Running a dataset"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/datasets"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"54c4baf6ff8fda74749b02949206efd3\""
---

[harbor](https://www.harborframework.com/)
[harbor](https://www.harborframework.com/)
`⌘``K`
[docs](https://www.harborframework.com/docs)[news](https://www.harborframework.com/news)[](https://hub.harborframework.com)[](https://discord.gg/6xWPKhGDbA)[Motivation](https://www.harborframework.com/docs)[Getting Started](https://www.harborframework.com/docs/getting-started)[Core Concepts](https://www.harborframework.com/docs/core-concepts)[Migrating from Terminal-Bench](https://www.harborframework.com/docs/migration)
Run Jobs
Leaderboard
Tasks
Datasets
[Datasets](https://www.harborframework.com/docs/datasets)[Publishing a dataset](https://www.harborframework.com/docs/datasets/publishing)[Adapters (Agent Guide)](https://www.harborframework.com/docs/datasets/adapters)[Adapters (Human Guide)](https://www.harborframework.com/docs/datasets/adapters-human)[Metrics](https://www.harborframework.com/docs/datasets/metrics)
Sharing
Agents
Training Workflows
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
DatasetsLocal datasets
Datasets
# Datasets
Copy Markdown
Running a dataset
A [Harbor task](https://www.harborframework.com/docs/tasks) is an instruction, sandbox environment, and test script. A dataset is a collection of tasks for evals and training. Datasets sometimes define custom metrics that aggregate rewards across tasks.
Tasks can belong to multiple datasets. You can create datasets to be targeted eval or training groups. For example, you may want to grab 10 tasks from a few different benchmarks to create a composite benchmark.
There are two ways to use datasets:
  1. **Local datasets** : run a local directory of tasks.
  2. **Published datasets** : run a dataset from the [Harbor registry](https://hub.harborframework.com/).


## [Local datasets](https://www.harborframework.com/docs/datasets#local-datasets)
Run a local dataset with `--path` or `-p`:

```
harbor run -p "<path/to/dataset>" -a "<agent>" -m "<model>"
```

## [Published datasets](https://www.harborframework.com/docs/datasets#published-datasets)
Datasets can be published and shared with members of your organization or publicly on the [Harbor registry](https://hub.harborframework.com/). If you publish your dataset privately, all members of your organization can run it. If you publish it publicly, anyone can run it.
Run a published dataset with `--dataset` or `-d`:

```
harbor run -d "my-org/my-dataset@1.0" -a "<agent>" -m "<model>"
```

To learn how to create and publish a dataset, see [Publishing a dataset](https://www.harborframework.com/docs/datasets/publishing).
## [Related docs](https://www.harborframework.com/docs/datasets#related-docs)
  * [Publishing a dataset](https://www.harborframework.com/docs/datasets/publishing)
  * [Custom Metrics](https://www.harborframework.com/docs/datasets/metrics)


[Tutorial In this tutorial, we will walk through creating a simple Harbor task.](https://www.harborframework.com/docs/tasks/task-tutorial)[Publishing a dataset Publish datasets on the Harbor registry to share with others](https://www.harborframework.com/docs/datasets/publishing)
[Local datasets](https://www.harborframework.com/docs/datasets#local-datasets)[Published datasets](https://www.harborframework.com/docs/datasets#published-datasets)[Related docs](https://www.harborframework.com/docs/datasets#related-docs)
