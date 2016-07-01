import Canvas from "./canvas"
import CatanBoard from "./catan_board"

onresize = () => {
    Canvas.resize()
    CatanBoard.draw()
}

Canvas.elem.onclick = CatanBoard.drawNew
CatanBoard.drawNew()
