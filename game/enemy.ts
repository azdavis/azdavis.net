import Sprite from './sprite'
import Canvas from './canvas'

class Enemy extends Sprite {
    public w = 40
    public h = 40
    public speed = 2
    public fill = '#b44'
    public points = 1

    // put this somewhere directly outside the Canvas
    public constructor() {
        // first, put it directly outside the canvas
        super(0, 0)
        this.x -= this.w
        this.y -= this.h
        // then, decide from which side it will come
        const total = 2 * (Canvas.w + Canvas.h)
        const r1 = Math.random() // which side
        const r2 = Math.random() // where on the chosen side
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
}

export default Enemy
