import Board from "./board"
import Canvas from "./canvas"

onresize = () => {
    Canvas.resize()
    Board.draw()
}

document.body.onclick = Board.drawNew
Board.drawNew()
