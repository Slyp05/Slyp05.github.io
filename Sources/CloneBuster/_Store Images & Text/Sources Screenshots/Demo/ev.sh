#!/bin/sh
# ev.sh <file.cs> [sed-expr...]: runs a C# file in the throwaway Editor, with placeholder substitutions.
d="$(cd "$(dirname "$0")" && pwd)"; f="$1"; shift
case "$f" in /*|[A-Za-z]:*) ;; *) f="$d/cs/$f";; esac
cp "$f" "$d/cs/_now.cs"
for e in "$@"; do sed -i "$e" "$d/cs/_now.cs"; done
unity command --project-path "D:/Unity Projects (bis)/CloneBuster - Screenshots (throwaway)" --timeout 180 --result-only eval_file --file "$(cygpath -w "$d/cs/_now.cs")"
