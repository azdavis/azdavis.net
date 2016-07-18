import Canvas from "./Canvas"

class RutText {
    private static text = "Rüt"
    // the text sits in the middle of a (w x h) box
    private static w = 5
    private static h = 1
    // the angle formed by a right triangle with legs w and h
    private static a = Math.atan(RutText.h / RutText.w)

    public size: number
    public dx: number
    public dy: number
    private x: number
    private y: number
    private color: string

    public constructor() {
        this.reset()
    }

    public reset(): void {
        this.color = `hsl(${Math.random() * 360}, 60%, 60%)`
        this.size = 1

        const a = Math.random() * 2 * Math.PI
        if (0 <= a && a < RutText.a || 2 * Math.PI - RutText.a < a) {
            this.dx = RutText.w
            this.dy = RutText.w * Math.tan(a)
        } else if (RutText.a <= a && a < Math.PI - RutText.a) {
            this.dx = RutText.h / Math.tan(a)
            this.dy = -RutText.h
        } else if (Math.PI - RutText.a <= a && a < Math.PI + RutText.a) {
            this.dx = -RutText.w
            this.dy = RutText.w * Math.tan(a)
        } else {
            this.dx = -RutText.h / Math.tan(a)
            this.dy = RutText.h
        }

        const s = 5 + Math.random() * 15
        this.dx *= s
        this.dy *= s
        this.getXY()
    }

    public move(): void {
        this.size *= 1.01
        this.getXY()
    }

    public draw(): void {
        Canvas.cx.font = `small-caps ${this.size}px serif`
        Canvas.cx.fillStyle = this.color
        Canvas.cx.fillText(RutText.text, this.x, this.y)
    }

    public isOutOfBounds(): boolean {
        const hw = RutText.w * this.size / 2
        const hh = RutText.h * this.size / 2
        return this.x + hw < 0
            || this.x - hw > Canvas.w
            || this.y + hh < 0
            || this.y - hh > Canvas.h
    }

    private getXY(): void {
        this.x = Canvas.w / 2 + this.size * this.dx
        this.y = Canvas.h / 2 + this.size * this.dy
    }
}

export default RutText