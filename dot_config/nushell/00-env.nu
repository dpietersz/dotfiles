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
$env.XDG_CONFIG_HOME = ([$env.HOME .config] | path join)
$env.CONFIG = $env.XDG_CONFIG_HOME
$env.HISTFILE = ([$env.HOME .histfile] | path join)
$env.HISTSIZE = 25000
$env.SAVEHIST = 25000
$env.HISTCONTROL = "ignorespace"
$env.DOTFILES = ([$env.HOME dotfiles] | path join)
$env.SCRIPTS = ([$env.HOME .local bin scripts] | path join)
$env.DEV = ([$env.HOME dev] | path join)
$env.PROJECTS = ([$env.DEV Projects] | path join)
$env.NOTES = ([$env.DEV Notes] | path join)
$env.DESKTOP = ([$env.DEV Desktop] | path join)
$env.DOWNLOADS = ([$env.DEV Downloads] | path join)
$env.TEMPLATES = ([$env.DEV Templates] | path join)
$env.PUBLIC = ([$env.DEV Public] | path join)
$env.MUSIC = ([$env.DEV Music] | path join)
$env.PICTURES = ([$env.DEV Pictures] | path join)
$env.VIDEOS = ([$env.DEV Videos] | path join)
$env.DOCUMENTS = ([$env.DEV Documents] | path join)
$env.GITUSER = "dpietersz"
$env.REPOS = ([$env.DEV Repos] | path join)
$env.GHREPOS = ([$env.REPOS github.com] | path join)
$env.GLREPOS = ([$env.REPOS gitlab.com] | path join)
$env.AZREPOS = ([$env.REPOS dev.azure.com] | path join)
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
    $env.DATABRICKS_CLIENT_ID = (pass show Logins/gemeente-hilversum/databricks/service-principal | lines | where {|line| $line | str contains "client-id:" } | first | str replace "client-id: " "")
    $env.OPENROUTER_API_KEY = (pass show Sites/openrouter.ai/api-keys/aider | str trim)
    $env.DEEPSEEK_API_KEY = (pass show Sites/deepseek.com/api-key/aider | str trim)
    $env.DOCSFETCHER_API_KEY = (pass show Sites/surpassion.xyz/api-key/fetchdoc | str trim)
  } catch {
    print "Warning: Could not load all API keys from pass"
  }
} else {
  print "Install pass to load API keys securely."
}