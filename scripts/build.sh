#!/bin/sh
set -eu
project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
. "$project_dir/scripts/hugo-path.sh"
cd "$project_dir"
python3 scripts/check_family.py --data-only
"$hugo_bin" --minify --cleanDestinationDir --environment production --cacheDir "$project_dir/.hugo-cache" "$@"
python3 scripts/check.py public
python3 scripts/check_family.py public
