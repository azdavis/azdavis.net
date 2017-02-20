import Canvas from "./canvas"
import ResourceColors from "./resource-colors"

class ResourceHex {
    constructor(resource, numberCircle) {
        this.resource = resource
        this.numberCircle = numberCircle
    }

    draw(x, y, r) {
        Canvas.drawHex(x, y, r, ResourceColors[this.resource])
        if (this.numberCircle !== null) {
            this.numberCircle.draw(x, y, r / 2.5)
        }
    }
}

export default ResourceHex
