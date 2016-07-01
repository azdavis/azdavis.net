import Canvas from "./canvas"
import CatanData from "./catan_data"
import HexTile from "./hex_tile"

namespace CatanBoard {
    let rows: HexTile[][]

    // draw the current board
    export function draw(): void {}

    // generate and draw a new board
    export function drawNew(): void {
        generate()
        draw()
    }

    // generate the rows array, which is an empty 2D array of HexTile of the
    // correct dimensions
    function genRows(): void {
        rows = Array(CatanData.rows.length)
        for (let i = 0; i < rows.length; i++) {
            rows[i] = Array(CatanData.rows[i])
        }
    }

    }

    // fill the rows array by randomly assigning each HexTile
    function fillRows(): void {
        for (let i = 0; i < rows.length; i++) {
        }
    }

    // generate a new board
    function generate(): void {
        genRows()
        fillRows()
    }
}

export default CatanBoard
