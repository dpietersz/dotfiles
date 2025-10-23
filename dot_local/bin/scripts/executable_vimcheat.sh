#!/bin/bash

# Gruvbox ANSI Colors
key_color="\e[1;33m"  # bright yellow for keys
desc_color="\e[0;37m" # light gray for descriptions
reset="\e[0m"

echo -e "${key_color}dap${reset}  - ${desc_color}delete around current paragraph${reset}"
echo -e "${key_color}dip${reset}  - ${desc_color}delete current paragraph${reset}"
echo -e "${key_color}diw${reset}  - ${desc_color}delete current word${reset}"
echo -e "${key_color}daw${reset}  - ${desc_color}delete around current word${reset}"
echo -e "${key_color}diW${reset}  - ${desc_color}delete current larger word (ex: --foo-bar)${reset}"
echo -e "${key_color}daW${reset}  - ${desc_color}delete around current larger word${reset}"
echo -e "${key_color}yap${reset}  - ${desc_color}yank around current paragraph${reset}"
echo -e "${key_color}yip${reset}  - ${desc_color}yank current paragraph${reset}"
echo -e "${key_color}ea ${reset}  - ${desc_color}append to current word${reset}"
echo -e "${key_color}cw ${reset}  - ${desc_color}change to end of current word${reset}"
echo -e "${key_color}ciw${reset}  - ${desc_color}change current word${reset}"
echo -e "${key_color}caw${reset}  - ${desc_color}change around current word${reset}"
echo -e "${key_color}dw ${reset}  - ${desc_color}delete to beginning of next word${reset}"
echo -e "${key_color}daf${reset}  - ${desc_color}delete current function${reset}"
echo -e "${key_color}yaf${reset}  - ${desc_color}yank current function${reset}"
echo -e "${key_color}dif${reset}  - ${desc_color}delete current inner function${reset}"
echo -e "${key_color}yif${reset}  - ${desc_color}yank current inner function${reset}"
echo -e "${key_color}dd${reset}   - ${desc_color}delete the current line${reset}"
echo -e "${key_color}gqip${reset} - ${desc_color}wrap the current paragraph${reset}"
echo -e "${key_color}gqap${reset} - ${desc_color}wrap around the current paragraph${reset}"
echo -e "${key_color}>ip${reset}  - ${desc_color}indent the current paragraph${reset}"
echo -e "${key_color}<ip${reset}  - ${desc_color}dedent the current paragraph${reset}"
echo -e "${key_color}!ip${reset}  - ${desc_color}send the current paragraph to shell command${reset}"
