import Tile from "./tile"

class BorderTile extends Tile {
    constructor() {
        super()
        this.port = null
    }

    draw(x, y, r) {
        super.draw(x, y, r)
        if (this.port === null) {
            return
        }
    }
}

export default BorderTile
