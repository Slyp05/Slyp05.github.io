#!/bin/sh
# Renders every NN-*.html in this folder (or the ones named) to "../Screenshot NN.png" at 1950x1300 (the 1920x1280 page at scale 1950/1920).
# Usage: sh render.sh [01-declare.html ...]
set -e
here="$(cd "$(dirname "$0")" && pwd)"
chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
cd "$here"
[ $# -eq 0 ] && set -- [0-9][0-9]-*.html
for src in "$@"; do
  n="${src%%-*}"
  out="$(cygpath -m "$here/../Screenshot $n.png" 2>/dev/null || echo "$here/../Screenshot $n.png")"
  win_src="$(cygpath -m "$here/$src" 2>/dev/null || echo "$here/$src")"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1.015625 \
    --window-size=1920,1280 --virtual-time-budget=2000 --screenshot="$out" "file:///$win_src" 2>/dev/null
  echo "Rendered Screenshot $n.png"
done
