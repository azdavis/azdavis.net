import Board from "./board"
import Canvas from "./canvas"

onresize = () => {
    Canvas.resize()
    Board.draw()
}

Canvas.el.onclick = Board.drawNew
Board.drawNew()

const msg = document.querySelector("#msg") as HTMLElement
msg.innerHTML = `${"ontouchend" in window ? "tap" : "click"} anywhere`
