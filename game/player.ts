import Bullet from './bullet'
import Sprite from './sprite'

class Player extends Sprite {
    public w = 50
    public h = 50
    public speed = 4
    public fill = '#4b4'
    public bullets: Bullet[]
    public lives = 3
    public dirs = {
        lt: false,
        up: false,
        rt: false,
        dn: false,
    }

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

    public getIJ(): void {
        this.i = this.j = 0
        if (this.dirs.lt) {
            this.i -= 1
        }
        if (this.dirs.up) {
            this.j -= 1
        }
        if (this.dirs.rt) {
            this.i += 1
        }
        if (this.dirs.dn) {
            this.j += 1
        }
    }
}

export default Player
