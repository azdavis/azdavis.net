import Sprite from './sprite'

class Bullet extends Sprite {
    width = 20
    height = 20
    speed = 5
    fill = '#44b'

    constructor(s: Sprite) {
        super(s.x, s.y)
        this.x += (s.width - this.width) / 2
        this.y += (s.height - this.height) / 2
        this.i = s.i
        this.j = s.j
    }
}

export default Bullet
