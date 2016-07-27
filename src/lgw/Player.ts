import Bullet from "./Bullet"
import Canvas from "./Canvas"
import Sprite from "./Sprite"

class PlayerClass extends Sprite {
    private static maxAmmo = 9
    private static maxLives = 3

    public w = 50
    public h = 50

    public bullets: Bullet[]
    public lives: number
    public ammo: number

    public invincible: boolean

    public dirs = {
        lt: false,
        up: false,
        rt: false,
        dn: false,
    }

    protected fill = "#4b4"
    protected speed = 6

    // put this just outside of the canvas, since x and y are set later by the
    // canvas dimensions
    public constructor() {
        super(0, 0)
        this.x -= this.w
        this.y -= this.h
    }

    // calculate i and j, then move
    public move(): void {
        this.calcIJ()
        super.move()
    }

    // if this is moving and has ammo, make a new Bullet which moves in the
    // direction of movement and decrement ammo, otherwise, nop
    public shoot(): void {
        if (this.ammo === 0 || this.i === 0 && this.j === 0) {
            return
        }
        this.bullets.push(new Bullet(this))
        this.ammo--
    }

    // reset all dirs to false
    public stopMoving(): void {
        for (let i in this.dirs) {
            if (this.dirs[i]) {
                this.dirs[i] = false
            }
        }
        this.calcIJ()
    }

    // reset some instance variables on this
    public reset(): void {
        this.bullets = []
        this.lives = PlayerClass.maxLives
        this.ammo = PlayerClass.maxAmmo
        this.invincible = false
        this.stopMoving()
    }

    // lose a life and have some invincibility
    public loseLife(): void {
        this.lives--
        this.fill = "#bb4"
        this.invincible = true
        setTimeout(() => {
            this.fill = "#4b4"
            this.invincible = false
        }, 1000)
    }

    // return whether this should reload
    public shouldReload(): boolean {
        return this.ammo < PlayerClass.maxAmmo
    }

    // calculate the i and j values for this, based on the values of dirs
    private calcIJ(): void {
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
        this.stayInBounds()
    }

    // change this.i and/or this.j to ensure no part of this is not contained
    // in the canvas (if this is on the canvas boundary and is moving to leave
    // the canvas, reset this.i and/or this.j to 0)
    private stayInBounds(): void {
        if (this.x <= 0 && this.i <= 0
         || this.x + this.w >= Canvas.w && this.i >= 0) {
            this.i = 0
        }
        if (this.y <= 0 && this.j <= 0
         || this.y + this.h >= Canvas.h && this.j >= 0) {
            this.j = 0
        }
    }
}

const Player = new PlayerClass()
export default Player
