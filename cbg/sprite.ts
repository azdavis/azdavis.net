import Canvas from "./canvas"

abstract class Sprite {
    protected x: number
    protected y: number
    protected fill: string
    protected stroke: string

    protected draw(): void {
        Canvas.ctx.fillStyle = this.fill
        Canvas.ctx.strokeStyle = this.stroke
    }
}

export default Sprite
