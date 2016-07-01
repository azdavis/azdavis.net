import Canvas from "./canvas"
import CatanData from "./catan_data"
import HexTile from "./hex_tile"
import NumberLabel from "./number_label"
import rp from "./repeat_primitive"

namespace CatanBoard {
    let rows: HexTile[][]

    // draw the current board
    export function draw(): void {
        // for each row
        for (let i = 0; i < rows.length; i++) {
            // for each space in the row
            for (let j = 0; j < rows[i].length; j++) {
                rows[i][j].draw()
            }
        }
    }

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

    // returns a random integer in the interval [0, h) (note that this will
    // never return h)
    function zeroTo(h: number): number {
        return Math.floor(Math.random() * h)
    }

    // fill the rows array by randomly assigning space to a HexTile with a
    // random background and a random label
    function fillRows(): void {
        const numLabels = CatanData.labels.length
        const numTiles = CatanData.tiles.length

        const labels = rp(false, numLabels)
        const tiles = rp(false, numTiles)

        let l: number
        let t: number

        // for each row...
        for (let i = 0; i < rows.length; i++) {
            // for each space in the row...
            for (let j = 0; j < rows[i].length; j++) {
                // get a random label and tile type...
                do { l = zeroTo(numLabels) } while (labels[l])
                do { t = zeroTo(numTiles) } while (tiles[t])
                labels[l] = tiles[t] = false
                // set the space to a tile of the gotten type...
                rows[i][j] = new HexTile(
                    CatanData.fills.tiles[CatanData.tiles[t]],
                    // with a label of the gotten number
                    new NumberLabel(
                        CatanData.fills.labels[CatanData.labels[l]],
                        CatanData.labels[l]
                    )
                )
            }
        }
    }

    // generate a new board
    function generate(): void {
        genRows()
        fillRows()
    }
}

export default CatanBoard
