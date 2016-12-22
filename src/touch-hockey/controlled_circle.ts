import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"

class ControlledCircle extends Circle {
    id: string

    controlWith(id: string): void {
        this.id = id
    }

    isControlledBy(id: string): boolean {
        return this.id === id
    }

    moveTo(x: number, y: number): void {
        const xnew = keepInBounds(this.xmin(), x, this.xmax())
        const ynew = keepInBounds(this.ymin(), y, this.ymax())
        const dx = xnew - this.x
        const dy = ynew - this.y
        this.x = xnew
        this.y = ynew
        this.angle = angle(dx, dy)
        this.speed = distance(dx, dy)
    }
}

export default ControlledCircle
