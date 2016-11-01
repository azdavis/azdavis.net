In this tutorial, we'll build a simple game using JavaScript.

## Prerequisites

You'll need the following things installed:

- A browser ([Chrome][], [Firefox][], [Edge][], [Safari][])
- A text editor ([Sublime Text][], [Atom][], [Nodepad++][NodepadPP], [vim][],
  [emacs][], [ed][]...)

[Chrome]: https://www.google.com/chrome
[Firefox]: https://www.mozilla.org/en-US/firefox/products
[Edge]: https://www.microsoft.com/en-us/windows/microsoft-edge/microsoft-edge
[Safari]: http://www.apple.com/safari
[Sublime Text]: https://www.sublimetext.com
[Atom]: https://atom.io
[NodepadPP]: https://notepad-plus-plus.org
[vim]: http://www.vim.org
[emacs]: https://www.gnu.org/software/emacs
[ed]: https://www.gnu.org/fun/jokes/ed-msg.en.html

## Starter code

You need more than just JavaScript to make a webpage. However, this lab focuses
on only the JavaScript component. Bearing that in mind, you'll want some
starter code. The starter code takes care of all the stuff you aren't being
taught how to do in this lab.

Unzip [`starter.zip`](starter.zip) to yield:

    starter
    ├── src
    │   ├── favicon.png
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    ├── .gitignore
    ├── license.md
    └── readme.md

`script.js` is where we'll be doing all of our work.

## Sanity check

Before we proceed, we need to make sure everything's behaving as expected.

1. Open `script.js` in your text editor. It should be empty.
2. Open `index.html` in your browser. It should look very nice, but try
   pressing Play: nothing happens.
3. In `script.js`, add the following code: `alert(1)`.
4. Reload `index.html` in your browser. You should get an alert that says `1`.
5. Delete the `alert(1)` from `script.js`, and reload `index.html`. This time,
   there should be no alert.

Great! Now, we can finally start implementing this game.
