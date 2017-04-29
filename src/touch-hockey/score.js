import Canvas from "./canvas"
import Game from "./game"

let top = 0
let bot = 0

const font = `4em ${getComputedStyle(document.documentElement).fontFamily}`
const textAlign = "center"
const textBaseline = "middle"
const offset = 100

function draw() {
	const heightHalf = Canvas.dim.height / 2
	Canvas.cx.font = font
	Canvas.cx.textAlign = textAlign
	Canvas.cx.textBaseline = textBaseline
	Canvas.cx.fillStyle = Game.top.color
	Canvas.cx.fillText(String(top), offset, heightHalf)
	Canvas.cx.fillStyle = Game.bot.color
	Canvas.cx.fillText(String(bot), Canvas.dim.width - offset, heightHalf)
}

function incTop() {
	top++
}

function incBot() {
	bot++
}

export default {draw, incTop, incBot}
