#!/bin/sh

set -eu

cd "$(dirname "$0")"
cd ..

./node_modules/.bin/tsc
node ./out/build.js

app_running() {
  command -v pgrep >/dev/null && pgrep "$1" >/dev/null
}

if app_running 'Google Chrome'; then
  osascript -e 'tell application "Google Chrome"
    tell the active tab of its first window
      reload
    end tell
  end tell'
fi

if app_running 'Safari'; then
  osascript -e 'tell application "Safari"
    set tmp to URL of document 1
    set URL of document 1 to tmp
  end tell'
fi
