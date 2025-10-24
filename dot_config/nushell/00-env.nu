# 00-env.nu - Basic Environment variables (nushell)

# Locale settings
$env.LANG = "en_US.UTF-8"

# (neo)vim
if (which nvim | is-not-empty) {
  $env.EDITOR = "nvim"
  $env.VISUAL = "nvim"
} else if (which vim | is-not-empty) {
  $env.EDITOR = "vim"
  $env.VISUAL = "vim"
}

$env.XDG_CONFIG_HOME = ~/.config
$env.CONFIG = ~/.config
$env.HISTFILE = ~/.histfile
$env.HISTSIZE = 25000
$env.SAVEHIST = 25000
$env.HISTCONTROL = "ignorespace"

$env.DOTFILES = ~/dotfiles
$env.SCRIPTS = ~/.local/bin/scripts

$env.DEV = ~/dev
$env.PROJECTS = ~/dev/Projects
$env.NOTES = ~/dev/Notes
$env.DESKTOP = ~/dev/Desktop
$env.DOWNLOADS = ~/dev/Downloads
$env.TEMPLATES = ~/dev/Templates
$env.PUBLIC = ~/dev/Public
$env.MUSIC = ~/dev/Music
$env.PICTURES = ~/dev/Pictures
$env.VIDEOS = ~/dev/Videos
$env.DOCUMENTS = ~/dev/Documents

$env.GITUSER = "dpietersz"
$env.REPOS = ~/dev/Repos
$env.GHREPOS = ~/dev/Repos/github.com
$env.GLREPOS = ~/dev/Repos/gitlab.com
$env.AZREPOS = ~/dev/Repos/dev.azure.com

$env.BROWSER = "zen"

# Dagger - disable nag messages
if (which dagger | is-not-empty) {
  $env.DAGGER_NO_NAG = 1
}

# Load API keys from pass if available
if (which pass | is-not-empty) {
  try {
    $env.TAVILY_API_KEY = (pass show Sites/tavily.com/api-key | str trim)
    $env.ANTHROPIC_API_KEY = (pass show Sites/anthropic.com/PAT/neovim | str trim)
    $env.OPENAI_API_KEY = (pass show Sites/openai.com/api-keys/neovim | str trim)
    $env.OPENAI_KEY = $env.OPENAI_API_KEY
    $env.PERPLEXITY_API_KEY = (pass show Sites/perplexity.ai/api-key | str trim)
    $env.GEMINI_API_KEY = (pass show Sites/google.com/api-key/gemini-pro-2-5 | str trim)
    $env.GOOGLE_AI_API_KEY = $env.GEMINI_API_KEY
    $env.GOOGLE_API_KEY = $env.GEMINI_API_KEY
    $env.DATABRICKS_HOST = (pass show Logins/gemeente-hilversum/databricks/host | str trim)
    $env.DATABRICKS_SECRET = (pass show Logins/gemeente-hilversum/databricks/service-principal | lines | first)
    $env.DATABRICKS_CLIENT_ID = (pass show Logins/gemeente-hilversum/databricks/service-principal | lines | where {|line| $line =~ "client-id:" } | first | str replace "client-id: " "")
    $env.OPENROUTER_API_KEY = (pass show Sites/openrouter.ai/api-keys/aider | str trim)
    $env.DEEPSEEK_API_KEY = (pass show Sites/deepseek.com/api-key/aider | str trim)
    $env.DOCSFETCHER_API_KEY = (pass show Sites/surpassion.xyz/api-key/fetchdoc | str trim)
  } catch {
    print "Warning: Could not load all API keys from pass"
  }
} else {
  print "Install pass to load API keys securely."
}

