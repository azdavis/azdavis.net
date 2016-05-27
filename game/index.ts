import Game from './game'

const game = new Game()

const keys = {
    sp: 32,
    lt: 37,
    up: 38,
    rt: 39,
    dn: 40,
    p: 80
}
const pressed = {}

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

onkeyup = (e) => {
    switch (e.which) {
    case keys.lt: if (game.player.i) game.player.i += 1; break
    case keys.up: if (game.player.j) game.player.j += 1; break
    case keys.rt: if (game.player.i) game.player.i -= 1; break
    case keys.dn: if (game.player.j) game.player.j -= 1; break
    }
    pressed[e.which] = false
}

onresize = () => {
    game.canvas.resize()
}

onfocus = () => {
    game.start()
}

onblur = () => {
    game.stop()
}

if (document.hasFocus())
    game.start()
