import Canvas from "./canvas"

class NumberCicle {
    constructor(number) {
        this.number = number
    }

    draw(x, y, r) {
        Canvas.drawCircle(x, y, r, "#ddd")
        Canvas.cx.font = this.font()
        Canvas.cx.fillStyle = this.fillStyle()
        Canvas.cx.fillText(String(this.number), x, y)
    }

    dots() {
        switch (this.number) {
        case 2: case 12: return 1
        case 3: case 11: return 2
        case 4: case 10: return 3
        case 5: case 9: return 4
        case 6: case 8: return 5
        }
    }

    font() {
        return `${(this.dots() - 1) * 0.25 + 0.5}em sans-serif`
    }

    fillStyle() {
        return this.dots() === 5 ? "#d22" : "#222"
    }
}

export default NumberCicle
