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
    if (id === top.lastTouchID) {
        top.moveTo(x, y)
    } else if (id === bot.lastTouchID) {
        bot.moveTo(x, y)
    }
}

function stop(id: string, x: number, y: number): void {
    if (id === top.lastTouchID) {
        top.stop()
    } else if (id === bot.lastTouchID) {
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

const msg = document.querySelector("#msg") as HTMLElement
if ("ontouchend" in window) {
    msg.remove()
    ontouchstart = all(start)
    ontouchmove = all(maintain)
    ontouchend = ontouchcancel = all(stop)
    requestAnimationFrame(render)
} else {
    msg.innerHTML = "A touchscreen is required"
}
