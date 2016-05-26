import Game from './game'

const game = new Game()

const keys = {
    lt: 37,
    up: 38,
    rt: 39,
    dn: 40,
    p: 80
}

onkeydown = (e) => {
    switch (e.which) {
    case keys.lt: game.player.dir.lt = true; break
    case keys.up: game.player.dir.up = true; break
    case keys.rt: game.player.dir.rt = true; break
    case keys.dn: game.player.dir.dn = true; break
    case keys.p: game.toggle()
    }
}

onkeyup = (e) => {
    switch (e.which) {
    case keys.lt: game.player.dir.lt = false; break
    case keys.up: game.player.dir.up = false; break
    case keys.rt: game.player.dir.rt = false; break
    case keys.dn: game.player.dir.dn = false; break
    }
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
