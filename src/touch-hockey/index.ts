import "../base/dark"
import Canvas from "./canvas"
import ControlledCircle from "./controlled_circle"

const startOffset = 100

const top = new ControlledCircle(
    Canvas.dim.width / 2
  , startOffset
  , () => 0
  , () => Canvas.dim.width
  , () => 0
  , () => Canvas.dim.height / 2
  , "#d77"
)

const bot = new ControlledCircle(
    Canvas.dim.width / 2
  , Canvas.dim.height - startOffset
  , () => 0
  , () => Canvas.dim.width
  , () => Canvas.dim.height / 2
  , () => Canvas.dim.height
  , "#77d"
)

function render(): void {
    Canvas.clear()
    top.draw()
    bot.draw()
    requestAnimationFrame(render)
}

function start(id: string, x: number, y: number): void {
    if (top.contains(x, y)) {
        top.lastTouchID = id
    } else if (bot.contains(x, y)) {
        bot.lastTouchID = id
    }
    maintain(id, x, y)
}

function maintain(id: string, x: number, y: number): void {
    if (top.lastTouchID === id) {
        top.moveTo(x, y)
    } else if (bot.lastTouchID === id) {
        bot.moveTo(x, y)
    }
}

function stop(id: string, x: number, y: number): void {
    if (top.lastTouchID === id) {
        top.stop()
    } else if (bot.lastTouchID === id) {
        bot.stop()
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

if ("ontouchend" in window) {
    ontouchstart = all(start)
    ontouchmove = all(maintain)
    ontouchend = ontouchcancel = all(stop)
    requestAnimationFrame(render)
}
