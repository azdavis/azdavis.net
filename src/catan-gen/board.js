import BorderHex from "./border-hex"
import Graph from "./graph"
import NumberDots from "./number-dots"
import ResourceHex from "./resource-hex"

// helpers not associated with class data

const toResource = x => x.resource
const hasPort = x => x.port !== null
const toDots = x => x.number === null ? 0 : NumberDots[x.number]
function sumObject(x) {
    let ret = 0
    for (const p in x) {
        ret += x[p]
    }
    return ret
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

// the class

class Board {

    // setup

    constructor({
        resourceAmts,
        numberAmts,
        portAmts,
        numNonPort,
        edges,
        offsets
    }) {
        this.resourceAmts = resourceAmts
        this.numberAmts = numberAmts
        this.portAmts = portAmts
        this.numResourceHex = sumObject(resourceAmts)
        this.numBorderHex = sumObject(portAmts) + numNonPort
        this.offsets = offsets
        this.size = this.numResourceHex + this.numBorderHex
        this.array = []
        this.graph = new Graph()
        for (let i = 0; i < this.numResourceHex; i++) {
            const t = new ResourceHex(null, null)
            this.array.push(t)
            this.graph.add(t)
        }
        for (let i = this.numResourceHex; i < this.size; i++) {
            const t = new BorderHex(null)
            this.array.push(t)
            this.graph.add(t)
        }
        for (let i = 0; i < this.size; i++) {
            this.graph
                .find(this.array[i])
                .edges
                .push(...edges[i].map(j => this.array[j]))
        }
    }

    // draw

    draw(x, y, r) {
        const xOff = r / 7
        const yOff = xOff * 1.732050808 // 3 / sqrt(3)
        const hexR = yOff / 1.5 - 1
        for (let i = 0; i < this.size; i++) {
            const off = this.offsets[i]
            this.array[i].draw(x + off[0] * xOff, y + off[1] * yOff, hexR)
        }
    }

    // setting resources

    nearby(x) {
        const p = Object.getPrototypeOf(x)
        return this.graph
            .find(x)
            .edges
            .filter(y => Object.getPrototypeOf(y) === p)
    }

    setResource(x, remaining) {
        const nearbyRs = this.nearby(x).map(toResource)
        const okRs = {}
        let sum = 0
        for (const r in remaining) {
            if (nearbyRs.indexOf(r) === -1) {
                sum += okRs[r] = remaining[r]
            }
        }
        if (sum === 0) {
            return false
        }
        const r = weightedRandom(okRs, sum)
        x.resource = r
        remaining[r]--
        return true
    }

    setResources() {
        const remaining = Object.assign({}, this.resourceAmts)
        for (let i = 0; i < this.numResourceHex; i++) {
            if (!this.setResource(this.array[i], remaining)) {
                return false
            }
        }
        return true
    }

    resetResources() {
        for (let i = 0; i < this.numResourceHex; i++) {
            this.array[i].resource = null
        }
    }

    // setting numbers

    maxDots(x) {
        const ns = this.nearby(x)
        let intersectionMax = 0
        for (let i = 0; i < ns.length; i++) {
            for (let j = i + 1; j < ns.length; j++) {
                if (this.nearby(ns[i]).indexOf(ns[j]) === -1) {
                    continue
                }
                const get = toDots(ns[i]) + toDots(ns[j])
                if (get > intersectionMax) {
                    intersectionMax = get
                }
            }
        }
        return 11 - intersectionMax
    }

    setNumber(x, remaining) {
        if (x.resource === "desert") {
            return true
        }
        const okNs = {}
        let sum = 0
        const md = this.maxDots(x)
        for (const n in remaining) {
            if (NumberDots[n] <= md) {
                sum += okNs[n] = remaining[n]
            }
        }
        if (sum === 0) {
            return false
        }
        const n = weightedRandom(okNs, sum)
        x.number = Number(n)
        remaining[n]--
        return true
    }

    setNumbers() {
        const remaining = Object.assign({}, this.numberAmts)
        for (let i = 0; i < this.numResourceHex; i++) {
            if (!this.setNumber(this.array[i], remaining)) {
                return false
            }
        }
        return true
    }

    resetNumbers() {
        for (let i = 0; i < this.numResourceHex; i++) {
            this.array[i].number = null
        }
    }

    // setting ports

    setPort(x, remaining) {
        if (this.nearby(x).some(hasPort)) {
            return true
        }
        const p = weightedRandom(remaining, sumObject(remaining))
        x.port = p
        remaining[p]--
        return true
    }

    setPorts() {
        const remaining = Object.assign({}, this.portAmts)
        for (let i = this.numResourceHex; i < this.size; i++) {
            if (!this.setPort(this.array[i], remaining)) {
                return false
            }
        }
        return true
    }

    resetPorts() {
        for (let i = this.numResourceHex; i < this.size; i++) {
            this.array[i].port = null
        }
    }

    // generating

    generate() {
        // gross, but guarenteed to work
        do {
            this.resetResources()
        } while (!this.setResources())
        do {
            this.resetNumbers()
        } while (!this.setNumbers())
        do {
            this.resetPorts()
        } while (!this.setPorts())
    }
}

export default Board
