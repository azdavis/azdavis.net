import Canvas from "./canvas"
import Game from "./game"

function maintain(id, x, y) {
    if (Game.top.isControlledBy(id)) {
        Game.top.moveTo(x, y)
    } else if (Game.bot.isControlledBy(id)) {
        Game.bot.moveTo(x, y)
    }
}

function start(id, x, y) {
    if (Game.top.contains(x, y)) {
        Game.top.controlWith(id)
    } else if (Game.bot.contains(x, y)) {
        Game.bot.controlWith(id)
    }
    maintain(id, x, y)
}

function stop(id) {
    if (Game.top.isControlledBy(id)) {
        Game.top.stop()
    } else if (Game.bot.isControlledBy(id)) {
        Game.bot.stop()
    }
}

const all = f => e => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
        const {identifier, pageX, pageY} = e.changedTouches[i]
        f(identifier, pageX * Canvas.dim.scale, pageY * Canvas.dim.scale)
    }

}

function setup() {
    ontouchstart = all(start)
    ontouchmove = all(maintain)
    ontouchend = ontouchcancel = all(stop)
}

export default {setup}
