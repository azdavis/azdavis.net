In this tutorial, we'll build a simple game using JS.

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

You need more than just JS to make a webpage. However, this lab focuses on only
the JS component. Bearing that in mind, you'll want some starter code. The
starter code takes care of all the stuff you aren't being taught how to do in
this lab.

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

## Generate a new board

We need a function that, given a number of rows and columns, generates a new
game board with that many rows and columns. We'll call it `genNewBoard`.

    @@ -25,5 +25,25 @@
     var greens
     var blues

    +// genNewBoard(r: number, c: number): void
    +// REQUIRES: r > 0 and c > 0.
    +// ENSURES: set board to a new 2d array with r rows and c columns, with all
    +// elements BLUE except the top-left which is GREEN. also update greens and
    +// blues to correspond.
    +function genNewBoard(r, c) {
    +    board = []
    +    greens = blues = 0
    +    for (var i = 0; i < r; i++) {
    +        board[i] = []
    +        for (var j = 0; j < c; j++) {
    +            board[i][j] = BLUE
    +            blues++
    +        }
    +    }
    +    board[0][0] = GREEN
    +    blues--
    +    greens++
    +}
    +
     // end of the scope.
     })()

Note the type signature we gave the function. We read

    genNewBoard(r: number, c: number): void

as

> `genNewBoard` is a function that takes two `number` parameters and returns
> `void`.

Note also the `REQUIRES` and `ENSURES` we gave. `REQUIRES` describes the
preconditions that must be satisfied _before_ we call the function, and
`ENSURES` describes the postconditions that are guaranteed to be satisfied
_after_ we call the function.

## Try to change a tile

We need a function that, given a row and a column, tries to switch the tile to
blue if it's green, or to green if it's blue. We'll call it `tryChangeTile`.

    @@ -45,5 +45,25 @@
         greens++
     }

    +// tryChangeTile(r: number, c: number): void
    +// REQUIRES: nothing.
    +// ENSURES: if r or c is not a valid row or column of board then return, else
    +// set the tile at row r and column c of board to its new color as defined by
    +// the game rules. also update greens and blues to correspond.
    +function tryChangeTile(r, c) {
    +    if (r < 0 || r >= board.length || c < 0 || c >= board[r].length) {
    +        return
    +    }
    +    if (board[r][c] === GREEN) {
    +        board[r][c] = BLUE
    +        greens--
    +        blues++
    +    } else if (board[r][c] === BLUE) {
    +        board[r][c] = GREEN
    +        blues--
    +        greens++
    +    }
    +}
    +
     // end of the scope.
     })()

Notice how the function name has a prefix `try`. That's a signal to us that
this function can "fail." Look carefully at the first if statement and you'll
see why. We return without doing anything if the `r` or `c` given to use wasn't
a valid row or column.

Why did we not require `r` and `c` to be valid with our `REQUIRES`? We're about
to find out.

## Try to change the board

We need a function that, given a row and a column, tries to switch that tile to
red, and the surrounding tiles to their colors. We'll call it `tryChangeBoard`.

    @@ -65,5 +65,23 @@
         }
     }

    +// tryChangeBoard(r: number, c: number): boolean
    +// REQUIRES: 0 <= r < number of rows and 0 <= c < number of columns.
    +// ENSURES: if the tile at row r and column c of board is not GREEN then return
    +// false, else set it to RED and update surrounding tiles as defined by the
    +// rules and return true. also update greens and blues to correspond.
    +function tryChangeBoard(r, c) {
    +    if (board[r][c] !== GREEN) {
    +        return false
    +    }
    +    board[r][c] = RED
    +    greens--
    +    tryChangeTile(r + 1, c)
    +    tryChangeTile(r - 1, c)
    +    tryChangeTile(r, c + 1)
    +    tryChangeTile(r, c - 1)
    +    return true
    +}
    +
     // end of the scope.
     })()

We now see why we didn't require `r` and `c` to be valid in `tryChangeTile`.
It's because it's just easier to call `tryChangeTile` with each possible
coordinate for a neighboring tile, and let `tryChangeTile` figure out if it was
a valid tile or not, instead of having repetitive if-statements at the call
site.

Note that `tryChangeBoard` also returns whether or not it was able to change
the board. As we'll see later, it turns out that's valuable information to us.

## Try to end the game

We need a function that tries to end the game. We'll call it `tryEndGame`.

    @@ -83,5 +83,22 @@
         return true
     }

    +// tryEndGame(): void
    +// REQUIRES: nothing.
    +// ENSURES: if greens !== 0 then return, else if blues === 0 then show a win
    +// message, else show a lose message. then show the game-start controls and
    +// hide the board.
    +function tryEndGame() {
    +    if (greens !== 0) {
    +        return
    +    }
    +    if (blues === 0) {
    +        alert("yay! you won!")
    +    } else {
    +        alert("darn. you lost.")
    +    }
    +    intro.style.display = game.style.display = rows.value = cols.value = ""
    +}
    +
     // end of the scope.
     })()

Note the last line, with all the `.style.display` and `.value`. `.style` is a
property of all DOM elements, which allows us to apply CSS styles to elements
from JS. `.value` is a property only on `<input>` elements, which allows use to
get and set the contents in those elements.

We'll see later how this all comes together, but can you think of a reason why
we might want to set all of those things to the empty string?
