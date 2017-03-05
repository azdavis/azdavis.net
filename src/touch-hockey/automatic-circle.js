import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep-in-bounds"
import tau from "./tau"

class AutomaticCircle extends Circle {
    move() {
        this.speed *= 0.992
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

    collideWith(other) {
        if (!this.overlaps(other)) {
            return
        }
        const phi = angle(this.x - other.x, this.y - other.y)
        const dx = other.speed * Math.cos(other.angle - phi)
                 - this.speed * Math.cos(this.angle - phi)
        const dy = this.speed * Math.sin(this.angle - phi)
        const radii = this.radius() + other.radius()
        this.x = other.x + radii * Math.cos(phi)
        this.y = other.y + radii * Math.sin(phi)
        this.speed = distance(dx, dy)
        this.angle = phi + angle(dx, dy)
    }
}

export default AutomaticCircle
