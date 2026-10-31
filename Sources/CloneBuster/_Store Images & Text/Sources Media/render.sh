#!/bin/sh
# Renders an HTML source in this folder to a PNG at its exact pixel size, on a transparent background where the page
# leaves one. The source may carry a query ("mark.html?dark").
# Usage: sh render.sh [source.html] [output.png] [width] [height]
# With no arguments, renders the four marketing images and the editor mark for both skins.
set -e
here="$(cd "$(dirname "$0")" && pwd)"
chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
cd "$here"

render()
{
  # Chrome needs absolute Windows paths for both the page and the screenshot; the query stays off the path conversion.
  page="${1%%\?*}"
  query="${1#"$page"}"
  win_out="$(cygpath -m "$here/$2" 2>/dev/null || echo "$here/$2")"
  win_src="$(cygpath -m "$here/$page" 2>/dev/null || echo "$here/$page")"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --default-background-color=00000000 --window-size="$3,$4" --screenshot="$win_out" "file:///$win_src$query" 2>/dev/null
  echo "Rendered $2"
}

if [ $# -gt 0 ]; then
  render "$1" "$2" "$3" "$4"
else
  render cover.html "../Cover 1950x1300.png" 1950 1300
  render card.html "../Card 420x280.png" 420 280
  render social.html "../Social 1200x630.png" 1200 630
  render icon.html "../Icon 160x160.png" 160 160
  render mark.html "../../Assets/CloneBuster/Editor/Icons/CloneBuster Mark.png" 32 32
  render "mark.html?dark" "../../Assets/CloneBuster/Editor/Icons/d_CloneBuster Mark.png" 32 32
fi
