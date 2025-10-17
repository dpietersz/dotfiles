# 99-plugins.sh - Zsh-specific plugins

# zsh-autosuggestions
if [[ -d ~/.zsh/zsh-autosuggestions ]]; then
  source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
fi

# syntax highlighting needs to be at the end because of reasons
if [[ -d ~/.zsh/zsh-syntax-highlighting ]]; then
  source ~/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
fi

