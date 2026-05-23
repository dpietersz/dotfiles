---
title: "Configuration"
description: "Configure Paseo via config.json, environment variables, and CLI overrides."
domain: "paseo.sh"
source: "https://paseo.sh/docs/configuration"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/configuration#configuration)Configuration
Paseo loads configuration from a single JSON file in your Paseo home directory, with optional environment variable and CLI overrides.
##  [#](https://paseo.sh/docs/configuration#where-config-lives)Where config lives
By default, Paseo uses `~/.paseo` as its home directory. The configuration file is:

```
~/.paseo/config.json
```

You can change the home directory by setting `PASEO_HOME` or passing `--home` to `paseo daemon start`.
##  [#](https://paseo.sh/docs/configuration#precedence)Precedence
Paseo merges configuration in this order:
  1. Defaults
  2. `config.json`
  3. Environment variables
  4. CLI flags


Lists append across sources (for example, `hostnames` and `cors.allowedOrigins`).
##  [#](https://paseo.sh/docs/configuration#example)Example
Minimal example that configures listening address, hostnames, and MCP:

```
{
  "$schema": "https://paseo.sh/schemas/paseo.config.v1.json",
  "version": 1,
  "daemon": {
    "listen": "127.0.0.1:6767",
    "hostnames": ["localhost", ".localhost"],
    "mcp": { "enabled": true }
  }
}
```

`daemon.hostnames` is the primary field. The old `daemon.allowedHosts` name still works as a deprecated alias for backward compatibility.
##  [#](https://paseo.sh/docs/configuration#agent-providers)Agent providers
Agent providers, both the first-class ones Paseo ships with and custom entries you add under `agents.providers`, are documented on their own page.
See [Providers](https://paseo.sh/docs/providers) for the mental model and [Supported providers](https://paseo.sh/docs/supported-providers) for the full list of agents Paseo can launch. For pointing Claude at Anthropic-compatible endpoints (Z.AI, Alibaba/Qwen), multiple profiles, custom binaries, ACP agents, and the `additionalModels` merge behavior, see [Custom providers](https://paseo.sh/docs/custom-providers). The full field reference lives on GitHub at [docs/custom-providers.md](https://github.com/getpaseo/paseo/blob/main/docs/custom-providers.md).
##  [#](https://paseo.sh/docs/configuration#voice)Voice
Voice is configured through `features.dictation` and `features.voiceMode`, with provider credentials under `providers`.
For voice philosophy, architecture, and complete local/OpenAI setup examples, see [Voice docs](https://paseo.sh/docs/voice).
##  [#](https://paseo.sh/docs/configuration#logging)Logging
Daemon logging uses separate console and file sinks by default:
  * Console: `info` and above
  * File (`$PASEO_HOME/daemon.log`): `trace` and above
  * File rotation: `10m` max file size, `2` retained files total (active + 1 rotated)



```
{
  "log": {
    "console": {
      "level": "info",
      "format": "pretty"
    },
    "file": {
      "level": "trace",
      "path": "daemon.log",
      "rotate": {
        "maxSize": "10m",
        "maxFiles": 2
      }
    }
  }
}
```

Legacy fields `log.level` and `log.format` are still supported and map to the new destination settings.
##  [#](https://paseo.sh/docs/configuration#password-authentication)Password authentication
You can require a password to connect to the daemon. When set, all HTTP and WebSocket clients must authenticate. Only the `/api/health` liveness endpoint is exempt, so that process supervisors and load balancers can probe without credentials.
The easiest way to set a password is with the CLI:

```
paseo daemon set-password
```

This prompts for a password, writes the bcrypt hash to `config.json`, and tells you to restart the daemon.
Alternatively, set the `PASEO_PASSWORD` environment variable (plaintext, hashed automatically at startup):

```
PASEO_PASSWORD=my-secret paseo daemon start
```

Or write the hash directly in `config.json`:

```
{
  "daemon": {
    "auth": {
      "password": "$2b$12$..."
    }
  }
}
```

After setting a password, restart the daemon for the change to take effect.
###  [#](https://paseo.sh/docs/configuration#connecting-with-a-password)Connecting with a password
The CLI picks up a password from, in order:
  1. The `password` query parameter on a `tcp://` host URI:

```
paseo --host "tcp://192.168.1.10:6767?password=my-secret" ls
```

  2. The `PASEO_PASSWORD` environment variable, used as a fallback when the host carries no embedded password (works for `localhost:6767`, bare `host:port`, or `tcp://` hosts without a `password=` query):

```
PASEO_PASSWORD=my-secret paseo ls
PASEO_PASSWORD=my-secret paseo --host 192.168.1.10:6767 ls
```



A `password=` in the URI always wins over the env var, so you can keep `PASEO_PASSWORD` set globally and still target a different daemon by spelling its password into the URI.
In the mobile app, enter the password in the direct connection setup screen.
##  [#](https://paseo.sh/docs/configuration#common-env-vars)Common env vars
  * `PASEO_HOME`, set Paseo home directory
  * `PASEO_PASSWORD`, on the daemon, the password to require (plaintext, hashed at startup); on the CLI, the password used to connect when the host URI doesn't include one
  * `PASEO_LISTEN`, override `daemon.listen`
  * `PASEO_HOSTNAMES`, override/extend `daemon.hostnames`
  * `PASEO_ALLOWED_HOSTS`, deprecated alias for `PASEO_HOSTNAMES`
  * `PASEO_LOG_CONSOLE_LEVEL`, override `log.console.level`
  * `PASEO_LOG_FILE_LEVEL`, override `log.file.level`
  * `PASEO_LOG_FILE_PATH`, override `log.file.path`
  * `PASEO_LOG_FILE_ROTATE_SIZE`, override `log.file.rotate.maxSize`
  * `PASEO_LOG_FILE_ROTATE_COUNT`, override `log.file.rotate.maxFiles`
  * `PASEO_LOG`, `PASEO_LOG_FORMAT`, legacy log overrides (still supported)
  * `OPENAI_API_KEY`, override OpenAI provider key
  * `PASEO_VOICE_LLM_PROVIDER`, override voice LLM provider (`claude`, `codex`, `opencode`)
  * `PASEO_DICTATION_STT_PROVIDER`, `PASEO_VOICE_STT_PROVIDER`, `PASEO_VOICE_TTS_PROVIDER`, override voice provider selection (`local` or `openai`)
  * `PASEO_LOCAL_MODELS_DIR`, control local model directory
  * `PASEO_DICTATION_LOCAL_STT_MODEL`, override local dictation STT model
  * `PASEO_VOICE_LOCAL_STT_MODEL`, `PASEO_VOICE_LOCAL_TTS_MODEL`, override local voice STT/TTS models
  * `PASEO_DICTATION_LANGUAGE`, `PASEO_VOICE_LANGUAGE`, override dictation and voice STT language
  * `PASEO_VOICE_LOCAL_TTS_SPEAKER_ID`, `PASEO_VOICE_LOCAL_TTS_SPEED`, optional local voice TTS tuning


##  [#](https://paseo.sh/docs/configuration#schema)Schema
For editor autocomplete/validation, set `$schema` to:

```
https://paseo.sh/schemas/paseo.config.v1.json

```
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/configuration.md)
