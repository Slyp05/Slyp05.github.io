#!/bin/sh
# Renders each NN-*.html slide in this folder to ../Screenshot NN.png at 1950x1300 with headless Chrome.
# Usage: sh render.sh [slide.html...]   (no argument: every slide)
set -e
here="$(cd "$(dirname "$0")" && pwd)"
chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
cd "$here"
[ $# -gt 0 ] || set -- [0-9][0-9]-*.html
for page in "$@"; do
  out="../Screenshot ${page%%-*}.png"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --allow-file-access-from-files \
    --window-size=1950,1300 --screenshot="$(cygpath -m "$here/$out")" "file:///$(cygpath -m "$here/$page")" 2>/dev/null
  echo "Rendered $out"
done
