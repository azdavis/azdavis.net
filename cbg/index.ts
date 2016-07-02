import Board from "./board"
import Canvas from "./canvas"

onresize = () => {
    Canvas.resize()
    Board.draw()
}

Canvas.el.onclick = Board.drawNew
Board.drawNew()
