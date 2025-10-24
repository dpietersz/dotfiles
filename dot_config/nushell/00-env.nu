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
$env.CONFIG = $env.XDG_CONFIG_HOME
$env.HISTFILE = ~/.histfile
$env.HISTSIZE = 25000
$env.SAVEHIST = 25000
$env.HISTCONTROL = "ignorespace"
$env.DOTFILES = ~/dotfiles
$env.SCRIPTS = ~/.local/bin/scripts
$env.DEV = ~/dev
$env.PROJECTS = $"($env.DEV)/Projects"
$env.NOTES = $"($env.DEV)/Notes"
$env.DESKTOP = $"($env.DEV)/Desktop"
$env.DOWNLOADS = $"($env.DEV)/Downloads"
$env.TEMPLATES = $"($env.DEV)/Templates"
$env.PUBLIC = $"($env.DEV)/Public"
$env.MUSIC = $"($env.DEV)/Music"
$env.PICTURES = $"($env.DEV)/Pictures"
$env.VIDEOS = $"($env.DEV)/Videos"
$env.DOCUMENTS = $"($env.DEV)/Documents"
$env.GITUSER = "dpietersz"
$env.REPOS = $"($env.DEV)/Repos"
$env.GHREPOS = $"($env.REPOS)/github.com"
$env.GLREPOS = $"($env.REPOS)/gitlab.com"
$env.AZREPOS = $"($env.REPOS)/dev.azure.com"
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
    $env.DATABRICKS_CLIENT_ID = (pass show Logins/gemeente-hilversum/databricks/service-principal | lines | where {|line| $line