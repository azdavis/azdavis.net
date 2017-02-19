import Canvas from "./canvas"
import ResourceColors from "./resource-colors"

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
        tihs.numberCircle.draw(x, y, r / 2)
    }
}

export default ResourceHex
