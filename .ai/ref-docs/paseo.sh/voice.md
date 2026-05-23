---
title: "Voice"
description: "Paseo voice architecture, local-first model execution, and provider configuration."
domain: "paseo.sh"
source: "https://paseo.sh/docs/voice"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/voice#voice)Voice
Paseo has first-class voice support for dictation and realtime conversations with your coding environment.
##  [#](https://paseo.sh/docs/voice#philosophy)Philosophy
Voice is local-first. You can run speech fully on-device, or choose OpenAI for speech features. For voice reasoning/orchestration, Paseo reuses agent providers already installed and authenticated on your machine.
This keeps credentials and execution in your environment and avoids introducing a separate cloud-only voice stack.
##  [#](https://paseo.sh/docs/voice#architecture)Architecture
  * Speech I/O: STT and TTS providers per feature (`local` or `openai`)
  * Local speech runtime: ONNX models executed on CPU by default
  * Voice LLM orchestration: hidden agent session using your configured provider (`claude`, `codex`, or `opencode`)
  * Tooling path: MCP stdio bridge for voice tools and agent control


##  [#](https://paseo.sh/docs/voice#local-speech)Local Speech
Local speech defaults to model IDs `parakeet-tdt-0.6b-v3-int8` (STT) and `kokoro-en-v0_19` (TTS, speaker 0 / voice 00). STT language defaults to `en`.
Missing models are downloaded at daemon startup into `$PASEO_HOME/models/local-speech`. Downloads happen only for missing files.

```
{
  "version": 1,
  "features": {
    "dictation": {
      "stt": { "provider": "local", "model": "parakeet-tdt-0.6b-v3-int8", "language": "en" }
    },
    "voiceMode": {
      "llm": { "provider": "claude", "model": "haiku" },
      "stt": { "provider": "local", "model": "parakeet-tdt-0.6b-v3-int8", "language": "en" },
      "tts": { "provider": "local", "model": "kokoro-en-v0_19", "speakerId": 0 }
    }
  },
  "providers": {
    "local": {
      "modelsDir": "~/.paseo/models/local-speech"
    }
  }
}
```

Set `features.dictation.stt.language` for dictation and `features.voiceMode.stt.language` for realtime voice. If voice language is omitted, Paseo uses the dictation language before falling back to `en`.
##  [#](https://paseo.sh/docs/voice#openai-speech-option)OpenAI Speech Option
You can switch dictation, voice STT, and voice TTS to OpenAI by setting provider fields to `openai` and providing `OPENAI_API_KEY`.

```
{
  "version": 1,
  "features": {
    "dictation": { "stt": { "provider": "openai" } },
    "voiceMode": {
      "stt": { "provider": "openai" },
      "tts": { "provider": "openai" }
    }
  },
  "providers": {
    "openai": { "apiKey": "..." }
  }
}
```

##  [#](https://paseo.sh/docs/voice#environment-variables)Environment Variables
  * `OPENAI_API_KEY`, OpenAI speech credentials
  * `PASEO_VOICE_LLM_PROVIDER`, voice agent provider override
  * `PASEO_LOCAL_MODELS_DIR`, local model storage directory
  * `PASEO_DICTATION_LOCAL_STT_MODEL`, local dictation STT model ID
  * `PASEO_VOICE_LOCAL_STT_MODEL`, `PASEO_VOICE_LOCAL_TTS_MODEL`, local voice STT/TTS model IDs
  * `PASEO_DICTATION_LANGUAGE`, dictation STT language
  * `PASEO_VOICE_LANGUAGE`, realtime voice STT language; falls back to `PASEO_DICTATION_LANGUAGE` when unset
  * `PASEO_VOICE_LOCAL_TTS_SPEAKER_ID`, `PASEO_VOICE_LOCAL_TTS_SPEED`, optional local voice TTS tuning


##  [#](https://paseo.sh/docs/voice#operational-notes)Operational Notes
Realtime voice can launch and control agents. Treat voice prompts with the same care as direct agent instructions, especially when specifying working directories or destructive operations.
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/voice.md)
