#!/bin/sh

set -eu

cd "$(dirname "$0")"
cd ..

./node_modules/.bin/tsc
./node_modules/.bin/serve build &
sleep 1
open 'http://localhost:3000'

if command -v entr >/dev/null; then
  find posts static -type f | entr ./scripts/build-and-reload.sh
fi

wait
