import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"

class ControlledCircle extends Circle {
    controllerID: string

    controlWith(controllerID: string): void {
        this.controllerID = controllerID
    }

    isControlledBy(controllerID: string): boolean {
        return this.controllerID === controllerID
    }

    moveTo(x: number, y: number): void {
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
