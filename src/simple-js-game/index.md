In this tutorial, we'll build a simple game using JavaScript.

## Prerequisites

You'll need the following things installed:

-   A browser ([Chrome][], [Firefox][], [Edge][], [Safari][])
-   A text editor ([Sublime Text][], [Atom][], [Nodepad++][NodepadPP], [vim][],
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
    ├── favicon.png
    ├── index.html
    ├── script.js
    └── style.css

`script.js` is where we'll be doing all of our work.

## Sanity check

Before we proceed, we need to make sure everything is behaving as expected.

1.  Open `script.js` in your text editor. It should be empty.
2.  Open `index.html` in your browser. It should look very nice, but try
    pressing Play: nothing happens.
3.  In `script.js`, add the following code: `alert(1)`.
4.  Reload `index.html` in your browser. You should get an alert that says `1`.
5.  Delete the `alert(1)` from `script.js`, and reload `index.html`. This time,
    there should be no alert.

Great! Now, we can finally start implementing this game.

## Close everything into one scope

This step may seem a little arcane, but it's useful. We define a big function
that we'll put everything into, then immediately call it. The fancy name for
this "big function" is and _immediately-invoked functional expression_ or IIFE.

    @@ -0,0 +1,5 @@
    +// seal all the vars and functions into a contained scope.
    +(function () {
    +
    +// end of the scope.
    +})()

What's the point of this? One reason is that if you didn't, and you had some
`var important = "thing"`, a user could open up the developer tools in their
browser and view, and even change, `important`.

[Read more about IIFEs.][1]

[1]: http://benalman.com/news/2010/11/immediately-invoked-function-expression

## Add strict mode

This, too, may seem a little abstract, but it, too, is useful. We simply add
the string `"use strict"` inside the IIFE, at the top.

    @@ -1,5 +1,8 @@
     // seal all the vars and functions into a contained scope.
     (function () {

    +// enable strict mode.
    +"use strict"
    +
     // end of the scope.
     })()

Why? Roughly, it prevents some common mistakes and make unavailable to us some
dangerous language features. This may sound bad - why, one might ask, would we
want _less_ features? - but it's probably better this way.

[Read more about strict mode.][2]

[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

## Get access to some elements

There are some elements declared in the HTML document that we need to access
and modify the properties of for our game to work. Take a look at `index.html`
with your text editor and notice a few things have `id="..."` - those are the
ones we want. Important note: no two elements can have the same `id`. We'll
shortly see why.

We use the `getElementById` method of `document`, a global variable available
to us that represents the current document (surprise). `getElementById` takes a
string - the ID of the element we want - and returns an element, or `null` if
no element could be found.

    @@ -4,5 +4,12 @@
     // enable strict mode.
     "use strict"

    +// some elements declared in the HTML document.
    +var intro = document.getElementById("intro")
    +var controls = document.getElementById("controls")
    +var rows = document.getElementById("rows")
    +var cols = document.getElementById("cols")
    +var game = document.getElementById("game")
    +
     // end of the scope.
     })()

It's clear, then, why `id`s must be unique: if two elements had the same `id`,
`document.getElementById` wouldn't know which one to return.

## Add some globals

Shudder! Global variables! Fortunately, some of them will never change, i.e.,
they're actually global _constants_. Those aren't as bad, since it's really
_changing_ global variables one should worry about, since it's hard to know the
state of your program at any given point when you have lots of stuff changing
at once.

    @@ -11,5 +11,19 @@
     var cols = document.getElementById("cols")
     var game = document.getElementById("game")

    +// some constants (warning: hard-coded in other files like style.css).
    +var RED = "r"
    +var GREEN = "g"
    +var BLUE = "b"
    +var TILE_WIDTH = 56
    +var BODY_PADDING = 20
    +
    +// the board (a 2d array of RED, GREEN, and BLUE).
    +var board
    +
    +// the number of GREENs and BLUEs in the board.
    +var greens
    +var blues
    +
     // end of the scope.
     })()

By convention, one writes variable names in `UPPER_SNAKE_CASE` when they're
constants, but, as you can see from the `var` right before each one, it's still
technically a variable and could be reassigned. The burden is on us, then to
recognize the `UPPER_SNAKE_CASE` as a warning _not_ to do so.
