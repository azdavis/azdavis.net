import angle from "./angle"
import Canvas from "./canvas"
import distance from "./distance"
import tau from "./tau"

const radius = 50
const radius2 = radius * 2

class Circle {
    x: number
    y: number
    angle: number
    speed: number
    color: string

    constructor(x: number, y: number, color: string) {
        this.x = x
        this.y = y
        this.stop()
        this.color = color
    }

    draw(): void {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.beginPath()
        Canvas.cx.arc(this.x, this.y, radius, 0, tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }

    moveTo(x: number, y: number): void {
        const dx = x - this.x
        const dy = y - this.y
        this.x = x
        this.y = y
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
}

export default Circle
