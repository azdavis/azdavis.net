#!/bin/sh

set -eu

cd "$(dirname "$0")"
cd ..

./node_modules/.bin/tsc
./node_modules/.bin/serve build &
pid="$!"

if command -v entr >/dev/null; then
  find posts static -type f | entr ./scripts/build-and-reload.sh
else
  ./scripts/build-and-reload.sh
fi

wait "$pid"
