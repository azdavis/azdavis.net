namespace CatanData {
    export const counters = {
        infrequent: [2, 12],
        regular: [3, 4, 5, 9, 10, 11],
        frequent: [6, 8],
        notInfrequent: [] as number[],
    }
    counters.notInfrequent = counters.regular.concat(counters.frequent)

    export const resources = {
        types: 6,
        brick: "#b52",
        wood: "#573",
        wheat: "#e93",
        sheep: "#8b3",
        ore: "#777",
        desert: "#ca7",
    }

    export const regular = {
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
                infrequent: 1,
                notInfrequent: 2,
            },
        },
    }

    export const expansion = {
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
                infrequent: 2,
                notInfrequent: 3,
            },
        },
    }
}

export default CatanData
