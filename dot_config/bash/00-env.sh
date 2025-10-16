# 00-env.sh - Basic Environment variables

# (neo)vim
if command -v nvim >/dev/null; then
  export EDITOR=nvim
  export VISUAL=nvim
elif command -v vim >/dev/null; then
  export EDITOR=vim
  export VISUAL=vim
fi

export XDG_CONFIG_HOME="$HOME/.config"
export CONFIG="$XDG_CONFIG_HOME"
export HISTFILE="$HOME/.histfile"
export HISTSIZE=25000
export SAVEHIST=25000
export HISTCONTROL=ignorespace

export DOTFILES="$HOME/dotfiles"
export SCRIPTS="$DOTFILES/dot_local/executable_bin"

export DEV="$HOME/Dev"
export PROJECTS="$DEV/Projects"
export NOTES="$DEV/Notes"

export GITUSER="dpietersz"
export REPOS="$DEV/Repos"
export GHREPOS="$REPOS/github.com"
export GLREPOS="$REPOS/gitlab.com"
export AZREPOS="$REPOS/dev.azure.com"

export BROWSER="zen"

if command -v pass &>/dev/null; then
  export TAVILY_API_KEY="$(pass show Sites/tavily.com/api-key)"
  export ANTHROPIC_API_KEY="$(pass show Sites/anthropic.com/PAT/neovim)"
  export OPENAI_API_KEY="$(pass show Sites/openai.com/api-keys/neovim)"
  export OPENAI_KEY="$OPENAI_API_KEY"
  export PERPLEXITY_API_KEY="$(pass show Sites/perplexity.ai/api-key)"
  export GEMINI_API_KEY="$(pass show Sites/google.com/api-key/gemini-pro-2-5)"
  export GOOGLE_AI_API_KEY="$GEMINI_API_KEY"
  export GOOGLE_API_KEY="$GEMINI_API_KEY"
  export DATABRICKS_HOST="$(pass show Logins/gemeente-hilversum/databricks/host)"
  export DATABRICKS_SECRET="$(pass show Logins/gemeente-hilversum/databricks/service-principal | grep -m 1 '^')"
  export DATABRICKS_CLIENT_ID="$(pass show Logins/gemeente-hilversum/databricks/service-principal | grep "client-id:" | cut -d ' ' -f 2)"
  export OPENROUTER_API_KEY="$(pass show Sites/openrouter.ai/api-keys/aider)"
  export DEEPSEEK_API_KEY="$(pass show Sites/deepseek.com/api-key/aider)"
  export DOCSFETCHER_API_KEY="$(pass show Sites/surpassion.xyz/api-key/fetchdoc)"
else
  echo "Install pass to load API keys securely."
fi
