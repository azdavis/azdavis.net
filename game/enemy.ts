import Sprite from './sprite'

class Enemy extends Sprite {
    speed = 0.5

    constructor(x: number, y: number) {
        super(x, y, 50, 50)
        this.elem.className += ' enemy'
    }
}

export default Enemy
