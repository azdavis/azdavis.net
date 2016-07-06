import Board from "./board"
import Canvas from "./canvas"

onresize = () => {
    Canvas.resize()
    Board.draw()
}

const gen = document.querySelector("#gen") as HTMLElement
gen.onclick = Board.drawNew

Board.drawNew()
