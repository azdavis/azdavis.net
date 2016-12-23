import Canvas from "./canvas"
import Game from "./game"

function start(id: string, x: number, y: number): void {
    let p = Game.top.contains(x, y) ? Game.top
          : Game.bot.contains(x, y) ? Game.bot
          : null
    if (p !== null) {
        p.controlWith(id)
    }
    maintain(id, x, y)
}

function maintain(id: string, x: number, y: number): void {
    let p = Game.top.isControlledBy(id) ? Game.top
          : Game.bot.isControlledBy(id) ? Game.bot
          : null
    if (p !== null) {
        p.moveTo(x, y)
    }
}

function stop(id: string, x: number, y: number): void {
    let p = Game.top.isControlledBy(id) ? Game.top
          : Game.bot.isControlledBy(id) ? Game.bot
          : null
    if (p !== null) {
        p.stop()
    }
}

function all(
    f: (id: string, x: number, y: number) => void
): (e: TouchEvent) => void {
    return e => {
        e.preventDefault()
        for (const {identifier, pageX, pageY} of e.changedTouches as any) {
            f(identifier, pageX * Canvas.dim.scale, pageY * Canvas.dim.scale)
        }
    }
}

function setup(): void {
    ontouchstart = all(start)
    ontouchmove = all(maintain)
    ontouchend = ontouchcancel = all(stop)
}

export default {setup}
