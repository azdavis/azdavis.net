import Canvas from "./canvas"
import distance from "./distance"
import tau from "./tau"

class Circle {
    private x: number
    private y: number
    private radius: number
    private diameter: number
    private xmin: () => number
    private xmax: () => number
    private ymin: () => number
    private ymax: () => number
    private color: string
    private angle: number
    private speed: number

    public constructor(
        x: number
      , y: number
      , radius: number
      , lt: () => number
      , rt: () => number
      , up: () => number
      , dn: () => number
      , color: string
    ) {
        this.x = x
        this.y = y
        this.radius = radius
        this.diameter = radius * 2
        this.xmin = () => lt() + this.radius
        this.xmax = () => rt() - this.radius
        this.ymin = () => up() + this.radius
        this.ymax = () => dn() - this.radius
        this.color = color
        this.stop()
    }

    public draw(): void {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.beginPath()
        Canvas.cx.arc(this.x, this.y, this.radius, 0, tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }

    public stop(): void {
        this.angle = 0
        this.speed = 0
    }

    public overlaps(other: Circle): boolean {
        return distance(other.x - this.x, other.y - this.y) < this.diameter
    }

    public contains(x: number, y: number): boolean {
        return distance(x - this.x, y - this.y) < this.radius
    }
}

export default Circle
