namespace CatanData {
    export const defs = {
        counters: {
            low: [2, 12],              // low frequency
            mid: [3, 4, 5, 9, 10, 11], // medium-level frequency
            high: [6, 8],              // high frequency
            notLow: [] as number[],    // mid + high
        },
        resources: {
            brick: "#b52",
            wood: "#573",
            wheat: "#e93",
            sheep: "#8b3",
            ore: "#777",
            desert: "#ca7",
        },
    }
    defs.counters.notLow = defs.counters.mid.concat(defs.counters.high)

    export const reg = {
        /*

            .      1
          .   .    2
        .   .   .  3
          .   .    2
        .   .   .  3
          .   .    2
        .   .   .  3
          .   .    2
            .      1

         */
        rows: [1, 2, 3, 2, 3, 2, 3, 2, 1],
        amts: {
            resources: {
                brick: 3,
                wood: 4,
                wheat: 4,
                sheep: 4,
                ore: 3,
                desert: 1,
            },
            counters: {
                low: 1,
                notLow: 2,
            },
        },
    }

    export const exp = {
        /*

              .        1
            .   .      2
          .   .   .    3
        .   .   .   .  4
          .   .   .    3
        .   .   .   .  4
          .   .   .    3
        .   .   .   .  4
          .   .   .    3
            .   .      2
              .        1


         */
        rows: [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1],
        amts: {
            resources: {
                brick: 5,
                wood: 6,
                wheat: 6,
                sheep: 6,
                ore: 5,
                desert: 2,
            },
            counters: {
                low: 2,
                notLow: 3,
            },
        },
    }
}

export default CatanData
