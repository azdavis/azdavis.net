import Canvas from "./canvas"

class BorderHex {
    constructor(portCircle) {
        this.portCircle = portCircle
    }

    draw(x, y, r) {
        Canvas.drawHex(x, y, r, "#06c")
        if (this.portCircle !== null) {
            this.portCircle.draw(x, y, r / 2.5)
        }
    }
}

export default BorderHex
