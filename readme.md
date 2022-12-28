# azdavis.net

A place for stuff

## Setup

- Install node + npm.
- (Optional) Install `entr` for auto-reloading.

## Dev

Run `scripts/dev.sh` to run a local dev server.

It will set up auto-reloading for when files in `posts` change. However, it will **not** auto-reload if the build script changes.

The build script is built only once, when the dev server starts up. To rebuild it, re-run the dev script.

## Deploy

This site is deployed with Netlify whenever I push to the main branch.
