import CatanBoard from "./board"
import Canvas from "./canvas"

onresize = () => {
    Canvas.resize()
    CatanBoard.draw()
}

Canvas.elem.onclick = CatanBoard.drawNew
CatanBoard.drawNew()
