import Sprite from './sprite'
import Bullet from './bullet'

class Player extends Sprite {
    public w = 50
    public h = 50
    public speed = 1
    public fill = '#4b4'
    public bullets: Bullet[]
    public lives = 3

    // put this somewhere where it doesn't matter, since x and y are set by the
    // canvas dimensions
    public constructor() {
        super(0, 0)
    }

    // if this is moving, make a new Bullet which moves in the direction of
    // movement, otherwise, noop
    public shoot(): void {
        if (this.i === 0 && this.j === 0) {
            return
        }
        this.bullets.push(new Bullet(this))
    }
}

export default Player
