---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/containerization"
scraped_at: "2026-06-08T07:02:40Z"
---

[](https://pi.dev/)
Copy SVG[Download SVG](https://pi.dev/logo-auto.svg)[Press Kit](https://pi.dev/press-kit)
[Home](https://pi.dev/)[Docs](https://pi.dev/docs/latest)[News](https://pi.dev/news)[Packages](https://pi.dev/packages)[Models](https://pi.dev/models)
[Login](https://pi.dev/enter)
[Home→](https://pi.dev/)[Docs→](https://pi.dev/docs/latest)[News→](https://pi.dev/news)[Packages→](https://pi.dev/packages)[Models→](https://pi.dev/models)
[GitHub](https://github.com/earendil-works/pi/tree/main/packages/coding-agent)[npm](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)[Discord](https://discord.com/invite/3cU7Bz4UPx)
[Earendil Inc.](https://earendil.com "Earendil Inc. website")
Documentation
Guides and references for configuring and extending Pi.
Navigation
On this page
[Choose a pattern](https://pi.dev/docs/latest/containerization#choose-a-pattern)[OpenShell](https://pi.dev/docs/latest/containerization#openshell)[Gondolin](https://pi.dev/docs/latest/containerization#gondolin)[Plain Docker](https://pi.dev/docs/latest/containerization#plain-docker)
Docs
## Start here
[Overview](https://pi.dev/docs/latest)[Quickstart](https://pi.dev/docs/latest/quickstart)[Using Pi](https://pi.dev/docs/latest/usage)[Providers](https://pi.dev/docs/latest/providers)[Containerization](https://pi.dev/docs/latest/containerization)[Settings](https://pi.dev/docs/latest/settings)[Keybindings](https://pi.dev/docs/latest/keybindings)[Sessions](https://pi.dev/docs/latest/sessions)[Compaction](https://pi.dev/docs/latest/compaction)
## Customization
[Extensions](https://pi.dev/docs/latest/extensions)[Skills](https://pi.dev/docs/latest/skills)[Prompt Templates](https://pi.dev/docs/latest/prompt-templates)[Themes](https://pi.dev/docs/latest/themes)[Pi Packages](https://pi.dev/docs/latest/packages)[Custom Models](https://pi.dev/docs/latest/models)[Custom Providers](https://pi.dev/docs/latest/custom-provider)
## Reference
[Session Format](https://pi.dev/docs/latest/session-format)
## Programmatic Usage
[SDK](https://pi.dev/docs/latest/sdk)[RPC Mode](https://pi.dev/docs/latest/rpc)[JSON Event Stream Mode](https://pi.dev/docs/latest/json)[TUI Components](https://pi.dev/docs/latest/tui)
## Platform Setup
[Windows](https://pi.dev/docs/latest/windows)[Termux on Android](https://pi.dev/docs/latest/termux)[tmux](https://pi.dev/docs/latest/tmux)[Terminal Setup](https://pi.dev/docs/latest/terminal-setup)[Shell Aliases](https://pi.dev/docs/latest/shell-aliases)
## Development
[Development](https://pi.dev/docs/latest/development)
Search documentation
`Ctrl K`
  1. [](https://pi.dev/docs/latest/containerization)
  2. [](https://pi.dev/docs/latest/containerization)
  3. [](https://pi.dev/docs/latest/containerization)
  4. [](https://pi.dev/docs/latest/containerization)
  5. [](https://pi.dev/docs/latest/containerization)
  6. [](https://pi.dev/docs/latest/containerization)
  7. [](https://pi.dev/docs/latest/containerization)
  8. [](https://pi.dev/docs/latest/containerization)
  9. [](https://pi.dev/docs/latest/containerization)
  10. [](https://pi.dev/docs/latest/containerization)


* [](https://pi.dev/docs/latest/containerization)
## Docs
## Start here
[Overview](https://pi.dev/docs/latest)[Quickstart](https://pi.dev/docs/latest/quickstart)[Using Pi](https://pi.dev/docs/latest/usage)[Providers](https://pi.dev/docs/latest/providers)[Containerization](https://pi.dev/docs/latest/containerization)[Settings](https://pi.dev/docs/latest/settings)[Keybindings](https://pi.dev/docs/latest/keybindings)[Sessions](https://pi.dev/docs/latest/sessions)[Compaction](https://pi.dev/docs/latest/compaction)
## Customization
[Extensions](https://pi.dev/docs/latest/extensions)[Skills](https://pi.dev/docs/latest/skills)[Prompt Templates](https://pi.dev/docs/latest/prompt-templates)[Themes](https://pi.dev/docs/latest/themes)[Pi Packages](https://pi.dev/docs/latest/packages)[Custom Models](https://pi.dev/docs/latest/models)[Custom Providers](https://pi.dev/docs/latest/custom-provider)
## Reference
[Session Format](https://pi.dev/docs/latest/session-format)
## Programmatic Usage
[SDK](https://pi.dev/docs/latest/sdk)[RPC Mode](https://pi.dev/docs/latest/rpc)[JSON Event Stream Mode](https://pi.dev/docs/latest/json)[TUI Components](https://pi.dev/docs/latest/tui)
## Platform Setup
[Windows](https://pi.dev/docs/latest/windows)[Termux on Android](https://pi.dev/docs/latest/termux)[tmux](https://pi.dev/docs/latest/tmux)[Terminal Setup](https://pi.dev/docs/latest/terminal-setup)[Shell Aliases](https://pi.dev/docs/latest/shell-aliases)
## Development
[Development](https://pi.dev/docs/latest/development)
## On this page
[Choose a pattern](https://pi.dev/docs/latest/containerization#choose-a-pattern)[OpenShell](https://pi.dev/docs/latest/containerization#openshell)[Gondolin](https://pi.dev/docs/latest/containerization#gondolin)[Plain Docker](https://pi.dev/docs/latest/containerization#plain-docker)
On this page
[Choose a pattern](https://pi.dev/docs/latest/containerization#choose-a-pattern)[OpenShell](https://pi.dev/docs/latest/containerization#openshell)[Gondolin](https://pi.dev/docs/latest/containerization#gondolin)[Plain Docker](https://pi.dev/docs/latest/containerization#plain-docker)
# Containerization
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/containerization.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/containerization.md)
Pi runs with all permissions by default, but in some cases, you will want to have more control over what directories Pi can write to and which accesses it has.
There are two general options. You can either
  1. run the whole `pi` process inside an isolated environment, or
  2. run `pi` on the host and route tool execution into an isolated environment.


##  Choose a pattern 
[ Copied ](https://pi.dev/docs/latest/containerization#choose-a-pattern)  
| Pattern  | What is isolated  | Best for  | Notes  |  
| --- | --- | --- | --- |  
| OpenShell  | Whole `pi` process in a policy-controlled sandbox  | Local or remote managed sandbox  | Requires an OpenShell gateway  |  
| Gondolin extension  | Built-in tools and `!` commands  | Local micro-VM isolation while keeping auth on host  | See [`examples/extensions/gondolin/`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/gondolin).  |  
| Plain Docker  | Whole `pi` process in a local container  | Simple local isolation  | Provider API keys enter the container.  |  
Extensions run wherever the `pi` process runs. If you run host `pi` with a tool-routing extension, other custom extension tools still run on the host unless they also delegate their operations.
##  OpenShell 
[ Copied ](https://pi.dev/docs/latest/containerization#openshell)
Use [NVIDIA OpenShell](https://docs.nvidia.com/openshell/about/overview) when you want a policy-controlled sandbox with filesystem, process, network, credential, and inference controls. OpenShell can run sandboxes through a local gateway backed by Docker, Podman, or a VM runtime, or through a remote Kubernetes gateway.
Every sandbox requires an active gateway. Register and select one before creating a sandbox:

```
openshell gateway add <gateway-url> --name <name>
openshell gateway select <name>

```

Launch `pi` inside an OpenShell sandbox:

```
openshell sandbox create --name pi-sandbox --from pi -- pi

```

In this pattern, the whole `pi` process runs inside the sandbox. Built-in tools, `!` commands, and extension tools execute inside the OpenShell boundary.
If the gateway is remote, project files are not bind-mounted from the host, meaning writes in the sandbox are not reflected on your machine. Clone the repository inside the sandbox or use OpenShell file transfer commands:

```
openshell sandbox upload pi-sandbox ./repo /workspace
openshell sandbox download pi-sandbox /workspace/repo ./repo-out

```

OpenShell providers can keep raw model API keys outside the sandbox. When inference routing is configured, code inside the sandbox can call `https://inference.local`, and the gateway injects the configured provider credentials upstream. Configure Pi to use the corresponding OpenAI-compatible or Anthropic-compatible endpoint if you want model traffic to use this route.
##  Gondolin 
[ Copied ](https://pi.dev/docs/latest/containerization#gondolin)
[Gondolin](https://github.com/earendil-works/gondolin) is a local Linux micro-VM. Use the [example extension](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/gondolin) when you want `pi` on the host but all built-in tools routed into the VM.
Setup:

```
cp -R packages/coding-agent/examples/extensions/gondolin ~/.pi/agent/extensions/gondolin
cd ~/.pi/agent/extensions/gondolin
npm install --ignore-scripts

```

Run from the project you want mounted:

```
cd /path/to/project
pi -e ~/.pi/agent/extensions/gondolin

```

The extension mounts the host cwd at `/workspace` in the VM and overrides `read`, `write`, `edit`, `bash`, `grep`, `find`, and `ls`. User `!` commands are routed into the VM, as well. File changes under `/workspace` write through to the host.
Requirements: Node.js >= 23.6.0 for `@earendil-works/gondolin`, plus QEMU (requires installation through your package manager).
##  Plain Docker 
[ Copied ](https://pi.dev/docs/latest/containerization#plain-docker)
Run the whole `pi` process in Docker when you want the simplest local container boundary.
`Dockerfile.pi`:

```
FROM node:24-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends bash ca-certificates git ripgrep \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g --ignore-scripts @earendil-works/pi-coding-agent

WORKDIR /workspace
ENTRYPOINT ["pi"]

```

Build and run:

```
docker build -t pi-sandbox -f Dockerfile.pi .

docker run --rm -it \
  -e ANTHROPIC_API_KEY \
  -v "$PWD:/workspace" \
  -v pi-agent-home:/root/.pi/agent \
  pi-sandbox

```

The `-v "$PWD:/workspace"` mounts your current directory into the container at /workspace such that reads and writes in `/workspace` inside Docker directly affect your host files, like in the Gondolin example.
Use a named volume for `/root/.pi/agent` if you want container-local settings and sessions. Mounting your host `~/.pi/agent` exposes host auth and session files to the container.
[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
