#!/usr/bin/env bash

_have() { type "$1" &>/dev/null; }
! _have mods && echo "❌ requires charmbracelet/mods" && exit 1
! _have gum && echo "❌ requires charmbracelet/gum for /continue command" && exit 1

echo "💬 Type '/new' to start a new conversation."
echo "💬 Type '/continue' to resume a previous conversation."
echo "💬 Type '/exit' or press Ctrl+C to quit."

first_prompt=true
selected_title=""

while true; do
  read -erp "Ask a question: " prompt

  if [[ "$prompt" == "/exit" ]]; then
    echo "👋 Goodbye!"
    break
  fi

  if [[ "$prompt" == "/new" ]]; then
    echo "🆕 Starting a new conversation..."
    first_prompt=true
    selected_title=""
    continue
  fi

  if [[ "$prompt" == "/continue" ]]; then
    echo "📜 Fetching previous conversations..."
    mapfile -t sessions < <(mods --list)

    if [[ ${#sessions[@]} -eq 0 ]]; then
      echo "⚠️ No saved conversations found."
      continue
    fi

    selected_title=$(printf "%s\n" "${sessions[@]}" | gum choose --height=20 --header="Select a conversation to continue:")
    if [[ -z "$selected_title" ]]; then
      echo "❌ No conversation selected."
      continue
    fi

    echo "🔄 Continuing conversation: $selected_title"
    first_prompt=false
    continue
  fi

  if $first_prompt; then
    mods "$prompt"
    first_prompt=false
  else
    if [[ -n "$selected_title" ]]; then
      mods --continue "$selected_title" "$prompt"
    else
      mods --continue-last "$prompt"
    fi
  fi
done
