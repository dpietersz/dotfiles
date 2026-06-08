---
title: "Migrating from Terminal"
description: "Migrating from Terminal-Bench to Harbor"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/migration"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"34b6b94566aff30b4723d401a2193471\""
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
Migrating from Terminal-BenchTerminal-Bench Task Format
# Migrating from Terminal-Bench
Copy Markdown
Migrating from Terminal-Bench to Harbor
Harbor is created by the same team as Terminal-Bench. The Harbor task format is an iteration on the format proposed by Terminal-Bench and addresses some of the limitations of the Terminal-Bench format.
The difference in file trees is shown below:
A detailed description of the differences between the two task formats is available [here](https://www.harborframework.com/docs/tasks/task-difference).
### [Terminal-Bench Task Format](https://www.harborframework.com/docs/migration#terminal-bench-task-format)
### [Harbor Task Format](https://www.harborframework.com/docs/migration#harbor-task-format)
## [Migration Guide](https://www.harborframework.com/docs/migration#migration-guide)
Harbor provides a mapper from the Terminal-Bench task format to the Harbor task format. Note that this mapper is not perfect, and some particularly custom tasks may require manual migration.

```
harbor task migrate -i "<path/to/terminal-bench/task(s)>" -o "<path/to/harbor/task(s)>"
```

To understand the differences between the two task formats, see the [differences](https://www.harborframework.com/docs/tasks/task-difference) page.
> **Linux by default.** Tasks migrated from Terminal-Bench remain Linux-targeted unless you explicitly set `[environment].os = "windows"` in `task.toml`. The new `os` field defaults to `"linux"`, so the migration mapper requires no changes for existing tasks. See [Windows tasks](https://www.harborframework.com/docs/tasks/windows-container-support) for Windows-targeted tasks.
[Core Concepts Core concepts and terminology in Harbor](https://www.harborframework.com/docs/core-concepts)[Run Jobs Run evaluations, scale execution, and inspect outputs](https://www.harborframework.com/docs/run-jobs)
[Terminal-Bench Task Format](https://www.harborframework.com/docs/migration#terminal-bench-task-format)[Harbor Task Format](https://www.harborframework.com/docs/migration#harbor-task-format)[Migration Guide](https://www.harborframework.com/docs/migration#migration-guide)
