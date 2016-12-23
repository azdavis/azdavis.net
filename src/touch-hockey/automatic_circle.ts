import angle from "./angle"
import Circle from "./circle"
import ControlledCircle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"
import tau from "./tau"

class AutomaticCircle extends Circle {
    move(): void {
        const dx = this.speed * Math.cos(this.angle)
        const dy = this.speed * Math.sin(this.angle)
        const newx = keepInBounds(this.xmin(), this.x + dx, this.xmax())
        const newy = keepInBounds(this.ymin(), this.y + dy, this.ymax())
        if (newx === this.xmin() || newx === this.xmax()) {
            this.angle = tau / 2 - this.angle
        }
        if (newy === this.ymin() || newy === this.ymax()) {
            this.angle *= -1
        }
        this.x = newx
        this.y = newy
    }

    collideWith(other: ControlledCircle): void {
    }
}

export default AutomaticCircle
