import Canvas from "./canvas"
import CatanData from "./catan_data"
import HexTile from "./hex_tile"

namespace CatanBoard {
    const type = "reg" // "reg" | "exp"
    let rows: HexTile[][]
    let resources: string[]
    let counters: number[]

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
        rows = Array(CatanData[type].rows.length)
        for (let i = 0; i < rows.length; i++) {
            rows[i] = Array(CatanData[type].rows[i])
        }
    }

    // generate the resources array, which is an array of string containing the
    // correct number of each of the possible types of resource for this board
    function genResources(): void {
        resources = []
        // r: resource type (brick, wood...)
        for (let r in CatanData[type].amts.resources) {
            // how many of resource r will be on the board
            for (let i = 0; i < CatanData[type].amts.resources[r]; i++) {
                resources.push(r)
            }
        }
    }

    // generate the counters array, which is an array of number containing the
    // correct number of each of the possible number counters for this board
    function genCounters(): void {
        counters = []
        // cCat: counter frequency category (low, notLow...)
        for (let cCat in CatanData[type].amts.counters) {
            // cNum: counter number itself (2, 8)
            for (let cNum of CatanData.defs.counters[cCat]) {
                // how many of counter cNum will be on the board
                for (let i = 0; i < CatanData[type].amts.counters[cCat]; i++) {
                    counters.push(cNum)
                }
            }
        }
    }

    // fill the rows array by randomly assigning each HexTile
    function fillRows(): void {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows.length; j++) {}
        }
    }

    // generate a new board
    function generate(): void {
        genRows()
        genResources()
        genCounters()
        fillRows()
    }
}

export default CatanBoard
