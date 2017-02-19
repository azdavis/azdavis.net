import Canvas from "./canvas"
import NumberCircle from "./number-circle"

class ResourceHex {
    constructor() {
        this.numberCircle = null
        this.type = null
    }

    draw(x, y, r) {
        Canvas.drawCircle(x, y, r, ResourceColors[this.type])
        if (this.numberCircle === null) {
            return
        }
        tihs.numberCircle.draw()
    }
}

export default ResourceHex
