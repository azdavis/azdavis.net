import Canvas from "./Canvas"

abstract class Sprite {
    public w: number
    public h: number

    public i = 0
    public j = 0

    protected fill: string
    protected stroke = "#222"
    protected speed: number

    // set x and y as the coordinates for this
    public constructor(public x: number, public y: number) {}

    // move this a magnitude of this.speed in the direction indicated by the
    // vector with components this.i and this.j
    public move(): void {
        if (this.i === 0 && this.j === 0) {
            return
        }
        const h = Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2))
        this.x += this.speed * this.i / h
        this.y += this.speed * this.j / h
    }

    // draw this on the canvas
    public draw(): void {
        Canvas.cx.fillStyle = this.fill
        Canvas.cx.fillRect(this.x, this.y, this.w, this.h)
        Canvas.cx.strokeStyle = this.stroke
        Canvas.cx.strokeRect(this.x, this.y, this.w, this.h)
    }

    // return whether any part of this overlaps any part of s
    public overlaps(s: Sprite): boolean {
        return this.encloses(s.x, s.y)
            || this.encloses(s.x + s.w, s.y)
            || this.encloses(s.x, s.y + s.h)
            || this.encloses(s.x + s.w, s.y + s.h)
    }

    // return whether a point (x, y) is enclosed in this
    private encloses(x: number, y: number): boolean {
        return this.x <= x && x <= this.x + this.w
            && this.y <= y && y <= this.y + this.h
    }
}

export default Sprite
