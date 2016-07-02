import Canvas from "./canvas"
import CatanBoard from "./catan_board"

const gen = document.querySelector("button") as HTMLElement

onresize = () => {
    Canvas.resize()
    CatanBoard.draw()
}

gen.onclick = CatanBoard.drawNew
CatanBoard.drawNew()
