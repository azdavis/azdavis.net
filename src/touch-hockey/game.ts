import Canvas from "./canvas"
import Circle from "./circle"
import ControlledCircle from "./controlled_circle"

const startOffset = 100
const z = () => 0
const w = () => Canvas.dim.width
const hHalf = () => Canvas.dim.height / 2
const h = () => Canvas.dim.height

const top = new ControlledCircle(
    Canvas.dim.width / 2
  , startOffset
  , 50
  , z
  , w
  , z
  , hHalf
  , "#d77"
)

const bot = new ControlledCircle(
    Canvas.dim.width / 2
  , Canvas.dim.height - startOffset
  , 50
  , z
  , w
  , hHalf
  , h
  , "#77d"
)

const puck = new Circle(
    Canvas.dim.width / 2
  , Canvas.dim.height / 2
  , 40
  , z
  , w
  , z
  , h
  , "#777"
)

function render(): void {
    Canvas.clear()
    puck.draw()
    top.draw()
    bot.draw()
    requestAnimationFrame(render)
}

function touchStart(id: string, x: number, y: number): void {
    let guy = top.contains(x, y)
            ? top
            : bot.contains(x, y)
            ? bot
            : null
    if (guy !== null) {
        guy.lastTouchID = id
    }
    touchMaintain(id, x, y)
}

function touchMaintain(id: string, x: number, y: number): void {
    let guy = id === top.lastTouchID
            ? top
            : id === bot.lastTouchID
            ? bot
            : null
    if (guy !== null) {
        guy.moveTo(x, y)
    }
}

function touchStop(id: string, x: number, y: number): void {
    let guy = id === top.lastTouchID
            ? top
            : id === bot.lastTouchID
            ? bot
            : null
    if (guy !== null) {
        guy.stop()
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
