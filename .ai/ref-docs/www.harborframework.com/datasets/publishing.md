---
title: "Publishing a dataset"
description: "Publish datasets on the Harbor registry to share with others"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/datasets/publishing"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"be52f1764400d19bd07d0458b38a512f\""
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
Publishing a datasetPrerequisites
Datasets
# Publishing a dataset
Copy Markdown
Publish datasets on the Harbor registry to share with others
Agent skill available
Want your coding agent to walk you through publishing? Install the `publish` skill:

```
npx skills add harbor-framework/harbor --skill publish
```

If you are new to Harbor, consider reading about [the composition of a Harbor dataset](https://www.harborframework.com/docs/datasets/index) first.
Benchmarks and datasets developed using Harbor can be easily shared with others inside and outside of your organization using the [Harbor registry](https://hub.harborframework.com/).
You can publish your dataset publicly or privately.
  * **Public datasets** are visible and usable by everyone. This is a great way to increase the adoption of your dataset or benchmark.
  * **Private datasets** are visible only to members of the publishing org.


You can run a published dataset with `--dataset` or `-d`:

```
harbor run -d "<org>/<dataset>" -a "<agent>" -m "<model>"
```

This guide will walk you through the process of publishing a dataset to the Harbor registry.
## [Prerequisites](https://www.harborframework.com/docs/datasets/publishing#prerequisites)
### [Login to the Harbor registry](https://www.harborframework.com/docs/datasets/publishing#login-to-the-harbor-registry)
Before publishing, run:

```
harbor auth login
```

This opens a GitHub sign-in flow and creates your Harbor account. New accounts get an org using your GitHub username by default. You can publish to orgs you are an owner of. If you publish to an org that does not exist, it will be created for you.
You must be signed in to publish.
You can verify you are signed in by running:

```
harbor auth status
```

### [Update old tasks](https://www.harborframework.com/docs/datasets/publishing#update-old-tasks)
Task identifiers are specified in the `[task]` section of the `task.toml` file as `<org>/<name>`. This enables you to create globally unique identifiers that can be published to the registry.
If your tasks are missing the `[task]` section (any task created before Mar 30, 2026), you'll need to add it before publishing them or including them in a dataset. You can do this by running:

```
harbor task update "<path/to/task>" --org "<org>"
```

This will add the `[task]` section to the task with the name `<org>/<folder-name>`. For org name, we recommend using your company or benchmark name.
You can update an entire directory of tasks by including the `--scan` flag:

```
harbor task update "<path/to/tasks>" --org "<org>" --scan
```

## [1) Initialize a dataset manifest](https://www.harborframework.com/docs/datasets/publishing#1-initialize-a-dataset-manifest)
A dataset is a collection of versioned tasks defined in a `dataset.toml` manifest.
Task pointers look like this:

```
[[tasks]]
name = "<org>/<name>"
digest = "sha256:<hash>"
```

The digest is the SHA256 hash of the task archive.
To initialize the dataset manifest run:

```
harbor dataset init "<org>/<dataset>" \
  --description "A short description" \
  --author "Your Name <your@email.com>"
```

Datasets can optionally include a metric script to define how rewards are aggregated across tasks.
If you need a custom metric script include the `--with-metric` flag:

```
harbor dataset init "<org>/<dataset>" --with-metric
```

This creates:

```
<dataset>/
├── dataset.toml
└── metric.py            # only if --with-metric
```

If you initialize a dataset in a directory with pre-existing tasks, the tasks will be auto-added to the dataset manifest. If you initialize a task in the same directory as `dataset.toml`, the task will be auto-added to the dataset manifest.
For example:

```
my-dataset/
├── dataset.toml
├── task-a/
├── task-b/
└── metric.py            # only if --with-metric
```

will create a `dataset.toml` with the tasks `task-a` and `task-b` auto-added.
## [2) Add tasks and files](https://www.harborframework.com/docs/datasets/publishing#2-add-tasks-and-files)
Use `harbor add` to explicitly add local or published tasks.

```
cd "<path/to/dataset>"
```

### [Add local tasks](https://www.harborframework.com/docs/datasets/publishing#add-local-tasks)

```
harbor add "<path/to/task-a>" "<path/to/task-b>"
```

You can also add tasks from a local `dataset.toml` file by running:

```
harbor add "<path/to/dataset.toml>"
```

### [Add registered tasks or datasets](https://www.harborframework.com/docs/datasets/publishing#add-registered-tasks-or-datasets)

```
harbor add org/name-of-task
```

By default, `harbor add` will add the latest version of a task. You can also add a specific version using `"<org>/<name>@<tag>"`, `"<org>/<name>@<revision>"`, or `"<org>/<name>@sha256:<hash>"`.
You can also add all of the tasks from a published dataset by running:

```
harbor add org/name-of-dataset
```

### [Add all tasks from a local folder](https://www.harborframework.com/docs/datasets/publishing#add-all-tasks-from-a-local-folder)
Include the `--scan` flag to add all tasks from a local folder.

```
harbor add "<path/to/candidate-tasks>" --scan
```

### [Optional metric file](https://www.harborframework.com/docs/datasets/publishing#optional-metric-file)
If `dataset.toml` does not include `metric.py`:

```
harbor add metric.py
```

`metric.py` must be added by filename and must be in the same directory as `dataset.toml`.
### [Removing tasks](https://www.harborframework.com/docs/datasets/publishing#removing-tasks)
You can remove tasks from a dataset by running:

```
harbor remove "<org>/<name-of-task>"
```

`harbor remove` accepts the same arguments as `harbor add`.
## [3) Sync task and file digests (when needed)](https://www.harborframework.com/docs/datasets/publishing#3-sync-task-and-file-digests-when-needed)
A `dataset.toml` references tasks and metrics by their digest. When you are developing a dataset, tasks and metrics are subject to change.
When you publish a dataset, it automatically refreshes the digests of the tasks and metrics in the same directory as `dataset.toml`.
If you need to refresh before publishing, you can use:

```
harbor sync
```

To also upgrade remote tasks to their latest published version, run:

```
harbor sync --upgrade
```

`harbor add` updates tasks if they are already present and can be used to refresh the digest for local tasks stored outside of the dataset folder.
## [4) Publish the dataset](https://www.harborframework.com/docs/datasets/publishing#4-publish-the-dataset)
Use `harbor publish` to publish a dataset:

```
harbor publish "<path/to/dataset>"
```

By default, `harbor publish` will also publish any tasks in the dataset directory.
### [Publish options](https://www.harborframework.com/docs/datasets/publishing#publish-options)
  * `-t / --tag`: add one or more tags (repeatable). `latest` is always included.
  * `-c / --concurrency`: control upload concurrency.
  * `--no-tasks`: don't publish the tasks in the dataset directory.
  * `--public`: make the dataset public. Private is the default.


By default, datasets are published with the `latest` tag.
`harbor publish` refreshes the digests of local tasks in the dataset directory during upload. Use `harbor sync` when you need to refresh remote tasks before publishing. Re-add local tasks outside of the dataset directory to refresh their digests.
### [Tagging and visibility](https://www.harborframework.com/docs/datasets/publishing#tagging-and-visibility)

```
harbor publish "<path/to/dataset>" -t v1.0 --public
```


```
harbor publish "<path/to/dataset>" --no-tasks
```

## [5) Run your published dataset](https://www.harborframework.com/docs/datasets/publishing#5-run-your-published-dataset)
After publishing, evaluate with:

```
harbor run -d "my-org/my-dataset@v1.0" -a "<agent>" -m "<model>"
```

## [Sharing](https://www.harborframework.com/docs/datasets/publishing#sharing)
If you published it publicly, anyone can run it. If you published it privately, only members of the publishing org can run it. You can toggle visibility at any time using `harbor dataset visibility` or through the UI on [the registry website](https://hub.harborframework.com/).
Publishing visibility and access is documented in [Sharing](https://www.harborframework.com/docs/sharing).
## [Related docs](https://www.harborframework.com/docs/datasets/publishing#related-docs)
  * [Datasets](https://www.harborframework.com/docs/datasets)
  * [Custom Metrics](https://www.harborframework.com/docs/datasets/metrics)


[Datasets Running a dataset](https://www.harborframework.com/docs/datasets)[Adapters (Agent Guide) Comprehensive adapter spec for AI agents building Harbor adapters. Contains full schemas, directory structures, commands, and validation criteria.](https://www.harborframework.com/docs/datasets/adapters)
[Prerequisites](https://www.harborframework.com/docs/datasets/publishing#prerequisites)[Login to the Harbor registry](https://www.harborframework.com/docs/datasets/publishing#login-to-the-harbor-registry)[Update old tasks](https://www.harborframework.com/docs/datasets/publishing#update-old-tasks)[1) Initialize a dataset manifest](https://www.harborframework.com/docs/datasets/publishing#1-initialize-a-dataset-manifest)[2) Add tasks and files](https://www.harborframework.com/docs/datasets/publishing#2-add-tasks-and-files)[Add local tasks](https://www.harborframework.com/docs/datasets/publishing#add-local-tasks)[Add registered tasks or datasets](https://www.harborframework.com/docs/datasets/publishing#add-registered-tasks-or-datasets)[Add all tasks from a local folder](https://www.harborframework.com/docs/datasets/publishing#add-all-tasks-from-a-local-folder)[Optional metric file](https://www.harborframework.com/docs/datasets/publishing#optional-metric-file)[Removing tasks](https://www.harborframework.com/docs/datasets/publishing#removing-tasks)[3) Sync task and file digests (when needed)](https://www.harborframework.com/docs/datasets/publishing#3-sync-task-and-file-digests-when-needed)[4) Publish the dataset](https://www.harborframework.com/docs/datasets/publishing#4-publish-the-dataset)[Publish options](https://www.harborframework.com/docs/datasets/publishing#publish-options)[Tagging and visibility](https://www.harborframework.com/docs/datasets/publishing#tagging-and-visibility)[5) Run your published dataset](https://www.harborframework.com/docs/datasets/publishing#5-run-your-published-dataset)[Sharing](https://www.harborframework.com/docs/datasets/publishing#sharing)[Related docs](https://www.harborframework.com/docs/datasets/publishing#related-docs)
