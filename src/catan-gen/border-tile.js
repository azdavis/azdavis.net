import Canvas from "./canvas"
import Tau from "./tau"
import Tile from "./tile"

class BorderTile extends Tile {
    constructor() {
        super()
        this.port = null
    }

    draw(x, y, r) {
        super.draw(x, y, r)
        if (this.port === null) {
            return
        }
        Canvas.cx.fillStyle = this.port
        Canvas.cx.beginPath()
        Canvas.cx.arc(x, y, r / 2, 0, Tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }
}

export default BorderTile
