import rp from "./repeat_primitive"

namespace Data {
    // how big tiles are (this being 1 would mean tiles are right next to one
    // another; larger than 1 and the tiles have a gap between them)
    export const tileScale = 1.1

    const black = "#222"
    const red = "#d22"
    // how stuff looks on the canvas
    export const fills = {
        // text fills (background is always whitish)
        labels: {
            2: black,
            3: black,
            4: black,
            5: black,
            6: red,
            8: red,
            9: black,
            10: black,
            11: black,
            12: black,
        },
        // background fills (to simulate actual tiles)
        tiles: {
            brick: "#b52",
            wood: "#573",
            wheat: "#eb3",
            sheep: "#8b3",
            ore: "#777",
            desert: "#ca7",
        },
    }

    // a board for 3-4 players
    export const reg = {
        tilesPerRow: [1, 2, 3, 2, 3, 2, 3, 2, 1],
        longestRow: 3,
        possibleLabels: [].concat(
            [2],
            rp(3, 2),
            rp(4, 2),
            rp(5, 2),
            rp(6, 2),
            rp(8, 2),
            rp(9, 2),
            rp(10, 2),
            rp(11, 2),
            [12]
        ),
        possibleTiles: [].concat(
            rp("brick", 3),
            rp("wood", 4),
            rp("wheat", 4),
            rp("sheep", 4),
            rp("ore", 3),
            ["desert"]
        ),
    }

    // a board for 5-6 players
    export const exp = {
        tilesPerRow: [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1],
        longestRow: 4,
        possibleLabels: reg.possibleLabels.concat([
            2,
            3,
            4,
            5,
            6,
            8,
            9,
            10,
            11,
            12,
        ]),
        possibleTiles: reg.possibleTiles.concat(
            rp("brick", 2),
            rp("wood", 2),
            rp("wheat", 2),
            rp("sheep", 2),
            rp("ore", 2),
            ["desert"]
        ),
    }
}

export default Data
