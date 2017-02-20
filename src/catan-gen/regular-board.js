import BorderHex from "./border-hex"
import Graph from "./graph"
import ResourceHex from "./resource-hex"

const resourceHexAmt = 19
const borderHexAmt = 18
const size = resourceHexAmt + borderHexAmt
const array = []
const graph = new Graph()

for (let i = 0; i < resourceHexAmt; i++) {
    const t = new ResourceHex(null, null)
    array.push(t)
    graph.add(t)
}
for (let i = resourceHexAmt; i < size; i++) {
    const t = new BorderHex(null)
    array.push(t)
    graph.add(t)
}

//
//                21      22      23      24
//
//
//            20      08      09      10      25
//
//
//        19      07      01      02      11      26
//
//
//    36      18      06      00      03      12      27
//
//
//        35      17      05      04      13      28
//
//
//            34      16      15      14      29
//
//
//                33      32      31      30
//
const edges = [
    /* 00 */ [1, 2, 3, 4, 5, 6],
    /* 01 */ [8, 9, 2, 0, 6, 7],
    /* 02 */ [9, 10, 11, 3, 0, 1],
    /* 03 */ [2, 11, 12, 13, 4, 0],
    /* 04 */ [0, 3, 13, 14, 15, 5],
    /* 05 */ [6, 0, 4, 15, 16, 17],
    /* 06 */ [7, 1, 0, 5, 17, 18],
    /* 07 */ [20, 8, 1, 6, 18, 19],
    /* 08 */ [21, 22, 9, 1, 7, 20],
    /* 09 */ [22, 23, 10, 2, 1, 8],
    /* 10 */ [23, 24, 25, 11, 2, 9],
    /* 11 */ [10, 25, 26, 12, 3, 2],
    /* 12 */ [11, 26, 27, 28, 13, 3],
    /* 13 */ [3, 12, 28, 29, 14, 4],
    /* 14 */ [4, 13, 29, 30, 31, 15],
    /* 15 */ [5, 4, 14, 31, 32, 16],
    /* 16 */ [17, 5, 15, 32, 33, 34],
    /* 17 */ [18, 6, 5, 16, 34, 35],
    /* 18 */ [19, 7, 6, 17, 35, 36],
    /* 19 */ [20, 7, 18, 36],
    /* 20 */ [21, 8, 7, 19],
    /* 21 */ [22, 8, 20],
    /* 22 */ [23, 9, 8, 21],
    /* 23 */ [24, 10, 9, 22],
    /* 24 */ [25, 10, 23],
    /* 25 */ [24, 26, 11, 10],
    /* 26 */ [25, 27, 12, 11],
    /* 27 */ [26, 28, 12],
    /* 28 */ [12, 27, 29, 13],
    /* 29 */ [13, 28, 30, 14],
    /* 30 */ [14, 29, 31],
    /* 31 */ [15, 14, 30, 32],
    /* 32 */ [16, 15, 31, 33],
    /* 33 */ [34, 16, 32],
    /* 34 */ [35, 17, 16, 33],
    /* 35 */ [36, 18, 17, 34],
    /* 36 */ [19, 18, 35]
]

for (let i = 0; i < size; i++) {
    graph.nodes[i].edges.push(...edges[i].map(j => array[j]))
}

const offsets = [
    /* 00 */ [0, 0],
    /* 01 */ [-1, -1],
    /* 02 */ [1, -1],
    /* 03 */ [2, 0],
    /* 04 */ [1, 1],
    /* 05 */ [-1, 1],
    /* 06 */ [-2, 0],
    /* 07 */ [-3, -1],
    /* 08 */ [-2, -2],
    /* 09 */ [0, -2],
    /* 10 */ [2, -2],
    /* 11 */ [3, -1],
    /* 12 */ [4, 0],
    /* 13 */ [3, 1],
    /* 14 */ [2, 2],
    /* 15 */ [0, 2],
    /* 16 */ [-2, 2],
    /* 17 */ [-3, 1],
    /* 18 */ [-4, 0],
    /* 19 */ [-5, 1],
    /* 20 */ [-4, 2],
    /* 21 */ [-3, 3],
    /* 22 */ [-1, 3],
    /* 23 */ [1, 3],
    /* 24 */ [3, 3],
    /* 25 */ [4, 2],
    /* 26 */ [5, 1],
    /* 27 */ [6, 0],
    /* 28 */ [5, -1],
    /* 29 */ [4, -2],
    /* 30 */ [3, -3],
    /* 31 */ [1, -3],
    /* 32 */ [-1, -3],
    /* 33 */ [-3, -3],
    /* 34 */ [-4, -2],
    /* 35 */ [-5, -1],
    /* 36 */ [-6, 0]
]

function draw(x, y, r) {
    const xOff = r / 7
    const yOff = xOff * 1.732050808 // 3 / sqrt(3)
    const hexR = yOff / 1.5 - 1
    for (let i = 0; i < size; i++) {
        const off = offsets[i]
        array[i].draw(x + off[0] * xOff, y + off[1] * yOff, hexR)
    }
}

function reset() {
    for (let i = 0; i < resourceHexAmt; i++) {
        array[i].resource = null
    }
    for (let i = resourceHexAmt; i < size; i++) {
        array[i].portCircle = null
    }
}

function weightedRandom(x, sum) {
    const cutoffs = {}
    let prevWeight = 0
    for (const p in x) {
        cutoffs[p] = x[p] / sum + prevWeight
        prevWeight = cutoffs[p]
    }
    const rand = Math.random()
    for (const p in cutoffs) {
        if (rand <= cutoffs[p]) {
            return p
        }
    }
    throw new Error("no")
}

const resourceAmts = {
    desert: 1,
    brick: 3,
    wood: 4,
    wheat: 4,
    sheep: 4,
    ore: 3
}
const resourceTypes = Object.keys(resourceAmts)

const isR = x => x instanceof ResourceHex
const toR = x => x.resource
function generateResourceTile(i, amts) {
    const nearbyHs = graph.nodes[i].edges.filter(isR).map(toR)
    const okTs = resourceTypes.filter(x => !nearbyHs.includes(x))
    const okAmts = {}
    let sum = 0
    for (const t of okTs) {
        sum += okAmts[t] = amts[t]
    }
    if (sum === 0) {
        return false
    }
    const r = weightedRandom(okAmts, sum)
    array[i].resource = r
    amts[r]--
    return true
}

function generateResourceTiles() {
    const amts = Object.assign({}, resourceAmts)
    for (let i = 0; i < resourceHexAmt; i++) {
        if (!generateResourceTile(i, amts)) {
            return false
        }
    }
    return true
}

function generate() {
    reset()
    // gross, but guarenteed to work
    while (!generateResourceTiles()) {}
}

export default {draw, generate}
