// return an array with n elements, all of them being s
function rp<T>(s: T, n: number): T[] {
    const ret = Array(n)
    for (let i = 0; i < n; i++) {
        ret[i] = s
    }
    return ret
}

export default rp
