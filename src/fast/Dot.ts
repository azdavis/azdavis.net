import Canvas from "./Canvas"

class Dot {
    private speed: number
    private size: number
    private x: number
    private y: number

    // call reset(), but then set x to somewhere in the canvas
    public constructor() {
        this.reset()
        this.x = Math.random() * (Canvas.w - this.size)
    }

    // set some canvas things common to all Dots
    public static setUpDraw(): void {
        Canvas.cx.fillStyle = "#bbb"
    }

    // put this directly on the left side of the canvas, at a random y with a
    // random speed
    public reset(): void {
        this.speed = Math.random() * 5 + 5
        this.size = this.speed * 0.7
        this.x = -this.size
        this.y = Math.random() * (Canvas.h - this.size)
    }

    // increase x by speed
    public move(): void {
        this.x += this.speed
    }

    // draw a (dim x dim) box at (x, y)
    public draw(): void {
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
