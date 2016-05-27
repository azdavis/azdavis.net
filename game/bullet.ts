import Sprite from './sprite'

class Bullet extends Sprite {
    w = 20
    h = 20
    speed = 5
    fill = '#44b'

    constructor(s: Sprite) {
        super(s.x, s.y)
        this.x += (s.w - this.w) / 2
        this.y += (s.h - this.h) / 2
        this.i = s.i
        this.j = s.j
    }
}

export default Bullet
