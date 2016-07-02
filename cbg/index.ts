import Canvas from "./canvas"
import CatanBoard from "./catan_board"

onresize = () => {
    Canvas.resize()
    CatanBoard.draw()
}

Canvas.el.onclick = CatanBoard.drawNew
CatanBoard.drawNew()

const msg = document.querySelector("#msg") as HTMLElement
msg.innerHTML = `${"ontouchend" in window ? "tap" : "click"} anywhere`
