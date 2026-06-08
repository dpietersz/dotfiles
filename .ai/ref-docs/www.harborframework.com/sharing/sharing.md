---
title: "Tasks and Datasets"
description: "Share published Harbor tasks and datasets"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/sharing/sharing"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"bb5d2fe3145e8559102ab04000e72a26\""
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
[Tasks and Datasets](https://www.harborframework.com/docs/sharing/sharing)[Jobs](https://www.harborframework.com/docs/sharing/jobs)
Agents
Training Workflows
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
Tasks and DatasetsPublish
Sharing
# Tasks and Datasets
Copy Markdown
Share published Harbor tasks and datasets
Tasks and datasets are shared as registry packages: `org/name@tag`.
## [Publish](https://www.harborframework.com/docs/sharing/sharing#publish)
Publish local tasks and dataset manifests before sharing them:
  * [Publishing tasks](https://www.harborframework.com/docs/tasks/publishing)
  * [Publishing a dataset](https://www.harborframework.com/docs/datasets/publishing)


## [Visibility](https://www.harborframework.com/docs/sharing/sharing#visibility)
Use `--public` or `--private` when publishing. Private packages are visible to the publishing org. Public packages are visible to everyone.
Update visibility later:

```
harbor task visibility "my-org/my-task" --public
harbor dataset visibility "my-org/my-dataset" --private
```

## [Use a shared package](https://www.harborframework.com/docs/sharing/sharing#use-a-shared-package)
Share a package by reference in commands that consume package entries:

```
harbor run -d "my-org/my-dataset@v1.0" -m "<model>" -a "<agent>"
```

Download a task or dataset locally:

```
harbor download "my-org/my-task@latest"
harbor download "my-org/my-dataset@latest"
```

By default, `harbor download` exports to the current directory. Use `--output-dir <path>` to choose a location, or `--cache` to store packages under `~/.cache/harbor/tasks`.
## [Browse](https://www.harborframework.com/docs/sharing/sharing#browse)
  * [Registry tasks](https://hub.harborframework.com/tasks)
  * [Registry datasets](https://hub.harborframework.com/datasets)


[Metrics Built-in and custom metrics for Harbor dataset evaluation](https://www.harborframework.com/docs/datasets/metrics)[Jobs Share uploaded Harbor jobs and trials](https://www.harborframework.com/docs/sharing/jobs)
[Publish](https://www.harborframework.com/docs/sharing/sharing#publish)[Visibility](https://www.harborframework.com/docs/sharing/sharing#visibility)[Use a shared package](https://www.harborframework.com/docs/sharing/sharing#use-a-shared-package)[Browse](https://www.harborframework.com/docs/sharing/sharing#browse)
