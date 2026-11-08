#!/bin/sh
# Renders an HTML source in this folder to a PNG one level up, at its exact pixel size.
# Usage: sh render.sh [source.html] [output.png] [width] [height]
# Defaults render the 1950x1300 Asset Store cover.
set -e
here="$(cd "$(dirname "$0")" && pwd)"
src="${1:-cover.html}"
out="${2:-../Cover 1950x1300.png}"
w="${3:-1950}"
h="${4:-1300}"
chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"

# Chrome needs absolute Windows paths for both the page and the screenshot.
cd "$here"
win_out="$(cygpath -m "$here/$out" 2>/dev/null || echo "$here/$out")"
# A query string (mark.html?dark) stays out of the path conversion and goes back on the URL.
page="${src%%\?*}"
query="${src#"$page"}"
win_src="$(cygpath -m "$here/$page" 2>/dev/null || echo "$here/$page")"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --default-background-color=00000000 --window-size="$w,$h" \
  --screenshot="$win_out" "file:///$win_src$query"
echo "Rendered $here/$out"
