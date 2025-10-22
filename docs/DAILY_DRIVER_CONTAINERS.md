# Daily-Driver Containers

Two custom distrobox containers for development and GUI applications on local systems (Bluefin, Fedora).

## Quick Start

After running `chezmoi apply`:

```bash
create-daily-drivers
```

This creates both containers and exports their GUI applications to your host.

## Containers

### daily-driver-fedora

Fedora-based container with GUI applications installed via DNF/COPR:

- **Editors**: Zed, Cursor
- **Browsers**: Zen Browser, Vivaldi
- **Tools**: Bruno (API client), Beekeeper Studio (database)
- **System**: git, pass, ffmpeg, wl-clipboard, xclip, dbus-x11

### daily-driver-arch

Arch-based container with GUI applications from AUR:

- **Apps**: Obsidian, AnyType, Polypane, Storage Explorer
- **System**: base-devel, yay, git, pass

## CLI Tools

Both containers include all CLI tools managed via mise (neovim, starship, zellij, lazygit, etc.). These are configured in your dotfiles and installed when you run `chezmoi apply` inside the container.

## Usage

### Enter a container

```bash
distrobox enter daily-driver-fedora
distrobox enter daily-driver-arch
```

### Run commands in a container

```bash
distrobox enter daily-driver-fedora -- command
distrobox enter daily-driver-arch -- command
```

### Export additional applications

If you install new GUI applications in a container:

```bash
distrobox enter daily-driver-fedora -- distrobox-export --app app-name
```

## Container Images

Container images are built in the [boxkit](https://github.com/dpietersz/boxkit) repository using GitHub Actions. Images are automatically built and pushed to GHCR on:

- Manual trigger
- Pull requests to `main`
- Pushes to `main`

## Updating Packages

### Adding/Removing GUI Applications

1. **Update the container image** in [boxkit](https://github.com/dpietersz/boxkit):
   - Modify `boxkit/packages/daily-driver-fedora.packages` or `boxkit/packages/daily-driver-arch.packages`
   - Update the corresponding build scripts in `boxkit/scripts/`
   - Push changes to trigger a new image build

2. **Update the export hooks** in this repository:
   - Edit `dot_local/share/distrobox/hooks/executable_daily-driver-fedora-export-gui.sh` or `executable_daily-driver-arch-export-gui.sh`
   - Add/remove applications from the `APPS_TO_EXPORT` array
   - Run `chezmoi apply` to deploy changes

3. **Recreate containers**:
   ```bash
   distrobox rm daily-driver-fedora daily-driver-arch
   create-daily-drivers
   ```

### Updating CLI Tools

CLI tools are managed via mise in your dotfiles. To update tool versions:

1. Edit `dot_config/mise/config.toml` in this repository
2. Run `chezmoi apply` to deploy changes
3. Inside the container, run `mise install` to update tools

## File Structure

```
dotfiles/
├── dot_config/distrobox/
│   ├── daily-driver-arch.ini.tmpl
│   └── daily-driver-fedora.ini.tmpl
├── dot_local/bin/scripts/
│   └── executable_create-daily-drivers.sh.tmpl
└── dot_local/share/distrobox/hooks/
    ├── executable_daily-driver-arch-export-gui.sh
    └── executable_daily-driver-fedora-export-gui.sh
```

## Notes

- Containers only run on local systems (not SSH, Codespaces, Docker, etc.)
- Both containers share your home directory with the host
- GUI applications are exported to your host's application menu
- Browserpass is pre-configured in the Fedora container for password management

