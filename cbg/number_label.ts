import Canvas from "./canvas"
import Sprite from "./sprite"

class NumberLabel extends Sprite {
    protected x: number
    protected y: number
    protected fill = "#ddd"
    protected stroke: string
    private radius = 10

    public constructor(private n: number) {
        super()
        this.x = 0
        this.y = 0
        this.stroke =
            n === 6 || n === 8 ?
            "#a22" :
            "#222"
    }

    protected draw(): void {
        super.draw()
        Canvas.ctx.beginPath()
        Canvas.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        Canvas.ctx.fill()
        Canvas.ctx.stroke()
    }
}

export default NumberLabel
