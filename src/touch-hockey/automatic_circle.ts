import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"
import tau from "./tau"

class AutomaticCircle extends Circle {
    move(): void {
        this.x = keepInBounds(
            this.xmin()
          , this.x + this.speed * Math.cos(this.angle)
          , this.xmax()
        )
        this.y = keepInBounds(
            this.ymin()
          , this.y + this.speed * Math.sin(this.angle)
          , this.ymax()
        )
        if (this.x === this.xmin() || this.x === this.xmax()) {
            this.angle = tau / 2 - this.angle
        } else if (this.y === this.ymin() || this.y === this.ymax()) {
            this.angle = -this.angle
        }
    }

    collideWith(other: Circle): void {
        const phi = angle(other.y - this.y, other.x - this.x)
        const a = other.speed * Math.cos(other.angle - phi)
        const b = this.speed * Math.sin(this.angle - phi)
        const x = a * Math.cos(phi) + b * Math.cos(phi * tau / 4)
        const y = a * Math.sin(phi) + b * Math.sin(phi * tau / 4)
        this.speed = distance(x, y)
        this.angle = angle(x, y)
    }
}

export default AutomaticCircle
