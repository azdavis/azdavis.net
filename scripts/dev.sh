#!/bin/sh

set -eu

cd "$(dirname "$0")"
cd ..

mkdir -p build
./node_modules/.bin/serve build >/dev/null &
./node_modules/.bin/tsc
open 'http://localhost:3000'

if command -v entr >/dev/null; then
  find posts static -type f | entr ./scripts/build-and-reload.sh
fi

wait
