abstract class Sprite {
    width = 50
    height = 50
    speed: number
    fill: string
    stroke = '#111'

    constructor(public x: number, public y: number) {}

    move(dx: number, dy: number): void {
        if (dx == 0 && dy == 0)
            return
        this.x += dx
        this.y += dy
    }

    moveTowards(p: Sprite): void {
        let dx = p.x - this.x
        let dy = p.y - this.y
        let hyp = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        this.move(dx * this.speed / hyp, dy * this.speed / hyp)
    }
}

export default Sprite
