#!/bin/sh

set -eu

cd "$(dirname "$0")"
cd ..

mkdir -p build
./node_modules/.bin/serve build >/dev/null &

sleep 1
open 'http://localhost:3000'

if command -v entr >/dev/null; then
  find src posts static package.json tsconfig.json -type f | entr ./scripts/build-and-reload.sh
fi

wait
