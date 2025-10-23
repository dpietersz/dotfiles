#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

# Ensures jj is available
if ! command -v jj &> /dev/null; then
    echo "Jujutsu (jj) command not found. Please install it first." >&2
    exit 1
fi

# Ensures llm is available
if ! command -v llm &> /dev/null; then
    echo "LLM (llm) command not found. Please install it first (e.g., pipx install llm)." >&2
    exit 1
fi

# Ensures gum is available (optional, for confirmation)
gum_available=true
if ! command -v gum &> /dev/null; then
    echo "Gum (gum) command not found. Will use basic 'read' for confirmation." >&2
    gum_available=false
fi

generate_commit_message_jj() {
    local last_commits_text
    # Get descriptions of up to 3 ancestors of the parent of the current working copy commit (@).
    # These are the commits chronologically before the one being currently worked on.
    # Use (description.lines()[0] ?? "") to safely get the first line.
    last_commits_text=$(jj log --no-graph --limit 3 -r "ancestors(parents(@), 3)" -T ' "- " ++ (description.lines()[0] ?? "")' 2>/dev/null || echo "- No previous commit descriptions found.")

    # Get the diff of the current working copy commit (@) against its parent(s) (@-).
    # This shows the changes that will be described.
    local diff_output
    diff_output=$(jj diff)

    if [[ -z "$diff_output" ]]; then
        printf "No changes found in the current working copy commit (@) to generate a message for.\n" >&2
        printf "Hint: Make some file changes. If you just ran 'jj new', your current commit is empty until you modify files.\n" >&2
        return 1
    fi

    # The prompt to the LLM, similar to your original script.
    # Pass the diff_output via stdin to llm.
    printf "%s\n" "$diff_output" | llm "
Below is a diff of all changes in the current Jujutsu working copy commit (@),
obtained using a command similar to \`jj diff\`.

For context, here are the descriptions of the last 3 changes before this one:
$last_commits_text

Please generate a concise, one-line conventional commit message for these changes that follows a similar style to the previous descriptions.

You can include thoughts, but make sure you prefix with # as comments for the editor.
If you have an analysis, start it with '# Analysis:'.
Your generated one-line commit message should be the very last line of your output that is not a comment (not prefixed with #).
"
    # The exit status of llm will propagate due to "set -e" or be handled by the caller.
}

confirm_and_describe_jj() {
    local message="$1"
    local current_commit_id
    local current_commit_short_desc
    current_commit_id=$(jj log --limit 1 -r "@" -T "change_id.short()")
    # Use (description.lines()[0] ?? "") to safely get the first line.
    current_commit_short_desc=$(jj log --limit 1 -r "@" -T "(description.lines()[0] ?? "")" | cut -c 1-70)

    printf "\nGenerated message for current change (@ %s: %s...):\n" "$current_commit_id" "$current_commit_short_desc"

    if $gum_available; then
        gum style --foreground 212 --border normal --margin "1 0" --padding "1 2" "$message"
        if gum confirm "Use this message for the current change (@ %s)?" "$current_commit_id"; then
            # jj describe -m "message" sets the first line of the description and clears the rest.
            if jj describe -m "$message" @; then # Explicitly target @ for clarity
                printf "Description set for current change (@ %s) successfully!\n" "$current_commit_id"
            else
                printf "jj describe failed. Please check and try again.\n" >&2
                return 1
            fi
        else
            printf "Description cancelled by user.\n"
            return 1
        fi
    else
        # Fallback if gum is not available
        read -r -p "Use this message for the current change (@ $current_commit_id)? (y/N): " confirmation
        if [[ "$confirmation" =~ ^[Yy]$ ]]; then
            if jj describe -m "$message" @; then
                printf "Description set for current change (@ %s) successfully!\n" "$current_commit_id"
            else
                printf "jj describe failed. Please check and try again.\n" >&2
                return 1
            fi
        else
            printf "Description cancelled by user.\n"
            return 1
        fi
    fi
}

jj_llm_describe() {
    local llm_full_output
    printf "\x1b[2mGenerating commit message (Ctrl+C to cancel LLM)...\n"

    # Capture the output of the function, which includes LLM's response
    # If generate_commit_message_jj returns non-zero (e.g. no diff), this will be caught.
    llm_full_output=$(generate_commit_message_jj)
    local gen_status=$? # Capture status of generate_commit_message_jj

    printf "\x1b[0m" # Reset text formatting

    if [[ $gen_status -ne 0 ]]; then
        # Error message already printed by generate_commit_message_jj
        return 1
    fi

    if [[ -z "$llm_full_output" ]]; then
        printf "LLM returned empty output.\n" >&2
        return 1
    fi
    
    local thinking_process
    thinking_process=$(echo "$llm_full_output" | grep '^#' || true) # Capture comments, allow no match
    local commit_message
    # Get the last line that does not start with #
    commit_message=$(echo "$llm_full_output" | grep -v '^#' | tail -n 1 || true)

    if [[ -n "$thinking_process" ]]; then
        printf "\n\x1b[2mLLM Analysis & Thoughts:\n%s\n\x1b[0m\n" "$thinking_process"
    fi
    
    if [[ -z "$commit_message" ]]; then
        printf "Generated commit message is empty (after removing any #-prefixed comments).\n" >&2
        printf "LLM full output was:\n%s\n" "$llm_full_output"
        return 1
    fi

    confirm_and_describe_jj "$commit_message"
}

main() {
    jj_llm_describe "$@" # Pass all arguments, though none are used by this script
}

main "$@"
