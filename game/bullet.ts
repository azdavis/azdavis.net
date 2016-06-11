import Sprite from './sprite'

class Bullet extends Sprite {
    public w = 20
    public h = 20
    public speed = 10
    public fill = '#44b'

    // make this always move in the direction that s was going in when this was
    // made, and start it in the center of s
    public constructor(s: Sprite) {
        super(s.x, s.y)
        this.x += (s.w - this.w) / 2
        this.y += (s.h - this.h) / 2
        this.i = s.i
        this.j = s.j
    }
}

export default Bullet
