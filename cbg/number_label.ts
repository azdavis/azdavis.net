import Canvas from "./canvas"
import Sprite from "./sprite"

class NumberLabel extends Sprite {
    private static radius = 10
    protected x: number
    protected y: number
    protected fill = "#ddd"

    public constructor(private n: number) {
        super(0, 0)
        this.fill =
            n === 6 || n === 8 ?
            "#a22" :
            "#222"
    }

    protected draw(): void {
        Canvas.ctx.fillStyle = this.fill
        Canvas.ctx.arc(this.x, this.y, NumberLabel.radius, 0, 2 * Math.PI)
        Canvas.ctx.fill()
        Canvas.ctx.fillText(String(this.n), this.x, this.y)
    }
}

export default NumberLabel
