import Canvas from "./canvas"
import distance from "./distance"
import tau from "./tau"

class Circle {
    x: number
    y: number
    xorig: number
    yorig: number
    radius: () => number
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
      , radius: () => number
      , lt: () => number
      , rt: () => number
      , up: () => number
      , dn: () => number
      , color: string
    ) {
        this.x = this.xorig = x
        this.y = this.yorig = y
        this.radius = radius
        this.xmin = () => lt() + radius()
        this.xmax = () => rt() - radius()
        this.ymin = () => up() + radius()
        this.ymax = () => dn() - radius()
        this.color = color
        this.stop()
    }

    draw(): void {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.beginPath()
        Canvas.cx.arc(this.x, this.y, this.radius(), 0, tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }

    stop(): void {
        this.angle = 0
        this.speed = 0
    }

    reset(): void {
        this.x = this.xorig
        this.y = this.yorig
        this.stop()
    }

    overlaps(other: Circle): boolean {
        return distance(other.x - this.x, other.y - this.y)
             < other.radius() + this.radius()
    }

    contains(x: number, y: number): boolean {
        return distance(x - this.x, y - this.y)
             < this.radius()
    }
}

export default Circle