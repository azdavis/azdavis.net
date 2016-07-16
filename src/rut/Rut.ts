import Canvas from "./Canvas"

class Rut {
    private static text = "rüt"
    private static font = getComputedStyle(document.documentElement).fontFamily

    private x: number
    private y: number

    private speed: number
    private size: number
    private color: string

    public constructor(private angle: number) {
        this.x = Canvas.center.x
        this.y = Canvas.center.y
        this.speed = 1
        this.size = 20
        this.color = "#f0f"
    }

    public move(): void {
        // TODO implement
        this.x += this.angle * this.speed
    }

    public draw(): void {
        Canvas.cx.fillStyle = this.color
        Canvas.cx.font = `${this.size}px ${Rut.font}`

        Canvas.cx.fillText(Rut.text, this.x, this.y)
    }
}

export default Rut
