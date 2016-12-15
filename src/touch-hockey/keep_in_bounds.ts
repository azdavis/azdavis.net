function keepInBounds(xmin: number, x: number, xmax: number): number {
    return Math.min(Math.max(xmin, x), xmax)
}

export default keepInBounds
