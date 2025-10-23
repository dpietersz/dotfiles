#!/bin/bash

cheat() {
  path="$1"
  shift

  for arg in "$@"; do
    path="$path/$arg"
  done

  curl -sS "http://cht.sh/$path"
}

cheat "$@"
