import Canvas from "./Canvas"

class Rut {
    private static text = "Rüt"
    // the text sits in the middle of a (w x h) box
    private static w = 5
    private static h = 1
    // the angle formed by a right triangle with legs w and h
    private static a = Math.atan(Rut.h / Rut.w)

    public size: number // increases until out of bounds
    public dx: number // randomly generated
    public dy: number // randomly generated
    private x: number // dependent upon size and dx
    private y: number // dependent upon size and dy
    private color: string // randomly generated

    public constructor() {
        this.reset()
    }

    public reset(): void {
        this.color = `hsl(${Math.random() * 360}, 60%, 60%)`
        this.size = 1

        const a = Math.random() * 2 * Math.PI
        if (0 <= a && a < Rut.a || 2 * Math.PI - Rut.a < a) {
            this.dx = Rut.w
            this.dy = Rut.w * Math.tan(a)
        } else if (Rut.a <= a && a < Math.PI - Rut.a) {
            this.dx = Rut.h / Math.tan(a)
            this.dy = -Rut.h
        } else if (Math.PI - Rut.a <= a && a < Math.PI + Rut.a) {
            this.dx = -Rut.w
            this.dy = Rut.w * Math.tan(a)
        } else {
            this.dx = -Rut.h / Math.tan(a)
            this.dy = Rut.h
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
        Canvas.cx.font = `bold small-caps ${this.size}px serif`
        Canvas.cx.fillStyle = this.color
        Canvas.cx.fillText(Rut.text, this.x, this.y)
    }

    public isOutOfBounds(): boolean {
        const hw = Rut.w * this.size / 2
        const hh = Rut.h * this.size / 2
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

export default Rut
