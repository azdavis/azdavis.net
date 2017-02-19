import Canvas from "./canvas"
import Tau from "./tau"

class BorderHex {
    constructor(portCircle) {
        this.portCircle = portCircle
    }

    draw(x, y, r) {
        Canvas.drawHex(x, y, r, "#22d")
        if (this.portCircle === null) {
            return
        }
        this.portCircle.draw()
    }
}

export default BorderHex
