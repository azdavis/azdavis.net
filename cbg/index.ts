import Board from "./board"

onresize = Board.draw

const reg = document.querySelector("#reg") as HTMLElement
reg.onclick = () => { Board.drawNew("reg") }

const exp = document.querySelector("#exp") as HTMLElement
exp.onclick = () => { Board.drawNew("exp") }

Board.drawNew("reg")
