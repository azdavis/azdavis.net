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

export default {top, bot, render}
