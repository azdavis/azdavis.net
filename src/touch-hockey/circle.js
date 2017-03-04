import Canvas from "./canvas"
import distance from "./distance"
import tau from "./tau"

class Circle {
    constructor(
        x
      , y
      , lt
      , rt
      , up
      , dn
      , radius
      , color
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

    draw() {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.beginPath()
        Canvas.cx.arc(this.x, this.y, this.radius(), 0, tau)
        Canvas.cx.closePath()
        Canvas.cx.fill()
    }

    stop() {
        this.angle = 0
        this.speed = 0
    }

    reset() {
        this.x = this.xorig
        this.y = this.yorig
        this.stop()
    }

    overlaps(other: Circle) {
        return distance(other.x - this.x, other.y - this.y)
             < other.radius() + this.radius()
    }

    contains(x, y) {
        return distance(x - this.x, y - this.y)
             < this.radius()
    }
}

export default Circle
