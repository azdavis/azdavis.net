import Canvas from "./canvas"
import ResourceColors from "./resource-colors"

class BorderHex {
    constructor(port) {
        this.port = port
    }

    draw(x, y, r) {
        Canvas.drawHex(x, y, r, "#06c")
        if (this.port === null) {
            return
        }
        Canvas.drawCircle(x, y, r / 2.5, this.portColor())
    }

    portColor() {
        return this.port in ResourceColors
            ? ResourceColors[this.resource]
            : "#ddd"
    }
}

export default BorderHex
