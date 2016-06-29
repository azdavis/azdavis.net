import Canvas from "./canvas"
import NumberLabel from "./number_label"
import Sprite from "./sprite"

class HexTile extends Sprite {
    private static side = 30
    protected x: number
    protected y: number
    protected fill: string

    public constructor(private label: NumberLabel) {
        super(0, 0)
    }

    // draw a hexagon, centered at (this.x, this.y)
    protected draw(): void {
        const sideHalf = HexTile.side / 2
        const xOff = sideHalf * Math.sqrt(3)
        Canvas.ctx.fillStyle = this.fill

        Canvas.ctx.moveTo(this.x, this.y - HexTile.side)
        Canvas.ctx.beginPath()
        Canvas.ctx.lineTo(this.x + xOff, this.y - sideHalf)
        Canvas.ctx.lineTo(this.x + xOff, this.y + sideHalf)
        Canvas.ctx.lineTo(this.x, this.y + HexTile.side)
        Canvas.ctx.lineTo(this.x - xOff, this.y + sideHalf)
        Canvas.ctx.lineTo(this.x - xOff, this.y - sideHalf)

        Canvas.ctx.closePath()
        Canvas.ctx.fill()
    }
}

export default HexTile
