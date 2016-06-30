import Canvas from "./canvas"
import NumberLabel from "./number_label"
import Sprite from "./sprite"

class HexTile extends Sprite {
    private static side = 30
    private static halfSide = HexTile.side / 2
    private static xLeg = HexTile.halfSide * Math.sqrt(3)
    protected x: number
    protected y: number
    protected fill: string

    public constructor(private label: NumberLabel) {
        super(0, 0)
    }

    // draw a hexagon, centered at (this.x, this.y)
    protected draw(): void {
        Canvas.ctx.fillStyle = this.fill

        Canvas.ctx.moveTo(this.x, this.y - HexTile.side)
        Canvas.ctx.beginPath()
        Canvas.ctx.lineTo(this.x + HexTile.xLeg, this.y - HexTile.halfSide)
        Canvas.ctx.lineTo(this.x + HexTile.xLeg, this.y + HexTile.halfSide)
        Canvas.ctx.lineTo(this.x, this.y + HexTile.side)
        Canvas.ctx.lineTo(this.x - HexTile.xLeg, this.y + HexTile.halfSide)
        Canvas.ctx.lineTo(this.x - HexTile.xLeg, this.y - HexTile.halfSide)

        Canvas.ctx.closePath()
        Canvas.ctx.fill()
    }
}

export default HexTile
