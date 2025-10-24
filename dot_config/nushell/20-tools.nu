# 20-tools.nu - Tools management (nushell)

{{- if not .remote }}
# setup gpg-agent ssh
$env.SSH_AGENT_PID = ""
if (($env.gnupg_SSH_AUTH_SOCK_by? // "0") != $"($env.PID)") {
  $env.SSH_AUTH_SOCK = (gpgconf --list-dirs agent-ssh-socket | str trim)
}
{{- end }}

# Homebrew - enable if found on Linux
if ("/home/linuxbrew/.linuxbrew/bin/brew" | path exists) {
  let brew_env = (/home/linuxbrew/.linuxbrew/bin/brew shellenv | str trim)
  load-env (eval $brew_env)
}

# activate mise
if (which mise | is-not-empty) {
  load-env (mise activate nu | from json)
}

# starship is auto-loaded from vendor/autoload/starship.nu
# no need to initialize it here

# fzf - fuzzy finder with key bindings and completion
if (which fzf | is-not-empty) {
  load-env (fzf --nushell | from json)
}

# kubectl - Kubernetes CLI completion
if (which kubectl | is-not-empty) {
  load-env (kubectl completion nu | from json)
}

# flux - GitOps toolkit completion
if (which flux | is-not-empty) {
  try {
    load-env (flux completion nu | from json)
  } catch {
    # flux completion might not support nushell
  }
}

# zoxide - smarter cd command
if (which zoxide | is-not-empty) {
  load-env (zoxide init nu | from json)
}

# chezmoi - dotfile manager
if (which chezmoi | is-not-empty) {
  try {
    load-env (chezmoi completion nu | from json)
  } catch {
    # chezmoi completion might not support nushell
  }
}

# uv - Python package installer
if (which uv | is-not-empty) {
  try {
    load-env (uv generate-shell-completion nu | from json)
  } catch {
    # uv completion might not support nushell
  }
}

# npm - Node package manager (from node)
if (which npm | is-not-empty) {
  try {
    load-env (npm completion | from json)
  } catch {
    # npm completion might not support nushell
  }
}

