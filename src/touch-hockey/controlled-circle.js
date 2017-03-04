import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep-in-bounds"

class ControlledCircle extends Circle {
    controlWith(controllerID) {
        this.controllerID = controllerID
    }

    isControlledBy(controllerID) {
        return this.controllerID === controllerID
    }

    moveTo(x, y) {
        const newx = keepInBounds(this.xmin(), x, this.xmax())
        const newy = keepInBounds(this.ymin(), y, this.ymax())
        const dx = newx - this.x
        const dy = newy - this.y
        this.x = newx
        this.y = newy
        this.speed = distance(dx, dy)
        this.angle = angle(dx, dy)
    }
}

export default ControlledCircle
