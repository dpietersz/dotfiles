# 40-aliases.sh — Custom Aliases (shared between bash and zsh)

# ------------------ Tools ------------------

if command -v lazydocker >/dev/null; then
  alias ld="lazydocker"
fi

if command -v lazygit >/dev/null; then
  alias lg="lazygit"
fi

if command -v kitten >/dev/null; then
  # showkeys — print the raw key events kitty receives, in the kitty
  # keyboard-protocol encoding. Handy for checking what a custom-keyboard
  # chord actually emits (e.g. confirming Super+B reaches kitty as super+b).
  # Press the chord, then Ctrl+C / Ctrl+D to quit.
  alias showkeys="kitten show_key -m kitty"
fi

if command -v kondo >/dev/null; then
  # cln — interactive cleaner over the dev tree. kondo scans for project
  # build/cache dirs (node_modules, target/, .venv, .gradle, etc.) and lets
  # you Space-select what to delete per project. Default root is ~/dev so
  # repos, projects, and toolboxes all get scanned.
  alias cln='kondo "$HOME/dev"'
fi

if command -v kubectl >/dev/null; then
  alias k="kubectl"
fi

if command -v zellij >/dev/null; then
  alias zj="zellij"
  alias zjd="zellij --layout ${XDG_CONFIG_HOME:-$HOME/.config}/zellij/layouts/dev.kdl"
fi

if command -v zoxide >/dev/null; then
  alias cd="z"
fi

# use bat instead of cat
if command -v bat >/dev/null; then
  alias cat="bat"
fi

## bat on debian based systems is batcat. Fix that.
if command -v batcat >/dev/null; then
  alias cat="batcat"
fi


# ------------------ Claude ------------------
alias cld="claude"
alias cldp="claude -p"
alias cldo="claude --model opus"
alias clds="claude --model sonnet"
alias cldys="claude --dangerously-skip-permissions --model sonnet"
alias cldy="claude --dangerously-skip-permissions --model sonnet"
alias cldyo="claude --dangerously-skip-permissions --model opus"
alias cldpy="claude -p --dangerously-skip-permissions"
alias cldpyo="claude -p --dangerously-skip-permissions --model opus"
alias cldr="claude --resume"

# ------------------ Git ------------------

alias gp="git pull"
alias gs="git status"

# ------------------ Directory Navigation ------------------

alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ~="cd ~"
alias cl="clear"

# ------------------ Shell / Config ------------------

alias espansoconf="v '$DOTFILES/dot_config/espanso/match/base.yml'"
alias nvimconf="cd '$DOTFILES/dot_config/nvim && nvim init.lua'"

# Shell-specific aliases (detect current shell)
if [ -n "$BASH_VERSION" ]; then
  alias bashconf="v ~/.bashrc"
  alias sbr="source '$HOME/.bashrc'"
elif [ -n "$ZSH_VERSION" ]; then
  alias zshconf="v ~/.zshrc"
  alias szr="source '$HOME/.zshrc'"
fi

# ------------------ Better ls commands ------------------
alias ls="ls --color=auto"
alias la="eza -laghm --all --icons --git --color=always --group-directories-first"
alias ll="eza -l --color=always --group-directories-first --icons"
alias lt="eza -aT --color=always --group-directories-first --icons -I '.git|.vscode|node_modules'"
alias l="eza -lah --color=always --group-directories-first --icons"
alias last='find . -type f -not -path "*/\.*" -exec ls -lrt {} +'

# ------------------ passwordstore ------------------

alias p="pass"
alias pp="pass git push"
alias pmv="pass mv"
alias pcp="pass cp"
alias pedit="pass edit"
alias psearch="pass search"
alias psh="pass show"
alias psc="pass show -c"
alias ppp="pass show -c Sites/canva.com"

