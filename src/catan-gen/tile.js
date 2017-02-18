import Canvas from "./canvas"

const root3Over2 = 0.866025404

class Tile {
    constructor() {
        this.color = null
    }

    draw(x, y, r) {
        const rOver2 = r / 2
        const rRoot3Over2 = r * root3Over2
        Canvas.cx.fillStyle = this.color
        Canvas.cx.moveTo(x - rOver2, y - rRoot3Over2)
        Canvas.cx.beginPath()
        Canvas.cx.moveTo(x + rOver2, y - rRoot3Over2)
        Canvas.cx.moveTo(x + r, y)
        Canvas.cx.moveTo(x + rOver2, y + rRoot3Over2)
        Canvas.cx.moveTo(x - rOver2, y + rRoot3Over2)
        Canvas.cx.moveTo(x - r, y)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }
}

export default Tile
