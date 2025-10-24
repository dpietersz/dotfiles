# 40-aliases.nu — Custom Aliases (nushell)

# ------------------ Tools ------------------

if (which lazydocker | is-not-empty) {
  alias ld = lazydocker
}

if (which lazygit | is-not-empty) {
  alias lg = lazygit
}

if (which kubectl | is-not-empty) {
  alias k = kubectl
}

if (which zoxide | is-not-empty) {
  alias cd = z
}

# use bat instead of cat
if (which bat | is-not-empty) {
  alias cat = bat
}

# bat on debian based systems is batcat. Fix that.
if (which batcat | is-not-empty) {
  alias cat = batcat
}

# ------------------ Git ------------------

alias gp = git pull
alias gs = git status

# ------------------ Directory Navigation ------------------

alias .. = cd ..
alias ... = cd ../..
alias .... = cd ../../..
alias ..... = cd ../../../..
alias ~ = cd ~
alias cl = clear

# ------------------ Shell / Config ------------------

alias espansoconf = v $"($env.DOTFILES)/dot_config/espanso/match/base.yml"
alias nvimconf = cd $"($env.DOTFILES)/dot_config/nvim" && nvim init.lua

# Nushell-specific config alias
alias nuconf = v $"($env.XDG_CONFIG_HOME)/nushell/config.nu"

# ------------------ Better ls commands ------------------

alias ls = ls --color=auto
alias la = eza -laghm --all --icons --git --color=always --group-directories-first
alias ll = eza -l --color=always --group-directories-first --icons
alias lt = eza -aT --color=always --group-directories-first --icons -I '.git|.vscode|node_modules'
alias l = eza -lah --color=always --group-directories-first --icons
alias last = find . -type f -not -path "*/\.*" -exec ls -lrt {} +

# ------------------ passwordstore ------------------

alias p = pass
alias pp = pass git push
alias pi = pass insert
alias pmv = pass mv
alias pcp = pass cp
alias pedit = pass edit
alias psearch = pass search
alias psh = pass show
alias psc = pass show -c
alias ppp = pass show -c Sites/canva.com

