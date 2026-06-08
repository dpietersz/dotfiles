---
title: "Publishing a task"
description: "Publish tasks on the Harbor registry to share with others"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/tasks/publishing"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"669c03f9e60f595acf76fa3ece2323df\""
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
Publishing a taskPrerequisites
Tasks
# Publishing a task
Copy Markdown
Publish tasks on the Harbor registry to share with others
Agent skill available
Want your coding agent to walk you through publishing? Install the `publish` skill:

```
npx skills add harbor-framework/harbor --skill publish
```

If you are new to Harbor, consider reading about [the composition of a Harbor task](https://www.harborframework.com/docs/tasks/index) first.
Tasks developed using Harbor can be easily shared with others inside and outside of your organization using the [Harbor registry](https://hub.harborframework.com/).
You can publish your task publicly or privately.
  * **Public tasks** are visible and usable by everyone.
  * **Private tasks** are visible only to members of the publishing org.


This guide will walk you through the process of publishing one or more tasks to the Harbor registry.
## [Prerequisites](https://www.harborframework.com/docs/tasks/publishing#prerequisites)
### [Login to the Harbor registry](https://www.harborframework.com/docs/tasks/publishing#login-to-the-harbor-registry)
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

### [Update old tasks](https://www.harborframework.com/docs/tasks/publishing#update-old-tasks)
Task identifiers are specified in the `[task]` section of the `task.toml` file as `<org>/<name>`. This enables you to create globally unique identifiers that can be published to the registry.
If your task is missing the `[task]` section (any task created before Mar 30, 2026), you'll need to add it before publishing. You can do this by running:

```
harbor task update "<path/to/task>" --org "<org>"
```

This will add the `[task]` section to the task with the name `<org>/<folder-name>`. For org name, we recommend using your company or benchmark name.
You can update an entire directory of tasks by including the `--scan` flag:

```
harbor task update "<path/to/tasks>" --org "<org>" --scan
```

## [1) Publish the task](https://www.harborframework.com/docs/tasks/publishing#1-publish-the-task)
Use `harbor publish` to publish a task:

```
harbor publish "<path/to/task>"
```

You can publish multiple tasks in one command:

```
harbor publish "<path/to/task-a>" "<path/to/task-b>"
```

You can also publish all tasks in a directory:

```
harbor publish "<path/to/tasks>"
```

## [2) Publish options](https://www.harborframework.com/docs/tasks/publishing#2-publish-options)
  * `-t / --tag`: add one or more tags (repeatable). `latest` is always included.
  * `-c / --concurrency`: control upload concurrency.
  * `--public`: make the task public. Private is the default.


By default, tasks are published with the `latest` tag.
### [Tagging and visibility](https://www.harborframework.com/docs/tasks/publishing#tagging-and-visibility)

```
harbor publish "<path/to/task>" -t benchmark-baseline --public
```

## [3) What publish does](https://www.harborframework.com/docs/tasks/publishing#3-what-publish-does)
  * Computes and uploads the task archive.
  * Resolves task metadata and task digest from `task.toml`.
  * Registers the version in the Harbor registry.


The output includes a registry package page link.
## [Sharing](https://www.harborframework.com/docs/tasks/publishing#sharing)
If you published it publicly, anyone can use it. If you published it privately, only members of the publishing org can use it. You can change visibility later using `harbor task visibility` or through the UI on [the registry website](https://hub.harborframework.com/).
Publishing visibility and access is documented in [Sharing](https://www.harborframework.com/docs/sharing).
[Task Structure Creating and running tasks for agentic environments](https://www.harborframework.com/docs/tasks)[Differences from Terminal-Bench Explanation of the differences in the task format from Terminal-Bench to Harbor](https://www.harborframework.com/docs/tasks/task-difference)
[Prerequisites](https://www.harborframework.com/docs/tasks/publishing#prerequisites)[Login to the Harbor registry](https://www.harborframework.com/docs/tasks/publishing#login-to-the-harbor-registry)[Update old tasks](https://www.harborframework.com/docs/tasks/publishing#update-old-tasks)[1) Publish the task](https://www.harborframework.com/docs/tasks/publishing#1-publish-the-task)[2) Publish options](https://www.harborframework.com/docs/tasks/publishing#2-publish-options)[Tagging and visibility](https://www.harborframework.com/docs/tasks/publishing#tagging-and-visibility)[3) What publish does](https://www.harborframework.com/docs/tasks/publishing#3-what-publish-does)[Sharing](https://www.harborframework.com/docs/tasks/publishing#sharing)
