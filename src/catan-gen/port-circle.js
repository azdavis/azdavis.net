import Canvas from "./canvas"
import ResourceColors from "./resource-colors"

class PortCircle {
    constructor(resource) {
        this.resource = resource
    }

    draw(x, y, r) {
        Canvas.drawCircle(x, y, r, ResourceColors[this.resource])
    }
}

export default PortCircle
