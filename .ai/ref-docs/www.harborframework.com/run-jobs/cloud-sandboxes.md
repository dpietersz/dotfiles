---
title: "Sandboxes"
description: "Horizontal scaling using cloud sandboxes"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/run-jobs/cloud-sandboxes"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"58cb6449358052067f045ab077941909\""
---

[harbor](https://www.harborframework.com/)
[harbor](https://www.harborframework.com/)
`⌘``K`
[docs](https://www.harborframework.com/docs)[news](https://www.harborframework.com/news)[](https://hub.harborframework.com)[](https://discord.gg/6xWPKhGDbA)[Motivation](https://www.harborframework.com/docs)[Getting Started](https://www.harborframework.com/docs/getting-started)[Core Concepts](https://www.harborframework.com/docs/core-concepts)[Migrating from Terminal-Bench](https://www.harborframework.com/docs/migration)
Run Jobs
[Run Jobs](https://www.harborframework.com/docs/run-jobs)[Evals](https://www.harborframework.com/docs/run-jobs/run-evals)[Artifact Collection](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)[Sandboxes](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes)
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
SandboxesUsing a cloud sandbox provider
Run Jobs
# Sandboxes
Copy Markdown
Horizontal scaling using cloud sandboxes
Containerized agentic tasks can be slow when performing rollouts. This is due to container startup and teardown overhead, waiting for LLM API calls, and waiting for command execution. Horizontal scaling becomes the only viable way to accelerate experimentation, so we recommend using a cloud sandbox provider like Daytona.
Using a cloud sandbox provider shifts command execution to the cloud, making trials I/O bounded rather than compute bounded. This means you can typically parallelize far above your CPU count.
## [Using a cloud sandbox provider](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes#using-a-cloud-sandbox-provider)
There are many cloud sandbox providers to choose from. Good options are [Daytona](https://www.daytona.io/), [Modal](https://modal.com/), [E2B](https://e2b.dev/), [Runloop](https://runloop.ai/), [Tensorlake](https://docs.tensorlake.ai/sandboxes/harbor), [Islo](https://islo.dev/rl), [CoreWeave Sandboxes](https://www.coreweave.com/products/coreweave-sandboxes), and [W&B Sandboxes](https://docs.wandb.ai/sandboxes).

```
harbor run -d "<org/name>" \
  -m "<model>" \
  -a "<agent>" \
  -e daytona \
  -n "<n-parallel-trials>"
```

We run up to 100 trials in parallel on a MacBook Pro with 14 cores.
Removing internet restrictions on Daytona
By default, Daytona accounts have internet access restrictions that can prevent many benchmarks from running correctly. Use the coupon code **HARBOR_NETWORK** on your Daytona account to remove these restrictions.
## [Multi-container deployments](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes#multi-container-deployments)
Daytona and Islo support multi-container deployments. To use multi-container tasks, include an `environment/docker-compose.yaml` file in your task definition.
Other cloud sandbox providers (Modal, E2B, Runloop, Tensorlake, CoreWeave Sandboxes, and W&B Sandboxes) do not currently support multi-container environments. For those providers, you will need to use single-container tasks or switch to Daytona, Islo or the local Docker environment.
[Artifact Collection Collecting files from the sandbox after a trial completes](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)[Submit to a leaderboard Upload evaluation jobs to Harbor Hub and submit them to an official leaderboard](https://www.harborframework.com/docs/leaderboard/submit)
[Using a cloud sandbox provider](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes#using-a-cloud-sandbox-provider)[Multi-container deployments](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes#multi-container-deployments)
