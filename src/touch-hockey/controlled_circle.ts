import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"

class ControlledCircle extends Circle {
    private id: string

    public controlWith(id: string): void {
        this.id = id
    }

    public isControlledBy(id: string): boolean {
        return this.id === id
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
}

export default ControlledCircle
