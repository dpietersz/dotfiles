# Nushell configuration
# Reference: https://www.nushell.sh/book/configuration.html

# Set editor mode to vi
$env.config.edit_mode = 'vi'

# Source nushell configuration files
let config_dir = ($env.XDG_CONFIG_HOME? // ($env.HOME + "/.config")) + "/nushell"

# Load environment variables
source ($config_dir + "/00-env.nu")

# Load PATH management
source ($config_dir + "/10-path.nu.tmpl")

# Load tools management
source ($config_dir + "/20-tools.nu.tmpl")

# Load aliases
source ($config_dir + "/40-aliases.nu")

# Load functions
source ($config_dir + "/30-functions.nu")

# Initialize starship prompt
# The starship.nu file is auto-loaded from vendor/autoload/
# and sets up PROMPT_COMMAND and other environment variables

