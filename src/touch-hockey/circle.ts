import angle from "./angle"
import Canvas from "./canvas"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"
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

    public moveTo(x: number, y: number): void {
        const boundedX = keepInBounds(this.xmin(), x, this.xmax())
        const boundedY = keepInBounds(this.ymin(), y, this.ymax())
        const dx = boundedX - this.x
        const dy = boundedY - this.y
        this.x = boundedX
        this.y = boundedY
        this.angle = angle(dx, dy)
        this.speed = distance(dx, dy)
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
