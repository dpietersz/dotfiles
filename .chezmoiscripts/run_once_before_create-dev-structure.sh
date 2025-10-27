#!/bin/bash
{{- if not .remote }}

mkdir -p "$HOME/dev/Desktop"
mkdir -p "$HOME/dev/Documents"
mkdir -p "$HOME/dev/Downloads"
mkdir -p "$HOME/dev/Templates"
mkdir -p "$HOME/dev/Public"
mkdir -p "$HOME/dev/Music"
mkdir -p "$HOME/dev/Pictures"
mkdir -p "$HOME/dev/Pictures/Screenshots"
mkdir -p "$HOME/dev/Videos"
mkdir -p "$HOME/dev/Notes"
mkdir -p "$HOME/dev/Repos/github.com"
mkdir -p "$HOME/dev/Repos/gitlab.com"
mkdir -p "$HOME/dev/Repos/dev.azure.com"
mkdir -p "$HOME/dev/Projects"
{{- end }}
