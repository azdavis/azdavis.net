import "../base/dark"
import Game from "./game"

const msg = document.querySelector("#msg") as HTMLElement
if ("ontouchend" in window) {
    msg.remove()
    Game.begin()
} else {
    msg.innerHTML = "A touchscreen is required"
}
