import Canvas from "./Canvas"
import Sprite from "./Sprite"

class NumberLabel extends Sprite {
    private static radius = 15
    private static style = (() => {
        const hs = getComputedStyle(document.documentElement)
        return {
            fill: hs.color,
            font: `${hs.fontSize} ${hs.fontFamily}`,
        }
    })()

    private n: string

    // set properties
    public constructor(protected fill: string, n: number) {
        super()
        this.n = String(n)
    }

    // draw a circle with a number in the center
    public draw(x: number, y: number): void {
        Canvas.cx.fillStyle = NumberLabel.style.fill
        Canvas.cx.beginPath()

        Canvas.cx.arc(x, y, NumberLabel.radius, 0, 2 * Math.PI)

        Canvas.cx.closePath()
        Canvas.cx.fill()

        Canvas.cx.fillStyle = this.fill
        Canvas.cx.font = NumberLabel.style.font
        Canvas.cx.textAlign = "center"
        Canvas.cx.textBaseline = "middle"

        Canvas.cx.fillText(this.n, x, y)
    }
}

export default NumberLabel
