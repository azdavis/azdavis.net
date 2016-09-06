import Canvas from "./Canvas"
import NumberLabel from "./NumberLabel"
import Sprite from "./Sprite"

class HexTile extends Sprite {
    // this depicts the top one of the six equilateral triangles which fit
    // inside a hexagon. point O is the center of the hexagon. the hexagon is
    // (2 * c) wide and (2 * a) tall.
    //
    //      |        c        |
    //      |   b    |    b   |
    //      ___________________
    //  -   \        |        /   -
    //       \       |       /
    //        \      | <- a /
    //         \     |     /
    //      c   \    |    /   c
    //           \   |   /
    //            \  |  /
    //             \ | /
    //          -   \|/   -
    //               O

    public static c = 30
    public static b = HexTile.c / 2
    public static a = HexTile.b * Math.sqrt(3)

    // set properties
    public constructor(
        protected fill: string,
        private label: NumberLabel | null
    ) {
        super()
    }

    // draw a hexagon tile, centered at (x, y), and its label, if it has one
    public draw(x: number, y: number): void {
        Canvas.cx.fillStyle = this.fill
        Canvas.cx.beginPath()

        Canvas.cx.moveTo(x - HexTile.b, y - HexTile.a)
        Canvas.cx.lineTo(x + HexTile.b, y - HexTile.a)
        Canvas.cx.lineTo(x + HexTile.c, y)
        Canvas.cx.lineTo(x + HexTile.b, y + HexTile.a)
        Canvas.cx.lineTo(x - HexTile.b, y + HexTile.a)
        Canvas.cx.lineTo(x - HexTile.c, y)

        Canvas.cx.closePath()
        Canvas.cx.fill()

        if (this.label !== null) {
            this.label.draw(x, y)
        }
    }
}

export default HexTile
