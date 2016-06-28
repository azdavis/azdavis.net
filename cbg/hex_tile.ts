import Canvas from "./canvas"
import NumberLabel from "./number_label"
import Sprite from "./sprite"

class HexTile extends Sprite {
    protected x: number
    protected y: number
    protected fill: string
    protected stroke: string
    private sideLength = 30
    private label: NumberLabel

    public constructor() {
        super()
    }

    protected draw(): void {}
}

export default HexTile
