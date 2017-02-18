class Graph {
    constructor() {
        this.nodes = []
    }

    add(value) {
        this.nodes.push({value, edges: []})
    }
}

export default Graph
