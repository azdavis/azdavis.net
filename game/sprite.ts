abstract class Sprite {
    public w: number
    public h: number
    public fill: string
    public stroke = '#000'
    public i = 0
    public j = 0
    protected speed: number

    // set x and y as the coordinates for this
    public constructor(public x: number, public y: number) {}

    // move this a magnitude of this.speed in the direction indicated by the
    // vector with components this.i and this.j
    public move(): void {
        if (this.i === 0 && this.j === 0) {
            return
        }
        let h = Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2))
        this.x += this.speed * this.i / h
        this.y += this.speed * this.j / h
    }

    // move this in the direction towards s
    public moveTowards(s: Sprite): void {
        this.i = s.x - this.x
        this.j = s.y - this.y
        this.move()
    }

    // return whether any part of this overlaps any part of s
    public hasAnyInside(s: Sprite): boolean {
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
