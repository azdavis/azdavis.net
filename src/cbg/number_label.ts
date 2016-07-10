import Canvas from "./canvas"
import Sprite from "./sprite"

class NumberLabel extends Sprite {
    private static radius = 15
    private static backgroundFill = "#ddd"
    private static font = "16px Menlo, Consolas, 'Liberation Mono', monospace"

    private nStr: string

    public constructor(protected fill: string, private n: number) {
        super()
        this.nStr = String(n)
    }

    // draw a circle with a number in the center
    public draw(x: number, y: number): void {
        Canvas.cx.fillStyle = NumberLabel.backgroundFill
        Canvas.cx.beginPath()

        Canvas.cx.arc(x, y, NumberLabel.radius, 0, 2 * Math.PI)

        Canvas.cx.closePath()
        Canvas.cx.fill()

        Canvas.cx.fillStyle = this.fill
        Canvas.cx.font = NumberLabel.font

        Canvas.cx.fillText(
            this.nStr,
            x - 4.6 * this.nStr.length,
            y + 6
        )
    }
}

export default NumberLabel
