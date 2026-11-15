#!/bin/sh
# Source from another script after setting project_dir.
if [ -n "${HUGO_BIN:-}" ]; then
  hugo_bin="$HUGO_BIN"
elif [ -x "$project_dir/.tools/hugo" ]; then
  hugo_bin="$project_dir/.tools/hugo"
elif [ -x "$project_dir/../.tools/hugo" ]; then
  hugo_bin="$project_dir/../.tools/hugo"
elif command -v hugo >/dev/null 2>&1; then
  hugo_bin="$(command -v hugo)"
else
  echo 'Hugo is missing. Run: sh scripts/setup.sh' >&2
  exit 1
fi
