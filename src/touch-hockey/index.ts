import "../base/dark"
import Game from "./game"
import Touch from "./touch"

const msg = document.querySelector("#msg") as HTMLElement
if ("ontouchend" in window) {
    msg.remove()
    Touch.setup()
    requestAnimationFrame(Game.render)
} else {
    msg.innerHTML = "A touchscreen is required"
}
