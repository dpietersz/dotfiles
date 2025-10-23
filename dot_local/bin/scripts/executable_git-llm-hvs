#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

generate_commit_message() {
    local last_commits; last_commits=$(git log -3 --pretty=format:"- %s" 2>/dev/null)
    local diff_output; diff_output=$(git diff --cached)

    if [[ -z "$diff_output" ]]; then
        printf "No staged changes found to generate commit message.\n" >&2
        return 1
    fi

    printf "%s\n" "$diff_output" | llm "
Hieronder staat een diff van alle gefaseerde wijzigingen, afkomstig van het commando:
\`\`\`
git diff --cached
\`\`\`

Ter context, hier zijn de laatste 3 commit-berichten:
$last_commits

Genereer een beknopt commit-bericht van één regel voor deze wijzigingen.

Belangrijke context over deze codebase:
- Het is een Azure Lakehouse-omgeving.
- We gebruiken Azure Datafactory en Databricks notebooks.
- Data wordt opgeslagen in containers: raw, bronze, silver, en gold.
- Er is een serve-laag met een MS SQL Database (en soms een PostgreSQL/Postgis database).

Je kunt gedachten toevoegen, maar zorg ervoor dat je deze prefixt met # als commentaar voor de editor.

Begin je antwoord met # Analyse:
"
}

confirm_commit_message() {
    local message="$1"

    gum style --foreground 212 --border normal --margin "1 2" --padding "1 2" "$message"

    if gum confirm "Use this commit message?"; then
        if git commit -m "$message"; then
            printf "Changes committed successfully!\n"
        else
            printf "Commit failed. Please check your changes and try again.\n" >&2
            return 1
        fi
    else
        printf "Commit cancelled.\n"
        return 1
    fi
}

gcm() {
    local temp_output; temp_output=$(mktemp)
    local diff; diff=$(git diff --cached)

    if [[ -z "$diff" ]]; then
        printf "No staged changes.\n"
        return 1
    fi

    printf "\x1b[2mthinking...\n"
    if ! generate_commit_message | tee "$temp_output"; then
        rm -f "$temp_output"
        printf "\x1b[0m"
        return 1
    fi
    printf "\x1b[0m"

    local commit_message; commit_message=$(tail -n 1 "$temp_output")
    rm -f "$temp_output"

    if [[ -z "$commit_message" ]]; then
        printf "Generated commit message is empty.\n" >&2
        return 1
    fi

    confirm_commit_message "$commit_message"
}

main() {
    gcm
}

main "$@"
