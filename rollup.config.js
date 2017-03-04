import babel from "rollup-plugin-babel"

const options = {
    entry: "index.js",
    dest: "index.min.js",
    format: "iife",
    plugins: [babel()]
}

export default options
