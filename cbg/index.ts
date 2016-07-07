import Board from "./board"

onresize = Board.draw

const gen = document.querySelector("#gen") as HTMLElement
gen.onclick = Board.drawNew

Board.drawNew()
