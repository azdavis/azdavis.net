# azdavis.net

A place for stuff

## Setup

- Install node + npm.
- Install deps with `npm i`.
- (Optional) Install `entr` for auto-reloading support in the dev script.

## Development

Run `scripts/dev.sh` to run a local dev server.

It will set up auto-reloading for when files in `posts` change. However, it will **not** auto-reload if the build script or static files (like CSS) change.

The build script is built only once, when the dev server starts up. To rebuild it, re-run the dev script.

## Deploy

This site is deployed with Netlify whenever I push to the main branch.
