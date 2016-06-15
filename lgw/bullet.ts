import Sprite from "./sprite"

class Bullet extends Sprite {
    public w = 20
    public h = 20
    public speed = 10
    public fill = "#44b"

    // make this always move in the direction that s was going in when this was
    // made, and start it on the edge or corner of s facing the direction of
    // movement
    public constructor(s: Sprite) {
        super(s.x, s.y)
        let dx = (s.w - this.w) / 2
        let dy = (s.h - this.h) / 2
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
}

export default Bullet
