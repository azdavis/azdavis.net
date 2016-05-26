import Sprite from './sprite'

class Enemy extends Sprite {
    speed = 0.1
    constructor(public x: number, public y: number) {
        super(x, y)
        this.elem.className += ' enemy'
    }

    moveTowards(p: Sprite): void {
        let dx = this.x - p.x
        let dy = this.y - p.y
        let hyp = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        this.move(
            dx * this.speed / hyp,
            dy * this.speed / hyp
        )
    }
}

export default Enemy
