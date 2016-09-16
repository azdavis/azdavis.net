import Canvas from "./Canvas"

class Dot {
    private speed: number
    private size: number
    private color: string
    private x: number
    private y: number

    // call reset(), but then set x to somewhere in the canvas
    public constructor() {
        this.reset()
        this.x = Math.random() * (Canvas.w - this.size)
    }

    // put this directly on the left side of the canvas, at a random y with a
    // random speed, size, and color
    public reset(): void {
        const r1 = Math.random()
        const r2 = Math.round(225 - r1 * 50)
        this.speed = r1 * 8 + 3
        this.size = r1 * 10 + 1
        this.color = `rgb(${r2},${r2},${r2})`
        this.x = -this.size
        this.y = Math.random() * (Canvas.h - this.size)
    }

    // increase x by speed
    public move(): void {
        this.x += this.speed
    }

    // draw a (dim x dim) box at (x, y)
    public draw(): void {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.fillRect(
            this.x,
            this.y,
            this.size,
            this.size
        )
    }

    // is x > canvas width?
    public isOutOfBounds(): boolean {
        return this.x > Canvas.w
    }
}

export default Dot
