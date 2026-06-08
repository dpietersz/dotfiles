---
title: "LLM-as-a"
description: "How to use an LLM to score agent outputs instead of deterministic tests."
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/tutorials/llm-as-a-judge"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"a657401b8c8a7f240b49e7fca8b35cf3\""
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
[Running Terminal-Bench](https://www.harborframework.com/docs/tutorials/running-terminal-bench)[MCP Server Task](https://www.harborframework.com/docs/tutorials/mcp-server-task)[LLM-as-a-Judge](https://www.harborframework.com/docs/tutorials/llm-as-a-judge)
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
LLM-as-a-JudgeTask overview
Tutorials
# LLM-as-a-Judge
Copy Markdown
How to use an LLM to score agent outputs instead of deterministic tests.
Recommended: Rewardkit
For a declarative approach to llm-as-a-judge, see [Rewardkit](https://www.harborframework.com/docs/rewardkit/judge-criteria). The tutorial below shows how to do it manually with a custom Python script.
This example shows how to evaluate agent outputs with an LLM instead of pass/fail unit tests. The full source is in [`examples/tasks/llm-judge-example`](https://github.com/laude-institute/harbor/tree/main/examples/tasks/llm-judge-example).
In general, a judge is a script, just like any other verifier defined using `test.sh` and is executed in the environment after the agent runs. The only difference is that judges need API keys to access the LLM provider.
## [Task overview](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#task-overview)
The agent is asked to write a funny poem. A verifier script sends the poem to Claude, which returns a `funny_score` between 0 and 1. That score is written to `reward.json`.
## [Directory structure](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#directory-structure)

```
llm-judge-example/
├── instruction.md
├── task.toml
├── environment/
│   └── Dockerfile
├── solution/
│   └── solve.sh
└── tests/
    ├── test.sh
    └── llm_judge.py
```

## [Passing secrets to the verifier](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#passing-secrets-to-the-verifier)
The `[verifier.env]` section in `task.toml` lets you inject environment variables into the container during verification _after the agent runs_. Use `${VAR}` syntax to read from the host environment (for secrets), or pass literal values directly:
task.toml

```
[verifier]
timeout_sec = 900.0

[verifier.env]
ANTHROPIC_API_KEY = "${ANTHROPIC_API_KEY}"   # from host env
MODEL_NAME = "claude-haiku-4-5"              # literal value
```

This keeps API keys out of your task source while making them available during verification.
## [Judge script](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#judge-script)
This judge uses the Anthropic API with [structured outputs](https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs) to get a validated score.
tests/llm_judge.py

```
# /// script
# dependencies = [
#   "anthropic>=0.75.0",
#   "pydantic==2.12.5",
# ]
# ///

import json
import os
from pathlib import Path

from anthropic import Anthropic, transform_schema
from pydantic import BaseModel, Field


class FunnyScoreResponse(BaseModel):
    funny_score: float = Field(..., ge=0.0, le=1.0)


def main():
    poem = Path("/app/poem.txt").read_text()
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    schema = transform_schema(FunnyScoreResponse.model_json_schema())

    response = client.messages.create(
        model=os.getenv("MODEL_NAME"),
        max_tokens=1024,
        output_config={"format": {"type": "json_schema", "schema": schema}},
        messages=[
            {"role": "user", "content": f"Rate how funny this poem is from 0.0 to 1.0.\n\nPoem:\n{poem}"}
        ],
    )

    result = FunnyScoreResponse.model_validate_json(response.content[0].text)
    Path("/logs/verifier/reward.json").write_text(
        json.dumps({"funny": result.funny_score}, indent=2)
    )


if __name__ == "__main__":
    main()
```

The test script simply runs the judge:
tests/test.sh

```
#!/bin/bash
uv run /tests/llm_judge.py
```

## [Writing `reward.json`](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#writing-rewardjson)
Instead of a binary `reward.txt`, this task writes a JSON object with named metrics. Harbor reads both formats — `reward.txt` first, then `reward.json` as a fallback.

```
{ "funny": 0.75 }
```

You can return multiple scores in a single JSON object:

```
{ "creativity": 0.9, "humor": 0.7, "grammar": 1.0 }
```

## [Running it](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#running-it)

```
# Prerequisites
export ANTHROPIC_API_KEY="sk-ant-..."

# Run with oracle
harbor run -p examples/tasks/llm-judge-example -a oracle

# Run with a real agent
harbor run -p examples/tasks/llm-judge-example -a claude-code -m anthropic/claude-sonnet-4-5
```

## [Adapting for your tasks](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#adapting-for-your-tasks)
You are free to define your judge however you like, just be sure to put the corresponding API keys in the `[verifier.env]` section of `task.toml`.
If you want to copy this boilerplate, you can do the following:
  1. Define a Pydantic model for the score(s) you need
  2. Write a prompt that instructs the LLM how to evaluate the output
  3. Write the scores to `/logs/verifier/reward.json`
  4. Pass any required API keys via `[verifier.env]`


This pattern works with any LLM provider — swap the Anthropic client for OpenAI, Google, etc.
Cost
Each verification call costs API tokens.
[MCP Server Task How to create a task with a sidecar MCP server using Docker Compose.](https://www.harborframework.com/docs/tutorials/mcp-server-task)[Reward Kit Lightweight package to define and run verifiers](https://www.harborframework.com/docs/rewardkit)
[Task overview](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#task-overview)[Directory structure](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#directory-structure)[Passing secrets to the verifier](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#passing-secrets-to-the-verifier)[Judge script](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#judge-script)[Writing `reward.json`](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#writing-rewardjson)[Running it](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#running-it)[Adapting for your tasks](https://www.harborframework.com/docs/tutorials/llm-as-a-judge#adapting-for-your-tasks)
