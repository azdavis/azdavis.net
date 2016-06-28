namespace Catan {
    export const enum TileType {
        Brick,
        Wood,
        Wheat,
        Sheep,
        Ore,
        Desert,
    }

    export const regular = {
        rows: [1, 2, 3, 2, 3, 2, 3, 2, 1],
        resourceCounts: {
            Brick: 3,
            Wood: 4,
            Wheat: 4,
            Sheep: 4,
            Ore: 3,
            Desert: 1,
        },
        numbers: {
            1: [2, 12],
            2: [3, 4, 5, 6, 8, 9, 10, 11],
        },
    }

    export const expansion = {
        rows: [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1],
        resourceCounts: {
            Brick: 5,
            Wood: 6,
            Wheat: 6,
            Sheep: 6,
            Ore: 5,
            Desert: 2,
        },
        numbers: {
            2: [2, 12],
            3: [3, 4, 5, 6, 8, 9, 10, 11],
        },
    }
}

export default Catan
