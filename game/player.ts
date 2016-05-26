import Sprite from './sprite'

class Player extends Sprite {
    speed = 1
    hyp = Math.sqrt(2 * Math.pow(this.speed, 2))
    dirs = {
        lt: false,
        up: false,
        rt: false,
        dn: false
    }

    constructor(x: number, y: number) {
        super(x, y)
        this.elem.className += ' player'
    }

    addDir(d: string): void {
        switch (d) {
        case 'lt': if (this.dirs.rt) return; break
        case 'up': if (this.dirs.dn) return; break
        case 'rt': if (this.dirs.lt) return; break
        case 'dn': if (this.dirs.up) return; break
        }
        this.dirs[d] = true
    }

    rmDir(d: string): void {
        this.dirs[d] = false
    }

    move(): void {
        let dx = 0
        let dy = 0
        if (this.dirs.lt)
            dx = -this.speed
        if (this.dirs.rt)
            dx = this.speed
        if (this.dirs.up)
            dy = -this.speed
        if (this.dirs.dn)
            dy = this.speed
        if (dx && !dy)
            dx *= this.hyp
        if (dy && !dx)
            dy *= this.hyp
        super.move(dx, dy)
    }
}

export default Player
