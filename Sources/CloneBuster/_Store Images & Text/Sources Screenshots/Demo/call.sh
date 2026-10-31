#!/bin/sh
# call.sh 'Drive.Status()': calls the driver (Drive.cs, installed in the throwaway's Assets/CloneBuster/Review/Editor/).
d="$(cd "$(dirname "$0")" && pwd)"
printf 'return (object)%s;\n' "$1" > "$d/cs/_call.cs"
sh "$d/ev.sh" _call.cs | python -I -X utf8 -c "
import json,sys
t=sys.stdin.read()
try:
    j=json.loads(t); print(j.get('result') if j.get('success') else t)
except Exception: print(t)"
