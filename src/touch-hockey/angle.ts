import tau from "./tau"

function angle(dx: number, dy: number): number {
    const angle = Math.atan(dy / dx)
    return dx < 0 ? tau / 2 + angle : angle
}

export default angle
