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

Great! Now, we can finally start implementing this game. Note that the starter
code also includes the game rules!

## Close everything into one scope

This step may seem a little arcane, but it's useful. We define a big function
that we'll put everything into, then immediately call it. The fancy name for
this "big function" is and _immediately-invoked functional expression_ or IIFE.

    // seal all the vars and functions into a contained scope.
    (function () {

    // end of the scope.
    })()

What's the point of this? One reason is that if you didn't, and you had some
`var important = "thing"`, a user could open up the developer tools in their
browser and view, and even change, `important`.

[Read more about IIFEs.][1]

[1]: http://benalman.com/news/2010/11/immediately-invoked-function-expression

## Add strict mode

This, too, may seem a little abstract, but it, too, is useful. We simply add
the string `"use strict"` inside the IIFE, at the top.

    // enable strict mode.
    "use strict"

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

    // some elements declared in the HTML document.
    var intro = document.getElementById("intro")
    var controls = document.getElementById("controls")
    var rows = document.getElementById("rows")
    var cols = document.getElementById("cols")
    var game = document.getElementById("game")

It's clear, then, why `id`s must be unique: if two elements had the same `id`,
`document.getElementById` wouldn't know which one to return.

## Add some globals

Shudder! Global variables! Fortunately, some of them will never change, i.e.,
they're actually global _constants_. Those aren't as bad, since it's really
_changing_ global variables one should worry about, since it's hard to know the
state of your program at any given point when you have lots of stuff changing
at once.

    // some constants (warning: hard-coded in other files like style.css).
    var RED = "r"
    var GREEN = "g"
    var BLUE = "b"
    var TILE_WIDTH = 56
    var BODY_PADDING = 20

    // the board (a 2d array of RED, GREEN, and BLUE).
    var board

    // the number of GREENs and BLUEs in the board.
    var greens
    var blues

By convention, one writes variable names in `UPPER_SNAKE_CASE` when they're
constants, but, as you can see from the `var` right before each one, it's still
technically a variable and could be reassigned. The burden is on us, then to
recognize the `UPPER_SNAKE_CASE` as a warning _not_ to do so.

## Generate a new board

We need a function that, given a number of rows and columns, generates a new
game board with that many rows and columns.

    // genNewBoard(r: number, c: number): void
    // REQUIRES: r > 0 and c > 0.
    // ENSURES: set board to a new 2d array with r rows and c columns, with all
    // elements BLUE except the top-left which is GREEN. also update greens and
    // blues to correspond.
    function genNewBoard(r, c) {
        board = []
        greens = blues = 0
        for (var i = 0; i < r; i++) {
            board[i] = []
            for (var j = 0; j < c; j++) {
                board[i][j] = BLUE
                blues++
            }
        }
        board[0][0] = GREEN
        blues--
        greens++
    }

Note the type signature we gave the function. We read it as "`genNewBoard` is a
function that takes two `number` parameters and returns `void`".

Note also the `REQUIRES` and `ENSURES` we gave. `REQUIRES` describes the
preconditions that must be satisfied _before_ we call the function, and
`ENSURES` describes the postconditions that are guaranteed to be satisfied
_after_ we call the function.

## Try to change a tile

We need a function that, given a row and a column, tries to switch the tile to
blue if it's green, or to green if it's blue.

    // tryChangeTile(r: number, c: number): void
    // REQUIRES: nothing.
    // ENSURES: if r or c is not a valid row or column of board then return, else
    // set the tile at row r and column c of board to its new color as defined by
    // the game rules. also update greens and blues to correspond.
    function tryChangeTile(r, c) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[r].length) {
            return
        }
        if (board[r][c] === GREEN) {
            board[r][c] = BLUE
            greens--
            blues++
        } else if (board[r][c] === BLUE) {
            board[r][c] = GREEN
            blues--
            greens++
        }
    }

Notice how the function name has a prefix `try`. That's a signal to us that
this function can "fail." Look carefully at the first if statement and you'll
see why. We return without doing anything if the `r` or `c` given to use wasn't
a valid row or column.

Why did we not require `r` and `c` to be valid with our `REQUIRES`? We're about
to find out.

## Try to change the board

We need a function that, given a row and a column, tries to switch that tile to
red, and the surrounding tiles to their colors.

    // tryChangeBoard(r: number, c: number): boolean
    // REQUIRES: 0 <= r < number of rows and 0 <= c < number of columns.
    // ENSURES: if the tile at row r and column c of board is not GREEN then return
    // false, else set it to RED and update surrounding tiles as defined by the
    // rules and return true. also update greens and blues to correspond.
    function tryChangeBoard(r, c) {
        if (board[r][c] !== GREEN) {
            return false
        }
        board[r][c] = RED
        greens--
        tryChangeTile(r + 1, c)
        tryChangeTile(r - 1, c)
        tryChangeTile(r, c + 1)
        tryChangeTile(r, c - 1)
        return true
    }

We now see why we didn't require `r` and `c` to be valid in `tryChangeTile`.
It's because it's just easier to call `tryChangeTile` with each possible
coordinate for a neighboring tile, and let `tryChangeTile` figure out if it was
a valid tile or not, instead of having repetitive if-statements at the call
site.

Note that `tryChangeBoard` also returns whether or not it was able to change
the board. As we'll see later, it turns out that's valuable information to us.

## Try to end the game

We need a function that tries to end the game.

    // tryEndGame(): void
    // REQUIRES: nothing.
    // ENSURES: if greens !== 0 then return, else if blues === 0 then show a win
    // message, else show a lose message. then show the game-start controls and
    // hide the board.
    function tryEndGame() {
        if (greens !== 0) {
            return
        }
        if (blues === 0) {
            alert("yay! you won!")
        } else {
            alert("darn. you lost.")
        }
        intro.style.display = game.style.display = rows.value = cols.value = ""
    }

Note the last line, with all the `.style.display` and `.value`. `.style` is a
property of all DOM elements, which allows us to apply CSS styles to elements
from JS. `.value` is a property only on `<input>` elements, which allows use to
get and set the contents in those elements.

We'll see later how this all comes together, but can you think of a reason why
we might want to set all of those things to the empty string?

## Render a changed board

So far, we've pretty much only worked with our internal representation of the
game: the `board`, a two-dimensional array. Only in the last part of the last
example did we start to interact with the page itself.

Now, however, we need some functions which render the board to the user. The
first of these, strangely enough, assumes we already have some DOM
representation of the board that looks something like this:

    <game>
        <row>
            <tile></tile>
            <tile></tile>
        </div>
        <row>
            <tile></tile>
            <tile></tile>
        </div>
    </game>

This is just pseudocode, but the actual DOM representation will look a least a
bit like that. Except all the elements will be `<div>`s with various `class`es
tacked on them, since you can't make custom elements in HTML yet.

Anyway, we need a function that renders a changed board.

    // renderChangeBoard(): void
    // REQUIRES: nothing.
    // ENSURES: update the DOM representation of board with the latest information
    // from board.
    function renderChangeBoard() {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                game.children[i].children[j].className = board[i][j]
            }
        }
    }

We'll call this function after we update the state `board` internally and we
want to render those updates to the user.

We use the `.children` property to get access to an array (actually, a
NodeList, but we can still subscript with `[]` as we'd expect) of an element's
children.

This part is probably the most confusing if you don't know HTML and CSS. Don't
worry, we'll slog through.

## Create an click event handling function

We need a function that, given a row and column, returns _a function_ which
when called, updates the game's internal state, then renders any changes.

    // createOnclick(r: number, c: number): (): void
    // REQUIRES: 0 <= r < number of rows and 0 <= c < number of columns.
    // ENSURES: return a function suitable to register on the click event for the
    // DOM representation of the tile at row r and column c of board. this function
    // changes the board at row r and column c, then renders the changes and ends
    // the game if necessary.
    function createOnclick(r, c) {
        return function () {
            if (!tryChangeBoard(r, c)) {
                return
            }
            renderChangeBoard()
            setTimeout(tryEndGame, 1)
        }
    }

We'll register each function returned by this function on each tile's
`.onclick` event handler (another DOM property).

## Render a new board

We need a function that renders a new board.

    // renderNewBoard(): void
    // REQUIRES: nothing.
    // ENSURES: create a new DOM representation of board.
    function renderNewBoard() {
        game.innerHTML = ""
        for (var i = 0; i < board.length; i++) {
            var row = document.createElement("div")
            row.className = "row"
            for (var j = 0; j < board[i].length; j++) {
                var tile = document.createElement("div")
                tile.className = board[i][j]
                tile.onclick = createOnclick(i, j)
                row.appendChild(tile)
            }
            game.appendChild(row)
        }
    }

Note that we use `createOnclick(i, j)` for the tile at position (i, j). We can
also roughly see how the DOM structure gets created like we said it would, with
the double for loop.

## Is a positive integer

We need a helper function that, given a number, returns whether it's a positive
integer.

    // isPositiveInteger(x: number): boolean
    // REQUIRES: nothing.
    // ENSURES: return whether x is a positive integer.
    function isPositiveInteger(x) {
        return !isNaN(x) && x > 0 && Math.floor(x) === x
    }

Why do we need such an oddly specific function? We're about to find out.

## Try to start the game

We're in the home stretch! We need a function that, given a number of rows and
columns, tries to start the game with those dimensions.

    // tryStartGame(r: number, c: number): void
    // REQUIRES: nothing.
    // ENSURES: if valid r and c were provided then create a new board with those
    // dimensions and start the game, else show various error messages based on how
    // the dimensions were not valid.
    function tryStartGame(r, c) {
        if (!isPositiveInteger(r) || !isPositiveInteger(c)) {
            alert("give positive integers!")
            return
        } else if (
            r * TILE_WIDTH > (innerHeight - BODY_PADDING) ||
            c * TILE_WIDTH > (innerWidth - BODY_PADDING)
        ) {
            alert("".concat(
                "a ", r, " x ", c, " board can't fit on the screen!\ntry a ",
                Math.floor((innerHeight - BODY_PADDING) / TILE_WIDTH), " x ",
                Math.floor((innerWidth - BODY_PADDING) / TILE_WIDTH), " board."
            ))
            return
        }
        intro.style.display = "none"
        game.style.display = "block"
        genNewBoard(r, c)
        renderNewBoard()
    }

We now see why `isPositiveInteger` is useful: if the user gives bad input, we
yell at them. We also see the purpose of some of the constants defined way at
the beginning: they make sure we only create board that can fit on the user's
screen.

## Handle submission of the form data

When the user inputs the rows and columns with the controls, we need to prevent
the default action (which is to reload the page), and then call `tryStartGame`
with the input the user gave.

    // when the form holding the inputs for the number of rows and columns is
    // submitted, prevent the default action (which is to reload the page), then
    // start the game.
    controls.onsubmit = function (e) {
        e.preventDefault()
        tryStartGame(Number(rows.value), Number(cols.value))
    }

We're almost done! Just one little thing left...

## Show the controls

The controls have been hidden the whole time! We hide them by default, so that
if a user without JS comes to our page, we don't show them useless controls.
But at this point, we do want to show them, so that the user can play the game.

    // show the controls.
    controls.style.display = "block"

And on that note, the game is finished!
