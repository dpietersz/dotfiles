# 15-shell-options.sh - Zsh-specific shell options

# History settings
HISTFILE="$HOME/.zsh_history"
HISTSIZE=60000
SAVEHIST=50000

setopt HIST_IGNORE_SPACE # do not save a command if it starts with a space
setopt HIST_IGNORE_DUPS  # do not save duplicate commands

# Enable zsh vi-mode
bindkey -v
export KEYTIMEOUT=1 # make switching between modes faster

# Add user local completion folder to fpath
fpath+=(~/.zsh/completion)

# Initialize completion system
autoload -Uz compinit && compinit

# Initialize direnv if available (mise will be initialized in 20-tools.sh)
if command -v direnv >/dev/null 2>&1; then
  eval "$(direnv hook zsh)"
fi
