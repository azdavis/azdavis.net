import Canvas from "./canvas"
import CatanData from "./catan_data"
import HexTile from "./hex_tile"

namespace CatanBoard {
    // draw the current board
    export function draw(): void {}

    // generate and draw a new board
    export function drawNew(): void {
        generate()
        draw()
    }

    // generate a new board
    function generate(): void {}
}

export default CatanBoard
