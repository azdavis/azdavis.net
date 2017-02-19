import Canvas from "./canvas"
import Tau from "./tau"

class BorderHex {
    constructor() {
        this.portCircle = null
    }

    draw(x, y, r) {
        if (this.portCircle === null) {
            return
        }
        this.portCircle.draw()
    }
}

export default BorderHex
