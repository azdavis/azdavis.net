import Canvas from "./canvas"
import Data from "./data"
import HexTile from "./hex_tile"
import NumberLabel from "./number_label"
import rp from "./repeat_primitive"

namespace Board {
    let rows: HexTile[][]

    // draw the current board, by drawing each tile offset a certain amount
    // from the center of the canvas, where that certain amount is based on the
    // tile's position in its row, and the row's position in all the rows
    export function draw(): void {
        Canvas.clear()
        // for each row
        for (let i = 0; i < rows.length; i++) {
            const dy = Data.tileScale
                     * (i - (rows.length - 1) / 2)
                     * HexTile.a

            // for each tile in the row
            for (let j = 0; j < rows[i].length; j++) {
                const dx = Data.tileScale
                         * ((rows[i].length - 1) / 2 - j)
                         * HexTile.c
                         * 3

                rows[i][j].draw(
                    Canvas.center.x + dx,
                    Canvas.center.y + dy
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
        rows = Array(Data.rows.length)
        for (let i = 0; i < rows.length; i++) {
            rows[i] = Array(Data.rows[i])
        }
    }

    // given an array of booleans, find an index of a `false`. set the element
    // at that index to `true` and return the index. WARNING: passing an array
    // of all `true` will cause an infinite loop. also, it doesn't make any
    // sense to pass a 0 or 1 length array, so just don't.
    function randIdx(ary: boolean[]): number {
        let ret: number
        do { ret = Math.floor(Math.random() * ary.length) } while (ary[ret])
        ary[ret] = true
        return ret
    }

    // fill the rows array by randomly assigning space to a HexTile with a
    // random background and a random label
    function fillRows(): void {
        // start with everything false
        const labels = rp(false, Data.labels.length)
        const tiles = rp(false, Data.tiles.length)

        // for each row
        for (let i = 0; i < rows.length; i++) {
            // for each space in the row
            for (let j = 0; j < rows[i].length; j++) {
                let label: NumberLabel

                // get a random tile type
                let t = randIdx(tiles)
                if (Data.tiles[t] === "desert") {
                    // if the tile is desert, it gets no label
                    label = null
                } else {
                    // else, it gets a random label type
                    let l = randIdx(labels)
                    label = new NumberLabel(
                        Data.fills.labels[Data.labels[l]],
                        Data.labels[l]
                    )
                }

                // set the space to a tile of the gotten type with the
                // determined label
                rows[i][j] = new HexTile(
                    Data.fills.tiles[Data.tiles[t]],
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

export default Board
