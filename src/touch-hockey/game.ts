import AutomaticCircle from "./automatic_circle"
import Canvas from "./canvas"
import ControlledCircle from "./controlled_circle"
import score from "./score"

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
    /* x      */ widthHalf()
  , /* y      */ playerOffset
  , /* lt     */ zero
  , /* rt     */ width
  , /* up     */ zero
  , /* dn     */ heightHalf
  , /* radius */ playerRadius
  , /* color  */ "#d77"
)

const bot = new ControlledCircle(
    /* x      */ widthHalf()
  , /* y      */ height() - playerOffset
  , /* lt     */ zero
  , /* rt     */ width
  , /* up     */ heightHalf
  , /* dn     */ height
  , /* radius */ playerRadius
  , /* color  */ "#77d"
)

const puck = new AutomaticCircle(
    /* x      */ widthHalf()
  , /* y      */ heightHalf()
  , /* lt     */ zero
  , /* rt     */ width
  , /* up     */ () => nearGoal(puck.x) ? -height() : zero()
  , /* dn     */ () => nearGoal(puck.x) ? height() * 2 : height()
  , /* radius */ puckRadius
  , /* color  */ "#777"
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
    puck.collideWith(top)
    puck.collideWith(bot)
    puck.move()
    if (nearGoal(puck.x)) {
        if (puck.y < zero()) {
            score.incBot()
            puck.reset()
        } else if (puck.y > height()) {
            score.incTop()
            puck.reset()
        }
    }
    requestAnimationFrame(render)
}

export default {top, bot, render}
