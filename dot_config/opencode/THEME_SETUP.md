# OpenCode Theme Setup

## Current Theme: kanagawa

The config is set to use the `kanagawa` theme to match your Neovim and Zellij configurations.

## Testing the Theme

To verify if the kanagawa theme is available:

1. Start OpenCode:
   ```bash
   opencode
   ```

2. Press `Ctrl+x t` to open the theme selector

3. Look for `kanagawa` in the list

## Fallback Options

If `kanagawa` is not available in OpenCode, here are compatible dark themes to try (in order of similarity):

1. **gruvbox-dark** - Warm, retro colors (similar aesthetic)
2. **tokyo-night** - Dark blue theme (good alternative)
3. **catppuccin-mocha** - Pastel dark theme (currently your backup)
4. **nord** - Cool, arctic-themed colors
5. **dracula** - Purple-based dark theme

## Manually Setting Theme

Edit `dot_config/opencode/dot_opencode.json` and change the theme field:

```json
{
  "theme": "gruvbox-dark"
}
```

Then run:
```bash
chezmoi apply
```

## Available Themes

To see all available themes in OpenCode, run:

```bash
opencode
# Then press Ctrl+x t
```

Or check the OpenCode documentation for the full theme list.
