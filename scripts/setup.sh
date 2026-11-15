#!/bin/sh
set -eu
project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
version=0.136.5
case "$(uname -s)/$(uname -m)" in
  Darwin/*) platform=darwin-universal ;;
  Linux/x86_64) platform=linux-amd64 ;;
  Linux/aarch64|Linux/arm64) platform=linux-arm64 ;;
  *) echo 'Install Hugo 0.136.5 from https://github.com/gohugoio/hugo/releases/tag/v0.136.5' >&2; exit 1 ;;
esac
mkdir -p "$project_dir/.tools"
archive="hugo_${version}_${platform}.tar.gz"
release="https://github.com/gohugoio/hugo/releases/download/v${version}"
curl -fL "$release/$archive" -o "$project_dir/.tools/$archive"
curl -fL "$release/hugo_${version}_checksums.txt" -o "$project_dir/.tools/checksums.txt"
python3 - "$project_dir/.tools" "$archive" <<'PY'
import hashlib, pathlib, sys
folder, name = pathlib.Path(sys.argv[1]), sys.argv[2]
entries = [line.split() for line in (folder / 'checksums.txt').read_text().splitlines()]
expected = next(parts[0] for parts in entries if parts[-1].lstrip('*') == name)
actual = hashlib.sha256((folder / name).read_bytes()).hexdigest()
if actual != expected:
    raise SystemExit('Download checksum mismatch; refusing to extract.')
print('Verified Hugo download checksum.')
PY
tar -xzf "$project_dir/.tools/$archive" -C "$project_dir/.tools" hugo
"$project_dir/.tools/hugo" version
