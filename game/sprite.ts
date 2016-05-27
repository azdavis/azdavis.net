abstract class Sprite {
    protected speed: number
    width: number
    height: number
    fill: string
    stroke = '#111'
    i = 0
    j = 0

    constructor(public x: number, public y: number) {}

    move(): void {
        if (this.i == 0 && this.j == 0)
            return
        let h = Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2))
        this.x += this.speed * this.i / h
        this.y += this.speed * this.j / h
    }

    moveTowards(p: Sprite): void {
        this.i = p.x - this.x
        this.j = p.y - this.y
        this.move()
    }
}

export default Sprite
