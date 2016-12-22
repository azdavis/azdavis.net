import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"
import tau from "./tau"

class AutomaticCircle extends Circle {
    move(): void {
        const xnew = keepInBounds(
            this.xmin()
          , this.x + this.speed * Math.cos(this.angle)
          , this.xmax()
        )
        const ynew = keepInBounds(
            this.ymin()
          , this.y + this.speed * Math.sin(this.angle)
          , this.ymax()
        )
        if (xnew === this.xmin() || xnew === this.xmax()) {
            this.angle = tau / 2 - this.angle
        } else if (ynew === this.ymin() || ynew === this.ymax()) {
            this.angle = -this.angle
        }
        this.x = xnew
        this.y = ynew
    }

    collideWith(other: Circle): void {
        const phi = angle(other.y - this.y, other.x - this.x)
        const a = other.speed * Math.cos(other.angle - phi)
        const b = this.speed * Math.sin(this.angle - phi)
        const x = a * Math.cos(phi) + b * Math.cos(phi + tau / 4)
        const y = a * Math.sin(phi) + b * Math.sin(phi + tau / 4)
        this.speed = distance(x, y)
        this.angle = angle(x, y)
    }
}

export default AutomaticCircle
