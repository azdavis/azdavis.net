import Canvas from "./canvas"
import NumberDots from "./number-dots"
import ResourceColors from "./resource-colors"

class ResourceHex {
    constructor(resource, number) {
        this.resource = resource
        this.number = number
    }

    draw(x, y, r) {
        Canvas.drawHex(x, y, r, ResourceColors[this.resource])
        if (this.number === null) {
            return
        }
        Canvas.drawCircle(x, y, r / 2.5, "#ddd")
        Canvas.cx.font = `${r / 35}em sans-serif`
        Canvas.cx.fillStyle = NumberDots[this.number] === 5 ? "#d22" : "#222"
        Canvas.cx.fillText(String(this.number), x, y)
    }
}

export default ResourceHex
