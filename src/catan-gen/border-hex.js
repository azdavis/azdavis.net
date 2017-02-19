import Canvas from "./canvas"
import Tau from "./tau"

class BorderHex {
    constructor() {
        this.port = null
    }

    draw(x, y, r) {
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

export default BorderHex
