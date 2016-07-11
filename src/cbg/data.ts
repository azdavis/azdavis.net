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
            desert: "#ca7",
            brick: "#b52",
            wood: "#573",
            wheat: "#eb3",
            sheep: "#8b3",
            ore: "#777",
        },
    }

    // a board for 3-4 players
    export const reg = {
        tilesPerRow: [1, 2, 3, 2, 3, 2, 3, 2, 1],
        maxTilesPerRow: 3,
        possibleLabels: [
            2,
            3, 3,
            4, 4,
            5, 5,
            6, 6,
            8, 8,
            9, 9,
            10, 10,
            11, 11,
            12,
        ],
        possibleTiles: ["desert"].concat(
            rp("brick", 3),
            rp("wood", 4),
            rp("wheat", 4),
            rp("sheep", 4),
            rp("ore", 3)
        ),
    }

    // a board for 5-6 players
    export const exp = {
        tilesPerRow: [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1],
        maxTilesPerRow: 4,
        possibleLabels: reg.possibleLabels.concat([
            2, 3, 4, 5, 6, 8, 9, 10, 11, 12,
        ]),
        possibleTiles: reg.possibleTiles.concat(
            ["desert"],
            rp("brick", 2),
            rp("wood", 2),
            rp("wheat", 2),
            rp("sheep", 2),
            rp("ore", 2)
        ),
    }
}

export default Data
