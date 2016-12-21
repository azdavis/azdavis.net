import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import tau from "./tau"

class AutomaticCircle extends Circle {
    collide(other: Circle): void {
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
