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

panic() {
  echo "$1" >&2
  exit 1
}

usage() {
cat <<EOF >&2
usage:
  $0 [options]

description:
  build and deploy azdavis.xyz.

options:
  -h
    show this help
  -b
    do not deploy backend
EOF
exit 1
}

deploy_backend=true
while getopts 'hb' opt; do
  case "$opt" in
  (b) deploy_backend=false ;;
  (*) usage ;;
  esac
done
shift "$((OPTIND - 1))"

if [ "$#" -ne 0 ]; then
  usage
fi

cd "$(dirname "$0")"
root="$PWD"
if [ "$(git rev-parse --abbrev-ref HEAD)" = master ]; then
  panic "$PWD not on master"
fi
cd ../resistance
if [ "$(git rev-parse --abbrev-ref HEAD)" = master ]; then
  panic "$PWD not on master"
fi

echo "building frontend"
cd client
REACT_APP_SERVER="$aws_url" npm run build >/dev/null

if "$deploy_backend"; then
  echo "building backend"
  cd ../server
  GOOS="linux" go build -o application \
    -ldflags "-X main.version=$(git rev-parse HEAD)"
  zip -q application.zip application
  rm application
fi

echo "deploying frontend"
cd "$root"
rm -rf src/resistance
mv ../resistance/client/build src/resistance
npm run deploy >/dev/null 2>/dev/null
git push -q origin master

if "$deploy_backend"; then
  cd ../resistance
  echo "deploying backend"
  eb deploy --quiet
  rm server/application.zip
  git push -q origin master
fi
