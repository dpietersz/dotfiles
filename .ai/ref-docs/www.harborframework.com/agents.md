---
title: "Agents"
description: "Using popular agents and integrating your own"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/agents"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"8adf54b399dd4d41a6e09479780298cf\""
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
[Agents](https://www.harborframework.com/docs/agents)[Terminus-2](https://www.harborframework.com/docs/agents/terminus-2)[Agent Trajectory Format (ATIF)](https://www.harborframework.com/docs/agents/trajectory-format)
Training Workflows
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
AgentsExisting agents
Agents
# Agents
Copy Markdown
Using popular agents and integrating your own
How to evaluate on existing agents and integrate your own. This is particularly useful for benchmarking your agent, optimizing its prompts, using it as a scaffold for RL, or using it to generate SFT datasets.
## [Existing agents](https://www.harborframework.com/docs/agents#existing-agents)
Harbor comes with most popular agents pre-integrated. You can run the following command and reference the `--agent` flag to see a list of all available agents:

```
harbor run --help
```

Right now, Harbor includes Terminus-2, Claude Code, Copilot CLI, Codex CLI, Gemini CLI, OpenHands, Mini-SWE-Agent, and more.
## [Integrating your own agent](https://www.harborframework.com/docs/agents#integrating-your-own-agent)
Harbor supports integrating your own agent without having to modify the Harbor source code.
There are two types of agents:
  1. **External agents** which interface with the environment through the `BaseEnvironment` interface, typically by executing bash commands via the `exec` method.
  2. **Installed agents** which are agents that are installed directly into the container environment and are executed in headless mode. This is how most agents are integrated and comes with the advantage of bringing custom tools.


### [External agents](https://www.harborframework.com/docs/agents#external-agents)
To build an external agent, you need to implement the `BaseAgent` interface which involved defining the following methods:
my_external_agent.py

```
from harbor.agents.base import BaseAgent

class MyExternalAgent(BaseAgent):
    @staticmethod
    def name() -> str:
        """The name of the agent."""
        pass

    def version(self) -> str | None:
        """The version of the agent."""
        pass

    async def setup(self, environment: BaseEnvironment) -> None:
        """
        Run commands to setup the agent & its tools.
        """
        pass

    async def run(
        self,
        instruction: str,
        environment: BaseEnvironment,
        context: AgentContext,
    ) -> None:
        """
        Runs the agent in the environment. Be sure to populate the context with the
        results of the agent execution. Ideally, populate the context as the agent
        executes in case of a timeout or other error.

        Args:
            instruction: The task instruction.
            environment: The environment in which to complete the task.
            context: The context to populate with the results of the agent execution.
        """
        pass
```

### [Installed agents](https://www.harborframework.com/docs/agents#installed-agents)
To build an installed agent, you need to implement the `BaseInstalledAgent` interface which involves defining the following methods:
my_installed_agent.py

```
from harbor.agents.installed.base import BaseInstalledAgent, with_prompt_template
from harbor.environments.base import BaseEnvironment
from harbor.models.agent.context import AgentContext

class MyInstalledAgent(BaseInstalledAgent):
    async def install(self, environment: BaseEnvironment) -> None:
        """
        Install the agent in the environment. Use exec_as_root for system
        packages and exec_as_agent for user-level installs.
        """
        await self.exec_as_root(environment, command="apt-get update && apt-get install -y curl")
        await self.exec_as_agent(environment, command="pip install my-agent")

    @with_prompt_template
    async def run(
        self, instruction: str, environment: BaseEnvironment, context: AgentContext
    ) -> None:
        """
        Run the agent in the environment. The @with_prompt_template decorator
        automatically applies prompt template rendering to the instruction.
        Use exec_as_agent to execute commands as the configured agent user.
        """
        await self.exec_as_agent(
            environment,
            command=f"my-agent run {shlex.quote(instruction)}",
        )

    def populate_context_post_run(self, context: AgentContext) -> None:
        """
        Populate the context with the results of the agent execution.
        Called after run() completes. Typically involves parsing trajectory files.
        """
        pass
```

The `exec_as_root` and `exec_as_agent` helpers handle logging, environment variable merging, `set -o pipefail`, and error handling automatically. `exec_as_agent` runs commands as the task's configured agent user (see [`agent.user` in task.toml](https://www.harborframework.com/docs/tasks#configuration--metadata)).
### [Running a custom agent](https://www.harborframework.com/docs/agents#running-a-custom-agent)
To run a custom agent, you can use the following command:

```
harbor run -d "<dataset@version>" --agent-import-path path.to.agent:SomeAgent
```

[Jobs Share uploaded Harbor jobs and trials](https://www.harborframework.com/docs/sharing/jobs)[Terminus-2 Harbor's high-performance reference agent implementation](https://www.harborframework.com/docs/agents/terminus-2)
[Existing agents](https://www.harborframework.com/docs/agents#existing-agents)[Integrating your own agent](https://www.harborframework.com/docs/agents#integrating-your-own-agent)[External agents](https://www.harborframework.com/docs/agents#external-agents)[Installed agents](https://www.harborframework.com/docs/agents#installed-agents)[Running a custom agent](https://www.harborframework.com/docs/agents#running-a-custom-agent)
