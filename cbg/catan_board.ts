import Canvas from "./canvas"
import CatanData from "./catan_data"
import HexTile from "./hex_tile"
import NumberLabel from "./number_label"
import rp from "./repeat_primitive"

namespace CatanBoard {
    let rows: HexTile[][]

    // draw the current board
    export function draw(): void {
        Canvas.clear()
        // for each row
        for (let i = 0; i < rows.length; i++) {
            // for each space in the row
            for (let j = 0; j < rows[i].length; j++) {
                // draw the tile at the x and y correctly based on where it is
                // in its row and where its row is in all the rows
                let dx = (rows[i].length - 1) / 2 - j
                let dy = i - (rows.length - 1) / 2
                rows[i][j].draw(
                    Canvas.center.x + dx * HexTile.c * 3.3,
                    Canvas.center.y + dy * HexTile.a * 1.1
                )
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

        // for each row
        for (let i = 0; i < rows.length; i++) {
            // for each space in the row
            for (let j = 0; j < rows[i].length; j++) {
                let l: number
                let t: number
                let label: NumberLabel

                // get a random tile type
                do { t = zeroTo(numTiles) } while (tiles[t])
                tiles[t] = true

                if (CatanData.tiles[t] === "desert") {
                    // if the tile is desert, it gets no label
                    label = null
                } else {
                    // else, it gets a random label type
                    do { l = zeroTo(numLabels) } while (labels[l])
                    labels[l] = true

                    label = new NumberLabel(
                        CatanData.fills.labels[CatanData.labels[l]],
                        CatanData.labels[l]
                    )
                }

                // set the space to a tile of the gotten type with the
                // determined label
                rows[i][j] = new HexTile(
                    CatanData.fills.tiles[CatanData.tiles[t]],
                    label
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
