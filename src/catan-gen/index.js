import Canvas from "./canvas"
import RegularBoard from "./regular-board"

const x = () => Canvas.dim.width / 2
const y = () => Canvas.dim.height / 2
const r = () =>
    // 20 / 21 / sqrt(3)
    Math.min(Canvas.dim.width / 2, Canvas.dim.height * 0.549857399) - 20

function render() {
    Canvas.clear()
    RegularBoard.draw(x(), y(), r())
    setTimeout(render, 1000)
}
render()
