import Canvas from "./canvas"
import ResourceColors from "./resource-colors"

class PortCircle {
    constructor(type) {
        this.type = type
    }

    draw(x, y, r) {
        Canvas.drawCircle(x, y, r, ResourceColors[this.type])
    }
}

export default PortCircle
