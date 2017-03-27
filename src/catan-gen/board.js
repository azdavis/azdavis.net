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
    throw new Error()
}
const isResourceHex = x => x instanceof ResourceHex
const isBorderHex = x => x instanceof BorderHex

// the class

class Board {

    // setup

    constructor({
        resourceAmts,
        numberAmts,
        portAmts,
        numNonPort,
        edges,
        offsets,
        maxDotsPerIntersection,
        maxDotsPerResource
    }) {
        this.resourceAmts = resourceAmts
        this.numberAmts = numberAmts
        this.portAmts = portAmts
        this.offsets = offsets
        this.maxDotsPerIntersection = maxDotsPerIntersection
        this.maxDotsPerResource = maxDotsPerResource

        this.numResourceHex = sumObject(resourceAmts)
        this.numBorderHex = sumObject(portAmts) + numNonPort
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
            this.graph.nearby(this.array[i]).push(
                ...edges[i].map(j => this.array[j])
            )
        }
    }

    // draw

    draw() {
        const xOff = this.r / 7
        // 3 / sqrt(3) = 1.732050808
        const yOff = xOff * 1.732050808
        // minus a bit, to allow a gap between hexes
        const hexR = yOff / 1.5 - 2
        for (let i = 0; i < this.size; i++) {
            const off = this.offsets[i]
            this.array[i].draw(
                this.x + off[0] * xOff,
                this.y + off[1] * yOff,
                hexR
            )
        }
    }

    // setting resources

    trySetResource(x, remaining) {
        const nearbyRs =
            this.graph.nearby(x).filter(isResourceHex).map(toResource)
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

    trySetResources() {
        const remaining = Object.assign({}, this.resourceAmts)
        for (let i = 0; i < this.numResourceHex; i++) {
            if (!this.trySetResource(this.array[i], remaining)) {
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

    maxDots(x, resourceDots) {
        const ns = this.graph.nearby(x).filter(isResourceHex)
        let intersectionMax = 0
        for (let i = 0; i < ns.length; i++) {
            for (let j = i + 1; j < ns.length; j++) {
                if (this.graph.nearby(ns[i]).indexOf(ns[j]) === -1) {
                    continue
                }
                const get = toDots(ns[i]) + toDots(ns[j])
                if (get > intersectionMax) {
                    intersectionMax = get
                }
            }
        }
        return Math.min(
            this.maxDotsPerIntersection - intersectionMax,
            this.maxDotsPerResource - resourceDots[x.resource]
        )
    }

    trySetNumber(x, remaining, resourceDots) {
        if (x.resource === "desert") {
            return true
        }
        const okNs = {}
        let sum = 0
        const md = this.maxDots(x, resourceDots)
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
        resourceDots[x.resource] += NumberDots[n]
        return true
    }

    trySetNumbers() {
        const remaining = Object.assign({}, this.numberAmts)
        const resourceDots = {
            brick: 0,
            wood: 0,
            wheat: 0,
            sheep: 0,
            ore: 0
        }
        for (let i = 0; i < this.numResourceHex; i++) {
            if (!this.trySetNumber(this.array[i], remaining, resourceDots)) {
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

    trySetPort(x, remaining) {
        const ns = this.graph.nearby(x)
        if (ns.filter(isBorderHex).some(hasPort)) {
            return true
        }
        const nearbyRs = ns.filter(isResourceHex).map(toResource)
        const okPs = {}
        let sum = 0
        for (const p in remaining) {
            if (nearbyRs.indexOf(p) === -1) {
                sum += okPs[p] = remaining[p]
            }
        }
        if (sum === 0) {
            return false
        }
        const p = weightedRandom(okPs, sum)
        x.port = p
        remaining[p]--
        return true
    }

    trySetPorts() {
        const remaining = Object.assign({}, this.portAmts)
        for (let i = this.numResourceHex; i < this.size; i++) {
            if (!this.trySetPort(this.array[i], remaining)) {
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
        } while (!this.trySetResources())
        do {
            this.resetNumbers()
        } while (!this.trySetNumbers())
        do {
            this.resetPorts()
        } while (!this.trySetPorts())
    }
}

export default Board
