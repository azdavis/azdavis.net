import Sprite from './sprite'

class Player extends Sprite {
    speed = 1

    constructor(x: number, y: number) {
        super(x, y, 50, 50)
        this.elem.className += ' player'
    }
}

export default Player
