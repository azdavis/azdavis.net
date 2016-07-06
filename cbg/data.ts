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

    // how many tiles are in each row on a board
    export const rows = [1, 2, 3, 2, 3, 2, 3, 2, 1]

    // the longest row (see `rows` above)
    export const longestRow = 3

    // what circular number labels there are to choose from
    export const labels = [].concat(
        rp(2, 1),
        rp(3, 2),
        rp(4, 2),
        rp(5, 2),
        rp(6, 2),
        rp(8, 2),
        rp(9, 2),
        rp(10, 2),
        rp(11, 2),
        rp(12, 1)
    )

    // what hexagonal resource tiles there are to choose from
    export const tiles = [].concat(
        rp("brick", 3),
        rp("wood", 4),
        rp("wheat", 4),
        rp("sheep", 4),
        rp("ore", 3),
        rp("desert", 1)
    )
}

export default Data
