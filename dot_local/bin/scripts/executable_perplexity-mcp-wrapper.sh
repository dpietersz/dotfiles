#!/bin/bash

# Perplexity MCP Wrapper - Loads API key from password store and starts Perplexity MCP server

set -euo pipefail

# Load API key from password store
if command -v pass &>/dev/null; then
  export PERPLEXITY_API_KEY="$(pass show Sites/perplexity.ai/api-key | head -1)"
else
  echo "Error: pass command not found" >&2
  exit 1
fi

# Start Perplexity MCP server
exec npx -y @perplexity-ai/mcp-server "$@"
