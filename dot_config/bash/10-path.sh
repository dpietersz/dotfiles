# 10-path.sh - PATH Management

prepend_path() { [[ ":$PATH:" != *":$1:"* ]] && export PATH="$1:$PATH"; }

if [[ -d $HOME/.local/bin ]]; then
  prepend_path "$HOME/.local/bin"
fi
