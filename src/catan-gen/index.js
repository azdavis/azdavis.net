import "../_base/dark"
import Canvas from "./canvas"
import RegularBoard from "./regular-board"

const x = () => Canvas.el.width / 2
const y = () => Canvas.el.height / 2
const r = () =>
    // 20 / 21 / sqrt(3)
    Math.min(Canvas.el.width / 2, Canvas.el.height * 0.549857399) - 20

onresize = () => {
    Canvas.resize()
    Canvas.clear()
    RegularBoard.draw(x(), y(), r())
}

function render() {
    Canvas.clear()
    RegularBoard.generate()
    RegularBoard.draw(x(), y(), r())
}

render()
if ("ontouchend" in window) {
    ontouchmove = e => e.preventDefault()
    ontouchend = render
} else {
    onclick = render
}
