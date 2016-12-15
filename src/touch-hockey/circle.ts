import angle from "./angle"
import Canvas from "./canvas"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"
import tau from "./tau"

const radius = 50
const radius2 = radius * 2

class Circle {
    x: number
    y: number
    xmin: () => number
    xmax: () => number
    ymin: () => number
    ymax: () => number
    color: string
    angle: number
    speed: number

    constructor(
        x: number
      , y: number
      , lt: () => number
      , rt: () => number
      , up: () => number
      , dn: () => number
      , color: string
    ) {
        this.x = x
        this.y = y
        this.xmin = () => lt() + radius
        this.xmax = () => rt() - radius
        this.ymin = () => up() + radius
        this.ymax = () => dn() - radius
        this.color = color
        this.stop()
    }

    draw(): void {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.beginPath()
        Canvas.cx.arc(this.x, this.y, radius, 0, tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }

    moveTo(x: number, y: number): void {
        const boundedX = keepInBounds(this.xmin(), x, this.xmax())
        const boundedY = keepInBounds(this.ymin(), y, this.ymax())
        const dx = boundedX - this.x
        const dy = boundedY - this.y
        this.x = boundedX
        this.y = boundedY
        this.angle = angle(dx, dy)
        this.speed = distance(dx, dy)
    }

    stop(): void {
        this.angle = 0
        this.speed = 0
    }

    overlaps(other: Circle): boolean {
        return distance(other.x - this.x, other.y - this.y) < radius2
    }

    contains(x: number, y: number): boolean {
        return distance(x - this.x, y - this.y) < radius
    }
}

export default Circle
