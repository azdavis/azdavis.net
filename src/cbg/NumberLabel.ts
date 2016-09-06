import Canvas from "./Canvas"
import Sprite from "./Sprite"

class NumberLabel extends Sprite {
    private static radius = 14
    private static style = (() => {
        const hs = getComputedStyle(document.documentElement)
        return {
            fill: hs.color,
            font: `${hs.fontWeight} ${hs.fontSize} ${hs.fontFamily}`,
        }
    })()

    private n: string

    // set properties
    public constructor(protected fill: string, n: number) {
        super()
        this.n = String(n)
    }

    public static setTextSettings(): void {
        Canvas.cx.font = NumberLabel.style.font
        Canvas.cx.textAlign = "center"
        Canvas.cx.textBaseline = "middle"
    }

    // draw a circle with a number in the center
    public draw(x: number, y: number): void {
        Canvas.cx.fillStyle = NumberLabel.style.fill as string
        Canvas.cx.beginPath()
        Canvas.cx.arc(x, y, NumberLabel.radius, 0, 2 * Math.PI)
        Canvas.cx.closePath()
        Canvas.cx.fill()
        Canvas.cx.fillStyle = this.fill
        Canvas.cx.fillText(this.n, x, y)
    }
}

export default NumberLabel
