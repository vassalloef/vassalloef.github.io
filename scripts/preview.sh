#!/bin/sh
set -eu
project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
. "$project_dir/scripts/hugo-path.sh"
cd "$project_dir"
exec "$hugo_bin" server --bind 127.0.0.1 --baseURL http://localhost:1313/ --port 1313 --disableFastRender --renderToMemory --cacheDir "$project_dir/.hugo-cache" "$@"
