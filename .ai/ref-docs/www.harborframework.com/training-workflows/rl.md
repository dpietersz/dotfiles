---
title: "RL"
description: "Reinforcement learning on Harbor tasks"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/training-workflows/rl"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"ad49187e1b14947bc500df5c6e999c5b\""
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
[RL](https://www.harborframework.com/docs/training-workflows/rl)[SFT](https://www.harborframework.com/docs/training-workflows/sft)
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
RLExample of a rollout interface
Training Workflows
# RL
Copy Markdown
Reinforcement learning on Harbor tasks
Performing RL on containerized agentic tasks is a common use case but difficult to implement and scale. Harbor provides a simple interface for training on containerized agentic environments.
We plan to integrate with most popular RL frameworks. For now, we have worked with the SkyRL team to implement their interface for RL on Harbor tasks.
In general, performing RL on Harbor tasks requires generating rollouts and recording tokens and rewards. This usually involves implementing an RL framework's rollout interface.
We recommend using the `TrialConfig` or `JobConfig` classes to configure the rollouts. We also recommend using [cloud sandboxes](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes) for scaling rollouts and reducing startup/teardown overhead.
Rollout interfaces typically receive batches of data to be used for the rollouts. We recommend using the `TaskConfig` class as the batch object. These configs can point to remote or local tasks.

```
task_configs = [
    TaskConfig(
        path="cancel-async-tasks",
        git_url="https://<version-control-url>/<org>/<repo>.git",
        git_commit_id="<hash>"
    ), # Remote task
    TaskConfig(
        path="tasks/fix-dockerfile-syntax",
    ), # Local task
]
```

## [Example of a rollout interface](https://www.harborframework.com/docs/training-workflows/rl#example-of-a-rollout-interface)
rollout_interface.py

```
from pathlib import Path

from pydantic import BaseModel

from harbor.job import Job
from harbor.models.environment_type import EnvironmentType
from harbor.models.job.config import JobConfig, OrchestratorConfig
from harbor.models.trial.config import EnvironmentConfig, TaskConfig

from your_rl_framework import SomeRLFrameworkRolloutInterface, Rollout


class HarborRolloutInterface(SomeRLFrameworkRolloutInterface):
    async def run(self, task_ids: list[TaskId]) -> list[Rollout]:
        job = Job(
            config=JobConfig(
                jobs_dir=Path("jobs"),
                environment=EnvironmentConfig(
                    type=EnvironmentType.DAYTONA,
                ),
                agents=[
                    AgentConfig(
                        name=AgentName.TERMINUS_2,
                        model_name="hosted_vllm/<model-name>",
                        kwargs={
                            "base_url": "https://<vllm-server-url>",
                        }
                    )
                ]
                orchestrator=OrchestratorConfig(
                    n_concurrent_trials=32,
                ),
                tasks=task_configs,
            ),
        )

        result = await job.run()

        rollouts = []
        for trial_result in result.trial_results:
            reward = (
                trial_result.verifier_result.rewards.get("reward", 0)
                if trial_result.verifier_result and trial_result.verifier_result.rewards
                else 0
            )

            if (
                trial_result.agent_result
                and trial_result.agent_result.metadata
                and "token_ids" in trial_result.agent_result.metadata
                and "mask_ids" in trial_result.agent_result.metadata
            ):
                token_ids = trial_result.agent_result.metadata["token_ids"]
                mask_ids = trial_result.agent_result.metadata["mask_ids"]
            else:
                raise ValueError(
                    f"Missing token_ids or mask_ids for trial {trial_result.trial_name}"
                )

            rollout = Rollout(
                reward=reward,
                token_ids=token_ids,
                mask_ids=mask_ids,
            )

            rollouts.append(rollout)

        return rollouts
```

## [Collecting tokens from agents](https://www.harborframework.com/docs/training-workflows/rl#collecting-tokens-from-agents)
There are two strategies for collecting tokens:
  1. Intercepting tokens from a vLLM server
  2. Returning tokens as part of the agent result metadata


(1) assumes you are using a vLLM server to generate tokens and have a framework that handles the interception. (2) assumes your agent is configured to return tokens as part of the agent result metadata. We are working to add flags to Terminus 2 to include this information. If you plan to train using a custom harness, be sure to include this information in the agent result metadata.
[Agent Trajectory Format (ATIF) Understanding and working with the Agent Trajectory Interchange Format](https://www.harborframework.com/docs/agents/trajectory-format)[SFT Generating SFT datasets from Harbor trials](https://www.harborframework.com/docs/training-workflows/sft)
[Example of a rollout interface](https://www.harborframework.com/docs/training-workflows/rl#example-of-a-rollout-interface)[Collecting tokens from agents](https://www.harborframework.com/docs/training-workflows/rl#collecting-tokens-from-agents)
