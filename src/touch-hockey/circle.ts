import Canvas from "./canvas"
import distance from "./distance"
import tau from "./tau"

class Circle {
    x: number
    y: number
    radius: number
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
      , radius: number
      , xmin: () => number
      , xmax: () => number
      , ymin: () => number
      , ymax: () => number
      , color: string
    ) {
        this.x = x
        this.y = y
        this.radius = radius
        this.xmin = xmin
        this.xmax = xmax
        this.ymin = ymin
        this.ymax = ymax
        this.color = color
        this.stop()
    }

    draw(): void {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.beginPath()
        Canvas.cx.arc(this.x, this.y, this.radius, 0, tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }

    stop(): void {
        this.angle = 0
        this.speed = 0
    }

    overlaps(other: Circle): boolean {
        return distance(other.x - this.x, other.y - this.y)
             < other.radius + this.radius
    }

    contains(x: number, y: number): boolean {
        return distance(x - this.x, y - this.y)
             < this.radius
    }
}

export default Circle
