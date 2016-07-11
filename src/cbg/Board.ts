import Canvas from "./Canvas"
import Data from "./Data"
import HexTile from "./HexTile"
import NumberLabel from "./NumberLabel"
import rp from "./RepeatPrimitive"

module Board {
    let rows: HexTile[][]
    let type: string // TODO make this work better with the type system

    // generate, fill, and draw a new board
    export function drawNew(newType: string): void {
        type = newType
        generate()
        fill()
        draw()
    }

    // draw the current board, by drawing each tile offset a certain amount
    // from the center of the canvas, where that certain amount is based on the
    // tile's position in its row, and the row's position in all the rows
    export function draw(): void {
        // get the width and height, based on what type of board is to be drawn
        const w = Data.tileScale
                * HexTile.c
                * ((Data[type].maxTilesPerRow - 1) * 3 + 2)
        const h = Data.tileScale
                * HexTile.a
                * (Data[type].tilesPerRow.length + 1)

        // resize the canvas (clearing it in the process)
        Canvas.resize(w, h)

        // for each row
        for (let i = 0; i < rows.length; i++) {
            const dy = Data.tileScale
                     * HexTile.a
                     * (i - (rows.length - 1) / 2)

            // for each tile in the row
            for (let j = 0; j < rows[i].length; j++) {
                const dx = Data.tileScale
                         * HexTile.c
                         * ((rows[i].length - 1) / 2 - j)
                         * 3

                // draw each tile offset a bit from the center of the canvas
                rows[i][j].draw(
                    w / 2 + dx,
                    h / 2 + dy
                )
            }
        }
    }

    // generate an empty rows array, which is an empty 2D array of HexTile of
    // the correct dimensions
    function generate(): void {
        rows = Array(Data[type].tilesPerRow.length)
        for (let i = 0; i < rows.length; i++) {
            rows[i] = Array(Data[type].tilesPerRow[i])
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

    // fill an empty board by randomly assigning space to a HexTile with a
    // random background and a random label
    function fill(): void {
        // start with everything false
        const labels = rp(false, Data[type].possibleLabels.length)
        const tiles = rp(false, Data[type].possibleTiles.length)

        // for each row
        for (let i = 0; i < rows.length; i++) {
            // for each space in the row
            for (let j = 0; j < rows[i].length; j++) {
                let label: NumberLabel

                // get a random tile type
                let t = randIdx(tiles)
                if (Data[type].possibleTiles[t] === "desert") {
                    // if the tile is desert, it gets no label
                    label = null
                } else {
                    // else, it gets a random label type
                    let l = randIdx(labels)
                    label = new NumberLabel(
                        Data.fills.labels[Data[type].possibleLabels[l]],
                        Data[type].possibleLabels[l]
                    )
                }

                // set the space to a tile of the gotten type with the
                // determined label
                rows[i][j] = new HexTile(
                    Data.fills.tiles[Data[type].possibleTiles[t]],
                    label
                )
            }
        }
    }
}

export default Board
