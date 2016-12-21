import Canvas from "./canvas"
import distance from "./distance"
import tau from "./tau"

class Circle {
    protected x: number
    protected y: number
    protected radius: number
    protected xmin: () => number
    protected xmax: () => number
    protected ymin: () => number
    protected ymax: () => number
    protected color: string
    protected angle: number
    protected speed: number

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
        return distance(other.x - this.x, other.y - this.y)
             < other.radius + this.radius
    }

    public contains(x: number, y: number): boolean {
        return distance(x - this.x, y - this.y)
             < this.radius
    }
}

export default Circle
