# 15-shell-options.sh - Shell behavior and options

# Enable vi mode for bash
set -o vi

# Make ESC key more responsive in vi mode
export KEYSEQTIMEOUT=1

eval "$(direnv hook bash)"

eval "$ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
