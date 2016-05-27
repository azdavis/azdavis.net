import Sprite from './sprite'
import Bullet from './bullet'

class Player extends Sprite {
    w = 50
    h = 50
    speed = 1
    fill = '#4b4'
    bullets: Bullet[] = []

    // put this somewhere where it doesn't matter, since x and y are set by the
    // canvas dimensions
    constructor() {
        super(0, 0)
    }

    // if this is moving, make a new Bullet which moves in the direction of
    // movement, otherwise, noop
    shoot(): void {
        if (this.i == 0 && this.j == 0)
            return
        this.bullets.push(new Bullet(this))
    }
}

export default Player
