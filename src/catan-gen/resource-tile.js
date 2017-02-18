import Canvas from "./canvas"
import Tau from "./tau"
import Tile from "./tile"

class ResourceTile extends Tile {
    constructor() {
        super()
        this.number = null
    }

    draw(x, y, r) {
        super.draw(x, y, r)
        if (this.number === null) {
            return
        }
        Canvas.cx.fillStyle = "#ddd"
        Canvas.cx.beginPath()
        Canvas.cx.arc(x, y, r / 2, 0, Tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
        Canvas.cx.fillStyle =
            this.number === 6 || this.number === 8 ? "#d22" : "222"
        Canvas.cx.fillText(x, y, String(this.number))
    }
}

export default ResourceTile
