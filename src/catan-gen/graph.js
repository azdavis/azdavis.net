class Graph {
    constructor() {
        this.vertices = []
    }

    add(value) {
        this.vertices.push({value, edges: []})
    }

    find(value) {
        return this.vertices.find(x => x.value === value)
    }

    nearby(value) {
        return this.find(value).edges
    }
}

export default Graph
