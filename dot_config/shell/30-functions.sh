# 30-functions.sh — Custom Shell Functions (shared between bash and zsh)

# ------------------------------
# Archive Helpers
# ------------------------------

extract() {
  local file=$1
  local extension="${file##*.}"
  local output_dir="${file%.*}"

  echo "Extracting '$file' to '$output_dir'"

  case $extension in
  gz) mkdir -p "$output_dir" && tar -xzf "$file" -C "$output_dir" ;;
  bz2) mkdir -p "$output_dir" && tar -xjf "$file" -C "$output_dir" ;;
  zip) mkdir -p "$output_dir" && unzip -q "$file" -d "$output_dir" ;;
  *) echo "Unsupported file type: .$extension" && return 1 ;;
  esac
}

compress_current_folder() {
  local folder=$(basename "$(pwd)")
  local parent=$(dirname "$(pwd)")
  local zipfile="$parent/$folder.zip"

  echo "Compressing '$folder' → '$zipfile'"
  zip -r "$zipfile" . >/dev/null
  echo "Done."
}

# ------------------------------
# Git Clone Helpers
# ------------------------------

clone() {
  local input="$1"
  local ssh_url=false host namespace repo_name repo_url parent_dir dest_path

  # Define your GitLab namespaces
  local -a GITLAB_OWN_GROUPS=(
    homelab-pietersz
    surpassion.io
    pietersz-personal-tools
    roos81
    my-coursematerial
  )

  # Detect SSH or HTTPS and extract host + path
  if [[ "$input" =~ ^git@ ]]; then
    ssh_url=true
    input="${input#git@}" # Remove 'git@'
    host="${input%%:*}"   # Host is before ':'
    repo="${input#*:}"    # Path is after ':'
  else
    input="${input#https://}" # Remove 'https://'
    host="${input%%/*}"       # Host is before first '/'
    repo="${input#*/}"        # Path is after host
  fi

  # Extract namespace (user/group) and repo name
  namespace="${repo%%/*}"
  repo_name="${repo##*/}"
  repo_name="${repo_name%.git}" # Strip .git

  # Determine destination directory
  if [[ "$host" == "github.com" && "$namespace" == "$GITUSER" ]]; then
    parent_dir="$PROJECTS"
  elif [[ "$host" == "gitlab.com" ]]; then
    for group in "${GITLAB_OWN_GROUPS[@]}"; do
      if [[ "$namespace" == "$group" ]]; then
        parent_dir="$PROJECTS"
        break
      fi
    done
  fi

  # Default fallback
  : "${parent_dir:=$REPOS/$host/$namespace}"

  dest_path="$parent_dir/$repo_name"

  # Clone or enter if already cloned
  if [[ -d "$dest_path" ]]; then
    cd "$dest_path" || return 1
    return
  fi

  # Prepare target directory
  mkdir -p "$parent_dir" && cd "$parent_dir" || return 1

  # Compose full URL
  if [[ "$ssh_url" == true ]]; then
    repo_url="git@$host:$namespace/$repo_name.git"
  else
    repo_url="https://$host/$namespace/$repo_name"
  fi

  echo "Cloning: $repo_url → $dest_path"
  git clone "$repo_url" --recurse-submodules
  cd "$repo_name" || return 1
}

# ------------------------------
# Image Processing
# ------------------------------

webjpeg() {
  magick "$1" -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace sRGB -resize "$2" "$3"
}

cropjpeg() {
  magick "$1" -gravity center -crop "$2" "$3"
}

# ------------------------------
# Markdown / Pandoc Helper
# ------------------------------

html_to_md() {
  [[ $# -ne 1 ]] && echo "Usage: html_to_md <filename.html>" && return 1
  local input="$1"
  local base="${input%.html}"
  pandoc --resource-path="$(dirname "$input")" -f html -t markdown "$input" -o "${base}.md"
}

