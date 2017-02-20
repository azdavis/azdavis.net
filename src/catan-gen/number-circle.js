import Canvas from "./canvas"

class NumberCicle {
    constructor(number) {
        this.number = number
    }

    draw(x, y, r) {
        Canvas.drawCircle(x, y, r, "#ddd")
        Canvas.cx.font = `${r / 15}em sans-serif`
        Canvas.cx.fillStyle = this.dots() === 5 ? "#d22" : "#222"
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
}

export default NumberCicle
