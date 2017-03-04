import Canvas from "./canvas"
import Game from "./game"

function start(id, x, y) {
    if (Game.top.contains(x, y)) {
        Game.top.controlWith(id)
    } else if (Game.bot.contains(x, y)) {
        Game.bot.controlWith(id)
    }
    maintain(id, x, y)
}

function maintain(id, x, y) {
    if (Game.top.isControlledBy(id)) {
        Game.top.moveTo(x, y)
    } else if (Game.bot.isControlledBy(id)) {
        Game.bot.moveTo(x, y)
    }
}

function stop(id) {
    if (Game.top.isControlledBy(id)) {
        Game.top.stop()
    } else if (Game.bot.isControlledBy(id)) {
        Game.bot.stop()
    }
}

function all(f) {
    return e => {
        e.preventDefault()
        for (const {identifier, pageX, pageY} of e.changedTouches) {
            f(identifier, pageX * Canvas.dim.scale, pageY * Canvas.dim.scale)
        }
    }
}

function setup() {
    ontouchstart = all(start)
    ontouchmove = all(maintain)
    ontouchend = ontouchcancel = all(stop)
}

export default {setup}
