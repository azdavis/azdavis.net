import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"

class ControlledCircle extends Circle {
    id: string

    controlWith(id: string): void {
        this.id = id
    }

    isControlledBy(id: string): boolean {
        return this.id === id
    }

    moveTo(x: number, y: number): void {
    }
}

export default ControlledCircle
