import Bullet from './bullet'
import Sprite from './sprite'

class Player extends Sprite {
    public w = 50
    public h = 50
    public speed = 4
    public fill = '#4b4'
    public bullets: Bullet[]
    public maxLives = 3
    public maxAmmo = 5
    public lives = this.maxLives
    public ammo = this.maxAmmo
    public dirs = {
        lt: false,
        up: false,
        rt: false,
        dn: false,
    }

    // put this just outside of the canvas, since x and y are set later by the
    // canvas dimensions
    public constructor() {
        super(0, 0)
        this.x -= this.w
        this.y -= this.h
    }

    // if this is moving and has ammo, make a new Bullet which moves in the
    // direction of movement and decrement ammo, otherwise, noop
    public shoot(): void {
        if (this.ammo === 0 || this.i === 0 && this.j === 0) {
            return
        }
        this.bullets.push(new Bullet(this))
        this.ammo--
    }

    // get the i and j values for this, based on the values of dirs
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
