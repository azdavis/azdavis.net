#!/bin/sh

set -eu

# This script manages the building and deploying of azdavis.xyz. It assumes that
# you have:
# - npm, go, eb, git, and zip into your $PATH.
# - cloned https://github.com/azdavis/resistance next to this repo.
# - set up eb to be able to deploy to the URL below.
aws_url="wss://resistance-backend.azdavis.xyz"
# If you only want to deploy www.azdavis.xyz (which is just a static site hosted
# on netlify) without deploying anything to $aws_url, just `npm run deploy`
# should be enough. Just make sure you do that while src/resistance exists.

usage() {
cat <<EOF >&2
usage:
  $0 [options]

description:
  build and deploy azdavis.xyz.

options:
  -h
    show this help
  -n
    do not deploy a new resistance backend
EOF
exit 1
}

deploy_resistance=true
while getopts 'hn' opt; do
  case "$opt" in
  (n) deploy_resistance=false ;;
  (*) usage ;;
  esac
done
shift "$((OPTIND - 1))"

if [ "$#" -ne 0 ]; then
  usage
fi

cd "$(dirname "$0")"
root="$PWD"
[ "$(git rev-parse --abbrev-ref HEAD)" = master ]

cd ../resistance
[ "$(git rev-parse --abbrev-ref HEAD)" = master ]

cd client
REACT_APP_BACKEND="$aws_url" npm run build >/dev/null

if "$deploy_resistance"; then
  cd ../server
  GOOS="linux" go build -o application \
    -ldflags "-X main.version=$(git rev-parse HEAD)"
  zip -q application.zip application
  rm application
fi

cd "$root"
rm -rf src/resistance
mv ../resistance/client/build src/resistance
npm run deploy >/dev/null 2>/dev/null
git push -q origin master

cd ../resistance
if "$deploy_resistance"; then
  eb deploy --quiet
  rm server/application.zip
fi
git push -q origin master
