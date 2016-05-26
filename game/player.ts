import Sprite from './sprite'

class Player extends Sprite {
    speed = 1
    hyp = Math.sqrt(2 * Math.pow(this.speed, 2))
    dir = {
        lt: false,
        up: false,
        rt: false,
        dn: false
    }

    constructor(x: number, y: number) {
        super(x, y)
        this.elem.className += ' player'
    }

    move(): void {
        let dx = 0
        let dy = 0
        if (this.dir.lt)
            dx -= this.speed
        if (this.dir.up)
            dy -= this.speed
        if (this.dir.rt)
            dx += this.speed
        if (this.dir.dn)
            dy += this.speed
        if (dx && !dy)
            dx *= this.hyp
        if (dy && !dx)
            dy *= this.hyp
        super.move(dx, dy)
    }
}

export default Player
