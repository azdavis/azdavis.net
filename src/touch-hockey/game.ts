import Canvas from "./canvas"
import score from "./score"
import AutomaticCircle from "./automatic_circle"
import ControlledCircle from "./controlled_circle"

const zero = () => 0

const width = () => Canvas.dim.width
const height = () => Canvas.dim.height
const widthHalf = () => width() / 2
const heightHalf = () => height() / 2

const playerRadius = () => width() * 0.08
const puckRadius = () => width() * 0.05

const goalWidthHalf = () => playerRadius() * 3 - puckRadius()
const goalWidth = () => goalWidthHalf() * 2
const goalHeight = () => height() * 0.005
const goalLt = () => widthHalf() - goalWidthHalf()
const goalRt = () => widthHalf() + goalWidthHalf()
const nearGoal = x => goalLt() <= x && x <= goalRt()

const playerOffset = playerRadius() * 2

const top = new ControlledCircle(
    widthHalf()
  , playerOffset
  , zero
  , width
  , zero
  , heightHalf
  , playerRadius
  , "#d77"
)

const bot = new ControlledCircle(
    widthHalf()
  , height() - playerOffset
  , zero
  , width
  , heightHalf
  , height
  , playerRadius
  , "#77d"
)

const puck = new AutomaticCircle(
    widthHalf()
  , heightHalf()
  , zero
  , width
  , () => nearGoal(puck.x) ? -height() : zero()
  , () => nearGoal(puck.x) ? height() * 2 : height()
  , puckRadius
  , "#777"
)

function drawGoals(): void {
    Canvas.cx.fillStyle = bot.color
    Canvas.cx.fillRect(goalLt(), zero(), goalWidth(), goalHeight())
    Canvas.cx.fillStyle = top.color
    Canvas.cx.fillRect(goalLt(), height() - goalHeight(), goalWidth(), height())
}

function render(): void {
    Canvas.clear()
    score.draw()
    puck.draw()
    drawGoals()
    top.draw()
    bot.draw()
    if (puck.overlaps(top)) {
        puck.collideWith(top)
    }
    if (puck.overlaps(bot)) {
        puck.collideWith(bot)
    }
    if (nearGoal(puck.x)) {
        if (puck.y < zero()) {
            score.incBot()
            puck.reset()
        } else if (puck.y > height()) {
            score.incTop()
            puck.reset()
        }
    }
    puck.move()
    requestAnimationFrame(render)
}

export default {top, bot, render}
