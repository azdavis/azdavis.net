import CatanBoard from "./catan_board"
import Canvas from "./canvas"

onresize = () => {
    Canvas.resize()
    CatanBoard.draw()
}

Canvas.elem.onclick = CatanBoard.drawNew
CatanBoard.drawNew()
