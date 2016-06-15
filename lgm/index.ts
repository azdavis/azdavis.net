import Canvas from './canvas'
import Game from './game'

// the modal which contains instructions and is to be hidden when starting
const modal = <HTMLElement>document.querySelector('.modal')

// the keys on the keyboard we care about, and their KeyboardEvent.which values
const keys = {
    sp: 32,
    lt: 37,
    up: 38,
    rt: 39,
    dn: 40,
    a: 65,
    w: 87,
    d: 68,
    s: 83,
    p: 80,
}

// keeps track of which keys are pressed
let pressed = {}

// bind keys to player shoot, movement, and game pause
onkeydown = (e) => {
    if (e.which === keys.p && !Game.running) {
        modal.style.display = 'none'
        Game.begin()
        pressed = {}
        return
    }
    if (!Game.running || !Game.playing || pressed[e.which]) {
        return
    }
    switch (e.which) {
    case keys.sp:
        Game.player.shoot()
        Game.updateInfo()
        break
    case keys.lt:
    case keys.a:
        Game.player.dirs.lt = true
        break
    case keys.up:
    case keys.w:
        Game.player.dirs.up = true
        break
    case keys.rt:
    case keys.d:
        Game.player.dirs.rt = true
        break
    case keys.dn:
    case keys.s:
        Game.player.dirs.dn = true
        break
    default: return
    }
    pressed[e.which] = true
}

// prevent keys from being held
onkeyup = (e) => {
    if (!Game.running || !Game.playing) {
        return
    }
    switch (e.which) {
    case keys.lt:
    case keys.a:
        Game.player.dirs.lt = false
        break
    case keys.up:
    case keys.w:
        Game.player.dirs.up = false
        break
    case keys.rt:
    case keys.d:
        Game.player.dirs.rt = false
        break
    case keys.dn:
    case keys.s:
        Game.player.dirs.dn = false
        break
    case keys.sp: break
    default: return
    }
    pressed[e.which] = false
}

// resize the canvas when the window is resized
onresize = Canvas.resize

// start the game when the window is (re)focused
onfocus = () => {
    if (!Game.running || Game.playing) {
        return
    }
    Game.start()
}

// stop the game when the window is tabbed out, un-press all keys, and un-
// direct all directions
onblur = () => {
    if (!Game.running || !Game.playing) {
        return
    }
    Game.stop()
    pressed = {}
}

// show an error and undo everything if it's a mobile device (resetting all of
// the 'on' stuff is, in this guy's opinion, actually nicer than wrapping
// everything in a big if statement)
if ('ontouchend' in window) {
    (<HTMLElement>document.querySelector('#kbd')).style.display = 'block'
    onkeydown = onkeyup = onresize = onfocus = onblur = null
}
