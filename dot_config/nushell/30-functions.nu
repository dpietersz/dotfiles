# 30-functions.nu — Custom Shell Functions (nushell)

# ------------------------------
# Archive Helpers
# ------------------------------

def extract [file: string] {
  let extension = ($file | path parse | get extension)
  let output_dir = ($file | path parse | get stem)

  print $"Extracting '($file)' to '($output_dir)'"

  match $extension {
    "gz" => {
      mkdir $output_dir
      tar -xzf $file -C $output_dir
    }
    "bz2" => {
      mkdir $output_dir
      tar -xjf $file -C $output_dir
    }
    "zip" => {
      mkdir $output_dir
      unzip -q $file -d $output_dir
    }
    _ => {
      print $"Unsupported file type: .($extension)"
      return 1
    }
  }
}

def compress_current_folder [] {
  let folder = (pwd | path parse | get stem)
  let parent = (pwd | path dirname)
  let zipfile = $"($parent)/($folder).zip"

  print $"Compressing '($folder)' → '($zipfile)'"
  zip -r $zipfile . | ignore
  print "Done."
}

# ------------------------------
# Git Clone Helpers
# ------------------------------

def clone [input: string] {
  let gitlab_groups = [
    "homelab-pietersz"
    "surpassion.io"
    "pietersz-personal-tools"
    "roos81"
    "my-coursematerial"
  ]

  # Parse SSH or HTTPS URL
  let parsed = if ($input =~ "^git@") {
    let without_prefix = ($input | str replace "^git@" "")
    let host = ($without_prefix | str replace ":.*" "")
    let repo = ($without_prefix | str replace "^[^:]*:" "")
    {ssh: true, host: $host, repo: $repo}
  } else {
    let without_prefix = ($input | str replace "^https://" "")
    let host = ($without_prefix | str replace "/.*" "")
    let repo = ($without_prefix | str replace "^[^/]*/" "")
    {ssh: false, host: $host, repo: $repo}
  }

  # Extract namespace and repo name
  let namespace = ($parsed.repo | str replace "/.*" "")
  let repo_name = ($parsed.repo | str replace "^.*/" "" | str replace ".git$" "")

  # Determine destination directory
  let parent_dir = if ($parsed.host == "github.com" and $namespace == $env.GITUSER) {
    $env.PROJECTS
  } else if ($parsed.host == "gitlab.com" and ($namespace in $gitlab_groups)) {
    $env.PROJECTS
  } else {
    $"($env.REPOS)/($parsed.host)/($namespace)"
  }

  let dest_path = $"($parent_dir)/($repo_name)"

  # Clone or enter if already cloned
  if ($dest_path | path exists) {
    cd $dest_path
    return
  }

  # Prepare target directory
  mkdir $parent_dir
  cd $parent_dir

  # Compose full URL
  let repo_url = if $parsed.ssh {
    $"git@($parsed.host):($namespace)/($repo_name).git"
  } else {
    $"https://($parsed.host)/($namespace)/($repo_name)"
  }

  print $"Cloning: ($repo_url) → ($dest_path)"
  git clone $repo_url --recurse-submodules
  cd $repo_name
}

# ------------------------------
# Image Processing
# ------------------------------

def webjpeg [input: string, size: string, output: string] {
  magick $input -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace sRGB -resize $size $output
}

def cropjpeg [input: string, crop_spec: string, output: string] {
  magick $input -gravity center -crop $crop_spec $output
}

# ------------------------------
# Markdown / Pandoc Helper
# ------------------------------

def html_to_md [input: string] {
  if ($input | is-empty) {
    print "Usage: html_to_md <filename.html>"
    return 1
  }

  let base = ($input | str replace ".html$" "")
  let input_dir = ($input | path dirname)

  pandoc --resource-path=$input_dir -f html -t markdown $input -o $"($base).md"
}

