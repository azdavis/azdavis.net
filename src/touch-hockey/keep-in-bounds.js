function keepInBounds(xmin, x, xmax) {
    return Math.min(Math.max(xmin, x), xmax)
}

export default keepInBounds
