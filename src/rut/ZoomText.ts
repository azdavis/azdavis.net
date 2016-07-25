import Canvas from "./Canvas"

class ZoomText {
    private static text = "Rüt"
    private static font = (() => {
        const hs = getComputedStyle(document.documentElement)
        return {
            f: hs.fontFamily,
            v: hs.fontVariant,
        }
    })()
    // the text sits in the middle of a (w x h) box
    private static w = 5
    private static h = 1
    // the angle formed by a right triangle with legs w and h
    private static a = Math.atan(ZoomText.h / ZoomText.w)

    public size: number
    public dx: number
    public dy: number
    private x: number
    private y: number
    private color: string

    // just reset
    public constructor() {
        this.reset()
    }

    // increase size expontentially and calculate x and y based on the new
    // size; then, if out of bounds, reset back to the center
    public move(): void {
        this.size *= 1.03
        this.calcXY()
        if (this.isOutOfBounds()) {
            this.reset()
        }
    }

    // draw the text with this.font and this.color
    public draw(): void {
        Canvas.cx.font = `${ZoomText.font.v} ${this.size}px ${ZoomText.font.f}`
        Canvas.cx.fillStyle = this.color
        Canvas.cx.fillText(ZoomText.text, this.x, this.y)
    }

    // set a random color, set size to almost nothing, and determine in what
    // direction this moves and how quickly
    private reset(): void {
        this.color = `hsl(${Math.random() * 360}, 60%, 60%)`
        this.size = 1

        const a = Math.random() * 2 * Math.PI
        const t = Math.tan(a)
        if (0 <= a && a < ZoomText.a || 2 * Math.PI - ZoomText.a < a) {
            this.dx = ZoomText.w
            this.dy = ZoomText.w * t
        } else if (ZoomText.a <= a && a < Math.PI - ZoomText.a) {
            this.dx = ZoomText.h / t
            this.dy = -ZoomText.h
        } else if (Math.PI - ZoomText.a <= a && a < Math.PI + ZoomText.a) {
            this.dx = -ZoomText.w
            this.dy = ZoomText.w * t
        } else {
            this.dx = -ZoomText.h / t
            this.dy = ZoomText.h
        }

        const s = 4 + Math.random() * 16
        this.dx *= s
        this.dy *= s
        this.calcXY()
    }

    // return whether this is completely outside the canvas
    private isOutOfBounds(): boolean {
        const hw = ZoomText.w * this.size / 2
        const hh = ZoomText.h * this.size / 2
        return this.x + hw < 0
            || this.x - hw > Canvas.w
            || this.y + hh < 0
            || this.y - hh > Canvas.h
    }

    // calculate x and y based on the canvas's dimensions, this.size, and
    // this.d{x,y}
    private calcXY(): void {
        this.x = Canvas.w / 2 + this.size * this.dx
        this.y = Canvas.h / 2 + this.size * this.dy
    }
}

export default ZoomText
