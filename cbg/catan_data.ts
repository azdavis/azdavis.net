import rp from "./repeat_primitive"

namespace CatanData {
    // how stuff looks on the canvas
    export const fills = {
        // text fills (background is always whitish)
        labels: {
            2: "#222",
            3: "#222",
            4: "#222",
            5: "#222",
            6: "#d22",
            8: "#d22",
            9: "#222",
            10: "#222",
            11: "#222",
            12: "#222",
        },
        // background fills (to simulate actual Catan tiles)
        tiles: {
            brick: "#b52",
            wood: "#573",
            wheat: "#e93",
            sheep: "#8b3",
            ore: "#777",
            desert: "#ca7",
        },
    }

    // how many tiles are in each row on a Catan board
    export const rows = [1, 2, 3, 2, 3, 2, 3, 2, 1]

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

export default CatanData
