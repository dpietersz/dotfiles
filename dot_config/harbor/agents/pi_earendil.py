"""Harbor adapter for the current Earendil Pi coding agent.

Why this exists:
Harbor's built-in `pi` adapter currently installs the legacy npm package
`@mariozechner/pi-coding-agent`. This adapter installs
`@earendil-works/pi-coding-agent` and can upload a checked-in Pi harness config
from this dotfiles repo.
"""

from __future__ import annotations

import json
import os
import shlex
from pathlib import Path

from harbor.agents.installed.base import BaseInstalledAgent, CliFlag, with_prompt_template
from harbor.environments.base import BaseEnvironment
from harbor.models.agent.context import AgentContext


class PiEarendil(BaseInstalledAgent):
    """Run Pi in Harbor task containers."""

    _OUTPUT_FILENAME = "pi.jsonl"

    CLI_FLAGS = [
        CliFlag(
            "thinking",
            cli="--thinking",
            type="enum",
            choices=["off", "minimal", "low", "medium", "high", "xhigh"],
        ),
    ]

    def __init__(
        self,
        *args,
        pi_package: str = "@earendil-works/pi-coding-agent",
        pi_config_dir: str | None = None,
        extra_pi_args: str = "--no-context-files",
        npm_install_args: str = "--ignore-scripts",
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self.pi_package = pi_package
        self.pi_config_dir = pi_config_dir
        self.extra_pi_args = extra_pi_args.strip()
        self.npm_install_args = npm_install_args.strip()

    @staticmethod
    def name() -> str:
        return "pi-earendil"

    def get_version_command(self) -> str | None:
        return ". ~/.nvm/nvm.sh; pi --version"

    def parse_version(self, stdout: str) -> str:
        return stdout.strip().splitlines()[-1].strip()

    async def install(self, environment: BaseEnvironment) -> None:
        await self.exec_as_root(
            environment,
            command="apt-get update && apt-get install -y curl ca-certificates git",
            env={"DEBIAN_FRONTEND": "noninteractive"},
        )

        version_spec = f"@{self._version}" if self._version else "@latest"
        package_spec = f"{self.pi_package}{version_spec}"
        npm_args = f" {self.npm_install_args}" if self.npm_install_args else ""

        await self.exec_as_agent(
            environment,
            command=(
                "set -euo pipefail; "
                "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash && "
                'export NVM_DIR="$HOME/.nvm" && '
                '\\. "$NVM_DIR/nvm.sh" && '
                "nvm install 22 && npm -v && "
                f"npm install -g{npm_args} {shlex.quote(package_spec)} && "
                "pi --version"
            ),
        )

        if self.pi_config_dir:
            source = Path(self.pi_config_dir).expanduser().resolve()
            if not source.is_dir():
                raise FileNotFoundError(f"pi_config_dir not found: {source}")
            await self.exec_as_agent(
                environment,
                command="rm -rf /tmp/pi-agent-config && mkdir -p /tmp/pi-agent-config",
            )
            await environment.upload_dir(source, "/tmp/pi-agent-config")
            await self.exec_as_agent(
                environment,
                command=(
                    "set -euo pipefail; "
                    "rm -rf $HOME/.pi/agent && mkdir -p $HOME/.pi/agent && "
                    "cp -a /tmp/pi-agent-config/. $HOME/.pi/agent/ && "
                    "if [ -f $HOME/.pi/agent/extensions/minion-subagents/package.json ]; then "
                    '. $HOME/.nvm/nvm.sh && '
                    "cd $HOME/.pi/agent/extensions/minion-subagents && npm install --omit=dev; "
                    "fi"
                ),
            )

    def _provider_env(self) -> dict[str, str]:
        # Include known Pi provider variables. Harbor also merges --agent-env via
        # BaseInstalledAgent._extra_env, so users can pass provider-specific vars
        # not listed here.
        keys = [
            "ANTHROPIC_API_KEY",
            "ANTHROPIC_OAUTH_TOKEN",
            "ANT_LING_API_KEY",
            "OPENAI_API_KEY",
            "AZURE_OPENAI_API_KEY",
            "AZURE_OPENAI_BASE_URL",
            "AZURE_OPENAI_RESOURCE_NAME",
            "AZURE_OPENAI_API_VERSION",
            "AZURE_OPENAI_DEPLOYMENT_NAME_MAP",
            "DEEPSEEK_API_KEY",
            "NVIDIA_API_KEY",
            "GEMINI_API_KEY",
            "GOOGLE_API_KEY",
            "GOOGLE_GENERATIVE_AI_API_KEY",
            "GOOGLE_APPLICATION_CREDENTIALS",
            "GOOGLE_CLOUD_PROJECT",
            "GOOGLE_CLOUD_LOCATION",
            "GOOGLE_GENAI_USE_VERTEXAI",
            "GROQ_API_KEY",
            "CEREBRAS_API_KEY",
            "XAI_API_KEY",
            "FIREWORKS_API_KEY",
            "TOGETHER_API_KEY",
            "OPENROUTER_API_KEY",
            "AI_GATEWAY_API_KEY",
            "ZAI_API_KEY",
            "ZAI_CODING_CN_API_KEY",
            "MISTRAL_API_KEY",
            "MINIMAX_API_KEY",
            "MOONSHOT_API_KEY",
            "OPENCODE_API_KEY",
            "KIMI_API_KEY",
            "CLOUDFLARE_API_KEY",
            "CLOUDFLARE_ACCOUNT_ID",
            "CLOUDFLARE_GATEWAY_ID",
            "XIAOMI_API_KEY",
            "XIAOMI_TOKEN_PLAN_CN_API_KEY",
            "XIAOMI_TOKEN_PLAN_AMS_API_KEY",
            "XIAOMI_TOKEN_PLAN_SGP_API_KEY",
            "AWS_PROFILE",
            "AWS_ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY",
            "AWS_BEARER_TOKEN_BEDROCK",
            "AWS_REGION",
            "GITHUB_TOKEN",
            "PI_TELEMETRY",
            "PI_SKIP_VERSION_CHECK",
        ]
        return {key: os.environ[key] for key in keys if os.environ.get(key)}

    @with_prompt_template
    async def run(
        self,
        instruction: str,
        environment: BaseEnvironment,
        context: AgentContext,
    ) -> None:
        if not self.model_name or "/" not in self.model_name:
            raise ValueError("Model name must be in provider/model format")

        provider, model = self.model_name.split("/", 1)
        cli_flags = self.build_cli_flags()
        extra_args = f" {self.extra_pi_args}" if self.extra_pi_args else ""
        flag_args = f" {cli_flags}" if cli_flags else ""

        command = (
            ". ~/.nvm/nvm.sh; "
            "export PI_SKIP_VERSION_CHECK=${PI_SKIP_VERSION_CHECK:-1}; "
            "export PI_TELEMETRY=${PI_TELEMETRY:-0}; "
            "pi --print --mode json --no-session "
            f"--provider {shlex.quote(provider)} --model {shlex.quote(model)}"
            f"{flag_args}{extra_args} "
            f"{shlex.quote(instruction)} "
            f"2>&1 </dev/null | stdbuf -oL tee /logs/agent/{self._OUTPUT_FILENAME}"
        )

        await self.exec_as_agent(environment, command=command, env=self._provider_env())

    def populate_context_post_run(self, context: AgentContext) -> None:
        output_file = self.logs_dir / self._OUTPUT_FILENAME
        if not output_file.exists():
            return

        total_input_tokens = 0
        total_output_tokens = 0
        total_cache_read_tokens = 0
        total_cache_write_tokens = 0
        total_cost = 0.0

        for line in output_file.read_text(errors="replace").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue

            if event.get("type") != "message_end":
                continue
            message = event.get("message") or {}
            if message.get("role") != "assistant":
                continue

            usage = message.get("usage") or {}
            total_input_tokens += int(usage.get("input", 0) or 0)
            total_output_tokens += int(usage.get("output", 0) or 0)
            total_cache_read_tokens += int(usage.get("cacheRead", 0) or 0)
            total_cache_write_tokens += int(usage.get("cacheWrite", 0) or 0)
            cost = usage.get("cost") or {}
            total_cost += float(cost.get("total", 0.0) or 0.0)

        context.n_input_tokens = total_input_tokens + total_cache_read_tokens
        context.n_output_tokens = total_output_tokens
        context.n_cache_tokens = total_cache_read_tokens + total_cache_write_tokens
        context.cost_usd = total_cost if total_cost > 0 else None
