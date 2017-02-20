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

export default weightedRandom
