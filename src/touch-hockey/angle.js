import tau from "./tau"

function angle(dx, dy) {
    const a = Math.atan(dy / dx)
    return isNaN(a) ? 0
        : dx < 0 ? tau / 2 + a
        : a
}

export default angle
