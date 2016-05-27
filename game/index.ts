import Game from './game'

const game = new Game()

// the keys on the keyboard we care about, and their KeyboardEvent.which values
const keys = {
    sp: 32,
    lt: 37,
    up: 38,
    rt: 39,
    dn: 40,
    p: 80
}
// HACK: keeps track of which keys are pressed
const pressed = {}

// bind keys to player shoot, movement, and game pause
onkeydown = (e) => {
    if (pressed[e.which])
        return
    switch (e.which) {
    case keys.sp: game.player.shoot(); break
    case keys.lt: game.player.i -= 1; break
    case keys.up: game.player.j -= 1; break
    case keys.rt: game.player.i += 1; break
    case keys.dn: game.player.j += 1; break
    case keys.p: game.toggle(); break
    }
    pressed[e.which] = true
}

// prevent keys from being held
onkeyup = (e) => {
    switch (e.which) {
    // `if` makes sure that if the player was stopped from exiting the canvas,
    // the player does not move backward when the user releases the key
    case keys.lt: if (game.player.i) game.player.i += 1; break
    case keys.up: if (game.player.j) game.player.j += 1; break
    case keys.rt: if (game.player.i) game.player.i -= 1; break
    case keys.dn: if (game.player.j) game.player.j -= 1; break
    }
    pressed[e.which] = false
}

// resize the canvas when the window is resized
onresize = () => {
    game.canvas.resize()
}

// run the game when the window is (re)focused
onfocus = () => {
    game.start()
}

// stop the game when the window is tabbed out
onblur = () => {
    game.stop()
}

// start the game if, on page load, the document has focus (for some reason,
// this is a method on document)
if (document.hasFocus())
    game.start()
