class Graph {
    constructor() {
        this.nodes = []
    }

    add(value) {
        this.nodes.push({value, edges: []})
    }

    find(value) {
        return this.nodes.find(x => x.value === value)
    }
}

export default Graph
