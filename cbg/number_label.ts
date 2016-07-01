import Canvas from "./canvas"
import Sprite from "./sprite"

class NumberLabel extends Sprite {
    private static radius = 15
    private static backgroundFill = "#ddd"
    private static font = "20px monospace"
    private nStr: string

    public constructor(protected fill: string, private n: number) {
        super()
        this.nStr = String(n)
    }

    // draw a circle with a number in the center
    public draw(x: number, y: number): void {
        Canvas.ctx.beginPath()
        Canvas.ctx.fillStyle = NumberLabel.backgroundFill
        Canvas.ctx.arc(x, y, NumberLabel.radius, 0, 2 * Math.PI)
        Canvas.ctx.closePath()
        Canvas.ctx.fill()

        Canvas.ctx.fillStyle = this.fill
        Canvas.ctx.font = NumberLabel.font
        Canvas.ctx.fillText(
            this.nStr,
            x - 5.5 * this.nStr.length,
            y + 6
        )
    }
}

export default NumberLabel
