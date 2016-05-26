import Sprite from './sprite'

class Enemy extends Sprite {
    speed = 0.5

    constructor(x: number, y: number) {
        super(x, y, 50, 50)
        this.elem.className += ' enemy'
    }

    moveTowards(p: Sprite): void {
        let dx = p.x - this.x
        let dy = p.y - this.y
        let hyp = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        this.move(
            dx * this.speed / hyp,
            dy * this.speed / hyp
        )
    }
}

export default Enemy
