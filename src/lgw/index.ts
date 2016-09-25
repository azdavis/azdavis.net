import {$, append} from "../base/ts/dom"
import isMobile from "../base/ts/isMobile"
import Canvas from "./Canvas"
import Game from "./Game"
import Player from "./Player"

// the modal which contains instructions and is to be hidden when starting
const modal = $("#modal")

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
    en: 13,
}

// keeps track of which keys are pressed
let pressed = {}

// bind keys to player shoot, movement, and game pause
onkeydown = e => {
    if (e.which === keys.en && !Game.running) {
        modal.remove()
        Game.begin()
        pressed = {}
        return
    }
    if (!Game.running || !Game.playing || pressed[e.which]) {
        return
    }
    switch (e.which) {
    case keys.sp:
        Player.shoot()
        Game.updateInfo()
        break
    case keys.lt:
    case keys.a:
        Player.dirs.lt = true
        break
    case keys.up:
    case keys.w:
        Player.dirs.up = true
        break
    case keys.rt:
    case keys.d:
        Player.dirs.rt = true
        break
    case keys.dn:
    case keys.s:
        Player.dirs.dn = true
        break
    default: return
    }
    pressed[e.which] = true
}

// prevent keys from being held
onkeyup = e => {
    if (!Game.running || !Game.playing) {
        return
    }
    switch (e.which) {
    case keys.lt:
    case keys.a:
        Player.dirs.lt = false
        break
    case keys.up:
    case keys.w:
        Player.dirs.up = false
        break
    case keys.rt:
    case keys.d:
        Player.dirs.rt = false
        break
    case keys.dn:
    case keys.s:
        Player.dirs.dn = false
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

// show an error or a "begin" message, depending on mobility of device
const msg = $("#msg")
if (isMobile) {
    msg.innerHTML = "a physical keyboard is required"
} else {
    msg.innerHTML = "press <code>enter</code> to begin"
    msg.className = "green"
}

append(Game.info)
append(Canvas.el)
