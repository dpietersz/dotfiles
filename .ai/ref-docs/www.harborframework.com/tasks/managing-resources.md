---
title: "Managing Resources"
description: "Declare CPU, memory, storage, GPU, and TPU requirements in tasks and control how Harbor applies them per environment provider."
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/tasks/managing-resources"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"be0bc79ef0f6b6d0f79f50e9fad10ef3\""
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
Managing ResourcesTask fields
Tasks
# Managing Resources
Copy Markdown
Declare CPU, memory, storage, GPU, and TPU requirements in tasks and control how Harbor applies them per environment provider.
Tasks declare resources in `task.toml`. Harbor applies CPU and memory using **enforcement policies** ; storage, GPU, and TPU requests are passed through when the provider supports them.
## [Task fields](https://www.harborframework.com/docs/tasks/managing-resources#task-fields)

```
[environment]
cpus = 2
memory_mb = 4096
storage_mb = 10240
gpus = 1
gpu_types = ["H100", "A100"]

[environment.tpu]   # optional; GKE only
type = "v6e"
topology = "2x4"
```
  
| Field  | Description  |  
| --- | --- |  
| `cpus`  | CPU count  |  
| `memory_mb`  | RAM in MB  |  
| `storage_mb`  | Ephemeral disk in MB  |  
| `gpus`  | GPU count  |  
| `gpu_types`  | Acceptable GPU types (optional)  |  
| `tpu.type`  | TPU accelerator type — alias (`v6e`, `trillium`, `v4`) or GKE label (`tpu-v6e-slice`)  |  
| `tpu.topology`  | TPU topology as `NxM` or `NxMxK` (required; chip count = product of dimensions)  |  
All fields are optional. Omitted fields use the provider's default sizing — Harbor does not inject defaults.
Separate verifier sandboxes can set their own values under `[verifier.environment]`. See [Separate verifier environments](https://www.harborframework.com/news/separate-verifier-sandboxes).
## [Enforcement policies](https://www.harborframework.com/docs/tasks/managing-resources#enforcement-policies)
CPU and memory each get an independent policy. Set them via `--cpus` / `--memory`, or `cpu_enforcement_policy` / `memory_enforcement_policy` in job or trial config.  
| Policy  | Meaning  | Requires `cpus` / `memory_mb`?  |  
| --- | --- | --- |  
| `auto`  | Use the provider's default mode  | No  |  
| `limit`  | Hard ceiling only  | Yes  |  
| `request`  | Reservation only, no ceiling  | Yes  |  
| `guarantee`  | Both reservation and hard ceiling  | Yes  |  
| `ignore`  | Do not pass the value to the provider  | No  |  

```
harbor run -p "<path/to/dataset>" -m "<model>" -a "<agent>" \
  -e docker --cpus limit --memory guarantee
```


```
environment:
  type: docker
  cpu_enforcement_policy: limit
  memory_enforcement_policy: auto
```

Use `--override-cpus`, `--override-memory-mb`, `--override-storage-mb`, `--override-gpus`, and `--override-tpu` (e.g. `v6e=2x4`) to replace task values at run time.
## [Provider support](https://www.harborframework.com/docs/tasks/managing-resources#provider-support)
Harbor validates policies at job start. Unsupported combinations fail before trials run. `limit` and `guarantee` require limit support; `request` and `guarantee` require request support.
## [Storage, GPUs, and TPUs](https://www.harborframework.com/docs/tasks/managing-resources#storage-gpus-and-tpus)
No enforcement policies. Harbor passes declared values to providers that support them:  
| Resource  | Providers  |  
| --- | --- |  
| Storage  | Daytona, Islo, Runloop, GKE, …  |  
| GPUs  | Modal, GKE  |  
| TPUs  | GKE  |  
## [Validation](https://www.harborframework.com/docs/tasks/managing-resources#validation)  
| Check  | When  |  
| --- | --- |  
| Policy vs provider  | Job creation  |  
| Missing value for non-`auto`/`ignore` policy  | Environment start  |  
| GPU / TPU / internet requirements  | Environment start  |  
| GPU and TPU both set (GKE)  | Environment start  |  
[Multi-step Tasks Splitting a task into sequential steps with per-step instructions, tests, and setup hooks](https://www.harborframework.com/docs/tasks/multi-step)[Windows tasks Create and run Harbor tasks inside Windows containers with Docker Desktop in Windows container mode.](https://www.harborframework.com/docs/tasks/windows-container-support)
[Task fields](https://www.harborframework.com/docs/tasks/managing-resources#task-fields)[Enforcement policies](https://www.harborframework.com/docs/tasks/managing-resources#enforcement-policies)[Provider support](https://www.harborframework.com/docs/tasks/managing-resources#provider-support)[Storage, GPUs, and TPUs](https://www.harborframework.com/docs/tasks/managing-resources#storage-gpus-and-tpus)[Validation](https://www.harborframework.com/docs/tasks/managing-resources#validation)
