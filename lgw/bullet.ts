import Canvas from "./canvas"
import Sprite from "./sprite"

class Bullet extends Sprite {
    public w = 20
    public h = 20
    protected fill = "#44b"
    protected speed = 10

    // make this always move in the direction that s was going in when this was
    // made, and start it on the edge or corner of s facing the direction of
    // movement
    public constructor(s: Sprite) {
        super(s.x, s.y)
        const dx = (s.w - this.w) / 2
        const dy = (s.h - this.h) / 2
        if (s.i >= 0) {
            this.x += dx
        }
        if (s.i > 0) {
            this.x += dx
        }
        if (s.j >= 0) {
            this.y += dy
        }
        if (s.j > 0) {
            this.y += dy
        }
        this.i = s.i
        this.j = s.j
    }


    // return whether any part of this is inside the canvas
    public isInBounds(): boolean {
        return (
            this.x >= 0 &&
            this.x + this.w <= Canvas.w &&
            this.y >= 0 &&
            this.y + this.h <= Canvas.h
        )
    }
}

export default Bullet
