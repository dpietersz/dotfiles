# Themes

Per-app theming managed by `~/.local/bin/theme-switch`. Palettes are the
source of truth; per-app templates use `@key@` placeholders that get
substituted on every switch. State (active theme) lives in `state/current`.

## Available themes

- **gruvbox-dark** (default)
- **rose-pine**

## Per-app coverage (reliable)

kitty · niri (focus ring) · zellij · starship · nvim · fzf · bat · noctalia
(theme + wallpaper)

## Wallpapers

Each palette names a `wallpaper_dir` and `wallpaper_default`. On theme switch
those values are written into Noctalia's state file.

Both palettes' wallpapers live INSIDE the chezmoi tree:

- **gruvbox-dark** → source `dot_config/themes/wallpapers/gruvbox-dark/`,
  deployed to `~/.config/themes/wallpapers/gruvbox-dark/`.
- **rose-pine** → source `dot_config/themes/wallpapers/rose-pine/`,
  deployed to `~/.config/themes/wallpapers/rose-pine/`.

Add wallpapers by dropping files into the source directory and running
`chezmoi apply`. The legacy `~/dev/Pictures/Wallpapers/dark/` directory is no
longer referenced by the active palettes.

## Keybindings (niri)

- `Mod+Ctrl+\` — cycle to next theme
- `Mod+Ctrl+Shift+\` — fzf picker

## Adding a theme

1. Create `palettes/<name>.toml` (copy from gruvbox-dark or rose-pine).
2. If starship needs a different format string, drop `starship/<name>.toml`.
3. Drop wallpapers under `~/dev/Pictures/Wallpapers/<name>/`.
4. Run `theme-switch <name>` to activate.
