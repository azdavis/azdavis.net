import Sprite from './sprite'
import Bullet from './bullet'

class Player extends Sprite {
    width = 50
    height = 50
    speed = 1
    fill = '#4b4'
    bullets: Bullet[] = []

    constructor() {
        super(0, 0)
    }

    shoot(): void {
        if (this.i == 0 && this.j == 0)
            return
        this.bullets.push(new Bullet(this))
    }
}

export default Player
