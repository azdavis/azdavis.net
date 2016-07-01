import Canvas from "./canvas"
import Sprite from "./sprite"

class NumberLabel extends Sprite {
    private static radius = 10
    private static backgroundFill = "#ddd"
    protected x: number
    protected y: number

    public constructor(protected fill: string, private n: number) {
        super(0, 0)
    }

    // draw a circle with a number in the center
    public draw(): void {
        Canvas.ctx.arc(this.x, this.y, NumberLabel.radius, 0, 2 * Math.PI)
        Canvas.ctx.fillStyle = NumberLabel.backgroundFill
        Canvas.ctx.fill()
        Canvas.ctx.fillStyle = this.fill
        Canvas.ctx.fillText(String(this.n), this.x, this.y)
    }
}

export default NumberLabel
