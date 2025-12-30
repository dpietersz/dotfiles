#!/bin/bash

# Brave MCP Wrapper - Loads API key from password store and starts Brave MCP server

set -euo pipefail

# Load API key from password store
if command -v pass &>/dev/null; then
  export BRAVE_API_KEY="$(pass show Sites/brave.com/bravesearch/api-key/mcp | head -1)"
else
  echo "Error: pass command not found" >&2
  exit 1
fi

# Start Brave MCP server
exec npx -y @modelcontextprotocol/server-brave-search "$@"
