import Canvas from "./Canvas"

class Dot {
    private static dim = 3
    private x: number
    private y: number
    private speed: number

    // call reset(), but then set x to somewhere in the canvas
    public constructor() {
        this.reset()
        this.x = Math.random() * (Canvas.w - Dot.dim)
    }

    // set some canvas things common to all Dots
    public static setUpDraw(): void {
        Canvas.cx.fillStyle = "#ccc"
    }

    // put this directly on the left side of the canvas, at a random y with a
    // random speed
    public reset(): void {
        this.x = -Dot.dim
        this.y = Math.random() * (Canvas.h - Dot.dim)
        this.speed = Math.random() * 5 + 5
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
            Dot.dim,
            Dot.dim
        )
    }

    // is x > canvas width?
    public isOutOfBounds(): boolean {
        return this.x > Canvas.w
    }
}

export default Dot
