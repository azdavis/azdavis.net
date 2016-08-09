import Canvas from "./Canvas"
import Sprite from "./Sprite"

class Enemy extends Sprite {
    public static points = 1

    public w = 40
    public h = 40

    protected fill = "#A44"
    protected speed = 3

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
        const a = Canvas.h / total
        const b = a + Canvas.w / total
        const c = a + b
        if (r1 < a) {
            // left
            this.y += r2 * Canvas.h
        } else if (r1 < b) {
            // top
            this.x += r2 * Canvas.w
        } else if (r1 < c) {
            // right
            this.x = Canvas.w
            this.y = r2 * Canvas.h
        } else {
            // bottom
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
