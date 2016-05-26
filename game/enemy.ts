import Sprite from './sprite'

class Enemy extends Sprite {
    speed = 0.5

    constructor(x: number, y: number) {
        super(x, y)
        this.elem.className += ' enemy'
    }
}

export default Enemy
