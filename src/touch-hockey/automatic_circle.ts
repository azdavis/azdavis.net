import angle from "./angle"
import Circle from "./circle"
import distance from "./distance"
import keepInBounds from "./keep_in_bounds"
import tau from "./tau"

class AutomaticCircle extends Circle {
    move(): void {
    }

    collideWith(other: Circle): void {
    }
}

export default AutomaticCircle
