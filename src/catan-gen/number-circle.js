import Canvas from "./canvas"

class NumberCicle {
    constructor(number) {
        this.number = number
    }

    draw(x, y, r) {
        Canvas.cx.textAlign = "center"
        Canvas.cx.textBaseline = "middle"
        Canvas.drawCircle(x, y, r, "#ddd")
        Canvas.cx.font = this.font()
        Canvas.cx.fillStyle = this.fillStyle()
        Canvas.cx.fillText(String(this.number), x, y)
    }

    fontSize() {
        switch (this.number) {
        case 2: case 12: return 0.5
        case 3: case 11: return 0.75
        case 4: case 10: return 1
        case 5: case 9: return 1.25
        case 6: case 8: return 1.5
        }
    }

    font() {
        return `${this.fontSize()}em sans-serif`
    }

    fillStyle() {
        return this.number === 6 || this.number === 8 ? "#d22" : "#222"
    }
}
