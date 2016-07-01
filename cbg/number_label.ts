import Canvas from "./canvas"
import Sprite from "./sprite"

class NumberLabel extends Sprite {
    private static radius = 15
    private static backgroundFill = "#ddd"
    private static font = "20px monospace"
    protected x: number
    protected y: number
    private nStr: string

    public constructor(protected fill: string, private n: number) {
        // HexTile#constructor calls this.setCenter
        super(0, 0)
        this.nStr = String(n)
    }

    // draw a circle with a number in the center
    public draw(): void {
        Canvas.ctx.beginPath()
        Canvas.ctx.fillStyle = NumberLabel.backgroundFill
        Canvas.ctx.arc(this.x, this.y, NumberLabel.radius, 0, 2 * Math.PI)
        Canvas.ctx.closePath()
        Canvas.ctx.fill()

        Canvas.ctx.fillStyle = this.fill
        Canvas.ctx.font = NumberLabel.font
        Canvas.ctx.fillText(
            this.nStr,
            this.x - 5.5 * this.nStr.length,
            this.y + 6
        )
    }

    public setCenter(x: number, y: number): void {
        this.x = x
        this.y = y
    }
}

export default NumberLabel
