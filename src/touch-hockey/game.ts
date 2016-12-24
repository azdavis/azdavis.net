import Canvas from "./canvas"
import AutomaticCircle from "./automatic_circle"
import ControlledCircle from "./controlled_circle"

const zero = () => 0

const width = () => Canvas.dim.width
const height = () => Canvas.dim.height
const widthHalf = () => width() / 2
const heightHalf = () => height() / 2

const playerRadius = () => width() * 0.08
const puckRadius = () => width() * 0.05

const top = new ControlledCircle(
    widthHalf()
  , playerRadius() * 2
  , playerRadius
  , zero
  , width
  , zero
  , heightHalf
  , "#d77"
)

const bot = new ControlledCircle(
    widthHalf()
  , height() - playerRadius() * 2
  , playerRadius
  , zero
  , width
  , heightHalf
  , height
  , "#77d"
)

const puck = new AutomaticCircle(
    widthHalf()
  , heightHalf()
  , puckRadius
  , zero
  , width
  , () => widthHalf() - playerRadius() + puckRadius() <= puck.x
       && puck.x <= widthHalf() + playerRadius() - puckRadius()
        ? -height() : zero()
  , () => widthHalf() - playerRadius() + puckRadius() <= puck.x
       && puck.x <= widthHalf() + playerRadius() - puckRadius()
        ? height() * 2 : height()
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

export default {top, bot, render}
