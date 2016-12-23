import Canvas from "./canvas"
import AutomaticCircle from "./automatic_circle"
import ControlledCircle from "./controlled_circle"

const top = new ControlledCircle(
    0
  , 0
  , 0
  , () => 0
  , () => 0
  , () => 0
  , () => 0
  , "#d77"
)

const bot = new ControlledCircle(
    0
  , 0
  , 0
  , () => 0
  , () => 0
  , () => 0
  , () => 0
  , "#77d"
)

const puck = new AutomaticCircle(
    0
  , 0
  , 0
  , () => 0
  , () => 0
  , () => 0
  , () => 0
  , "#777"
)

function render(): void {
    Canvas.clear()
    puck.draw()
    top.draw()
    bot.draw()
    let p = top.overlaps(puck) ? top
          : bot.overlaps(puck) ? bot
          : null
    if (p !== null) {
        puck.collideWith(p)
    }
    puck.move()
    requestAnimationFrame(render)
}

function touchStart(id: string, x: number, y: number): void {
    let p = top.contains(x, y) ? top
          : bot.contains(x, y) ? bot
          : null
    if (p !== null) {
        p.controlWith(id)
    }
    touchMaintain(id, x, y)
}

function touchMaintain(id: string, x: number, y: number): void {
    let p = top.isControlledBy(id) ? top
          : bot.isControlledBy(id) ? bot
          : null
    if (p !== null) {
        p.moveTo(x, y)
    }
}

function touchStop(id: string, x: number, y: number): void {
    let p = top.isControlledBy(id) ? top
          : bot.isControlledBy(id) ? bot
          : null
    if (p !== null) {
        p.stop()
    }
}

function touchAll(
    f: (id: string, x: number, y: number) => void
): (e: TouchEvent) => void {
    return e => {
        e.preventDefault()
        for (const {identifier, pageX, pageY} of e.changedTouches as any) {
            f(identifier, pageX * Canvas.dim.scale, pageY * Canvas.dim.scale)
        }
    }
}

function begin(): void {
    ontouchstart = touchAll(touchStart)
    ontouchmove = touchAll(touchMaintain)
    ontouchend = ontouchcancel = touchAll(touchStop)
    requestAnimationFrame(render)
}

export default {begin}
