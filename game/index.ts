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
    p: 80,
}

// keeps track of which keys are pressed
const pressed = {}

// bind keys to player shoot, movement, and game pause
onkeydown = (e) => {
    if (e.which === keys.p && !Game.started) {
        modal.style.display = 'none'
        Game.start()
        return
    }
    if (pressed[e.which] || !Game.running || !Game.started) {
        return
    }
    switch (e.which) {
    case keys.sp:
        Game.player.shoot()
        Game.updateInfo()
        break
    case keys.lt: Game.player.dirs.lt = true; break
    case keys.up: Game.player.dirs.up = true; break
    case keys.rt: Game.player.dirs.rt = true; break
    case keys.dn: Game.player.dirs.dn = true; break
    default: return
    }
    pressed[e.which] = true
}

// prevent keys from being held
onkeyup = (e) => {
    if (!Game.started || !Game.running) {
        return
    }
    switch (e.which) {
    case keys.lt: Game.player.dirs.lt = false; break
    case keys.up: Game.player.dirs.up = false; break
    case keys.rt: Game.player.dirs.rt = false; break
    case keys.dn: Game.player.dirs.dn = false; break
    case keys.sp: break
    default: return
    }
    pressed[e.which] = false
}

// resize the canvas when the window is resized
onresize = () => Canvas.resize()

// run the game when the window is (re)focused
onfocus = () => {
    if (!Game.started) {
        return
    }
    Game.start()
}

// stop the game when the window is tabbed out, and un-press all keys
onblur = () => {
    if (!Game.started) {
        return
    }
    Game.stop()
    for (let k in pressed) {
        if (pressed[k]) {
            pressed[k] = false
        }
    }
}
