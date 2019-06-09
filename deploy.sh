#!/bin/sh

set -eux

# This script manages the building and deploying of azdavis.xyz. It assumes that
# you have:
# - npm, go, eb, git, and zip into your $PATH.
# - cloned https://github.com/azdavis/resistance next to this repo.
# - set up eb to be able to deploy to the URL below.
aws_url="wss://resistance-backend.azdavis.xyz"
# If you only want to deploy www.azdavis.xyz (which is just a static site hosted
# on netlify) without deploying anything to $aws_url, just `npm run deploy`
# should be enough. Just make sure you do that while src/resistance exists.

cd "$(dirname "$0")"
root="$PWD"
[ "$(git rev-parse --abbrev-ref HEAD)" = master ]

cd ../resistance
[ "$(git rev-parse --abbrev-ref HEAD)" = master ]

cd client
REACT_APP_WS_URL="$aws_url" npm run build

cd ../server
GOOS="linux" go build -o application \
  -ldflags "-X main.env=prod -X main.version=$(git rev-parse HEAD)"
zip -q application.zip application
rm application

cd "$root"
rm -rf src/resistance
mv ../resistance/client/build src/resistance
npm run deploy
git push origin master

cd ../resistance
eb deploy
git push origin master
