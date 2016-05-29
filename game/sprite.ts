abstract class Sprite {
    protected speed: number
    w: number
    h: number
    fill: string
    stroke = '#000'
    i = 0
    j = 0

    // set x and y as the coordinates for this
    constructor(public x: number, public y: number) {}

    // move this a magnitude of this.speed in the direction indicated by the
    // vector with components this.i and this.j
    move(): void {
        if (this.i == 0 && this.j == 0)
            return
        let h = Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2))
        this.x += this.speed * this.i / h
        this.y += this.speed * this.j / h
    }

    // move this in the direction towards s
    moveTowards(s: Sprite): void {
        this.i = s.x - this.x
        this.j = s.y - this.y
        this.move()
    }

    // return whether any part of this overlaps any part of s
    isTouching(s: Sprite): boolean {
        return (
            this.encloses(s.x, s.y) ||
            this.encloses(s.x + s.w, s.y) ||
            this.encloses(s.x, s.y + s.h) ||
            this.encloses(s.x + s.w, s.y + s.h)
        )
    }

    // return whether a point (x, y) is enclosed in this
    private encloses(x: number, y: number): boolean {
        return (
            this.x <= x && x <= this.x + this.w &&
            this.y <= y && y <= this.y + this.h
        )
    }
}

export default Sprite
