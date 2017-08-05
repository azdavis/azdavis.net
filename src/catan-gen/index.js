import "/_base/dark"
import Canvas from "./canvas"
import RegularBoard from "./regular-board"

const scale = devicePixelRatio || 1
function resize() {
	const w = innerWidth * scale
	const h = innerHeight * scale
	Canvas.cx.canvas.width = w
	Canvas.cx.canvas.height = h
	Canvas.cx.textAlign = "center"
	Canvas.cx.textBaseline = "middle"
	RegularBoard.x = w / 2
	RegularBoard.y = h / 2
	// 20 / 21 / sqrt(3) = 0.549857399
	// minus a bit, to allow a gap between the board edge and the height
	RegularBoard.r = Math.min(w / 2, h * 0.549857399) - 20
	RegularBoard.draw()
}
resize()
onresize = resize

function render() {
	Canvas.clear()
	RegularBoard.generate()
	RegularBoard.draw()
}

render()
if ("ontouchend" in window) {
	ontouchmove = () => false
	ontouchend = render
} else {
	onclick = render
}
