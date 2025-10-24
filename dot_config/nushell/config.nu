# Nushell configuration
# Reference: https://www.nushell.sh/book/configuration.html

# Set editor mode to vi
$env.config.edit_mode = 'vi'

# Load environment variables
source ~/.config/nushell/00-env.nu

# Load PATH management
source ~/.config/nushell/10-path.nu

# Load tools management (mise activation, etc.)
# This MUST come before aliases so that tools like eza are in PATH
source ~/.config/nushell/20-tools.nu

# Initialize starship prompt
# The starship.nu file is auto-loaded from vendor/autoload/
# and sets up PROMPT_COMMAND and other environment variables

