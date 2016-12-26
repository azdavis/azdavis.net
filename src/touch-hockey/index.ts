import "../base/dark"
import Game from "./game"
import Touches from "./touches"

const msg = document.querySelector("#msg") as HTMLElement
if ("ontouchend" in window) {
    msg.remove()
    Touches.setup()
    requestAnimationFrame(Game.render)
} else {
    msg.innerHTML = "A touchscreen is required"
}
