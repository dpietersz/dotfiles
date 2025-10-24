# Nushell configuration
# Reference: https://www.nushell.sh/book/configuration.html

# Set editor mode to vi
$env.config.edit_mode = 'vi'

# Source shared shell configs
for file in (glob ($env.XDG_CONFIG_HOME? // ($env.HOME + "/.config")) + "/shell/*.sh") {
  try {
    source $file
  } catch {
    # Ignore errors from shell scripts in nushell
  }
}

# Aliases
alias ll = ls -l
alias la = ls -la
alias cd = z

