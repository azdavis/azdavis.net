import Canvas from "./canvas"
import NumberCircle from "./number-circle"

class ResourceHex {
    constructor(type, numberCircle) {
        this.type = type
        this.numberCircle = numberCircle
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
