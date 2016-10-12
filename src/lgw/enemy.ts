import Canvas from "./canvas"
import Sprite from "./sprite"

class Enemy extends Sprite {
    public static readonly points = 1

    public w = 40
    public h = 40

    protected readonly fill = "#a44"
    protected readonly speed = 3

    // put this somewhere directly outside the Canvas
    public constructor() {
        // first, put it directly outside the canvas
        super(0, 0)
        this.x -= this.w
        this.y -= this.h

        // then, decide from which side...
        const r1 = Math.random()
        // ...and where on the chosen side it will come
        const r2 = Math.random()

        const total = 2 * (Canvas.w + Canvas.h)
        const lt = Canvas.h / total
        const up = lt + Canvas.w / total
        const rt = lt + up
        if (r1 < lt) {
            this.y += r2 * Canvas.h
        } else if (r1 < up) {
            this.x += r2 * Canvas.w
        } else if (r1 < rt) {
            this.x = Canvas.w
            this.y = r2 * Canvas.h
        } else {
            this.x = r2 * Canvas.w
            this.y = Canvas.h
        }
    }

    // move this in the direction towards s
    public moveTowards(s: Sprite): void {
        this.i = s.x - this.x + (s.w - this.w) / 2
        this.j = s.y - this.y + (s.h - this.h) / 2
        this.move()
    }
}

export default Enemy
