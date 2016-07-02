import Canvas from "./canvas"
import Data from "./data"
import HexTile from "./hex_tile"
import NumberLabel from "./number_label"
import rp from "./repeat_primitive"

namespace Board {
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
        rows = Array(Data.rows.length)
        for (let i = 0; i < rows.length; i++) {
            rows[i] = Array(Data.rows[i])
        }
    }

    // given an array of booleans, find an index of a `false`. set that index
    // to `true` and return the index. WARNING: passing an array of all `true`
    // will cause an infinite loop. also, it doesn't make any sense to pass a 0
    // or 1 element array, so just don't.
    function randIdx(ary: boolean[]): number {
        let ret: number
        do { ret = Math.floor(Math.random() * ary.length) } while (ary[ret])
        ary[ret] = true
        return ret
    }

    // fill the rows array by randomly assigning space to a HexTile with a
    // random background and a random label
    function fillRows(): void {
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
