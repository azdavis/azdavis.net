import "../_base/dark"
import Canvas from "./canvas"
import Game from "./game"
import Touches from "./touches"

function resize() {
    Canvas.dim.width =
        Canvas.cx.canvas.width =
        innerWidth * Canvas.dim.scale
    Canvas.dim.height =
        Canvas.cx.canvas.height =
        innerHeight * Canvas.dim.scale
}

resize()
onresize = resize

const msg = document.querySelector("#msg")
if ("ontouchend" in window) {
    msg.remove()
    Touches.setup()
    requestAnimationFrame(Game.render)
} else {
    msg.innerHTML = "A touchscreen is required"
}
