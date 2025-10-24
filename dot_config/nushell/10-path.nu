# 10-path.nu - PATH Management (nushell)

def prepend_path [path: string] {
  if ($path not-in $env.PATH) {
    $env.PATH = ($path | append $env.PATH)
  }
}

# Homebrew paths (macOS and Linux)
{{- if eq .chezmoi.os "darwin" }}
# macOS Homebrew
if ("/opt/homebrew/bin" | path exists) {
  prepend_path "/opt/homebrew/bin"
}
if ("/opt/homebrew/sbin" | path exists) {
  prepend_path "/opt/homebrew/sbin"
}
{{- else }}
# Linux Homebrew
if ($"($env.HOME)/.linuxbrew/bin" | path exists) {
  prepend_path $"($env.HOME)/.linuxbrew/bin"
}
if ($"($env.HOME)/.linuxbrew/sbin" | path exists) {
  prepend_path $"($env.HOME)/.linuxbrew/sbin"
}
# Fallback for system-wide Homebrew
if ("/usr/local/bin" | path exists) {
  prepend_path "/usr/local/bin"
}
{{- end }}

# Add local bin directories to PATH
if ($"($env.HOME)/.local/bin" | path exists) {
  prepend_path $"($env.HOME)/.local/bin"
}

if ($"($env.HOME)/.local/bin/scripts" | path exists) {
  prepend_path $"($env.HOME)/.local/bin/scripts"
}

# Krew (kubectl plugin manager)
if ($"($env.HOME)/.krew" | path exists) {
  prepend_path $"($env.HOME)/.krew/bin"
}

# Bazzite/Fedora Atomic - Flatpak exports
{{- if eq .chezmoi.osRelease.id "bazzite" }}
if ($"($env.HOME)/.local/share/flatpak/exports/share" | path exists) {
  prepend_path $"($env.HOME)/.local/share/flatpak/exports/share"
}
if ("/var/lib/flatpak/exports/share" | path exists) {
  prepend_path "/var/lib/flatpak/exports/share"
}
{{- end }}

