import Sprite from './sprite'

class Player extends Sprite {
    constructor(public x: number, public y: number) {
        super(x, y)
        this.elem.className += ' player'
    }
}

export default Player
