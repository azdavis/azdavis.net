abstract class Sprite {
    protected speed: number
    w: number
    h: number
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

    moveTowards(s: Sprite): void {
        this.i = s.x - this.x
        this.j = s.y - this.y
        this.move()
    }

    isTouching(s: Sprite): boolean {
        return (
            this.contains(s.x, s.y) ||
            this.contains(s.x + s.w, s.y) ||
            this.contains(s.x, s.y + s.h) ||
            this.contains(s.x + s.w, s.y + s.h)
        )
    }

    private contains(x: number, y: number): boolean {
        return (
            this.x <= x && x <= this.x + this.w &&
            this.y <= y && y <= this.y + this.h
        )
    }
}

export default Sprite
