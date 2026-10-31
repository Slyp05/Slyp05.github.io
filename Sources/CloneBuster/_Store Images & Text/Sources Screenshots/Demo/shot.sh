#!/bin/sh
# shot.sh <WindowTypeName> <out.png>: grabs an Editor window off-screen, flipped upright.
d="$(cd "$(dirname "$0")" && pwd)"
out="$(cygpath -m "$2")"
esc="$(printf '%s' "$out" | sed 's/[&|]/\\&/g')"
sh "$d/ev.sh" grab.cs "s/__TYPE__/$1/g" "s|__OUT__|$esc|" | grep -E '"result"|"message"'
python -I -c "import sys;from PIL import Image,ImageOps;p=sys.argv[1];ImageOps.flip(Image.open(p).convert('RGB')).save(p)" "$out"
