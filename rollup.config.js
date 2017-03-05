import babel from "rollup-plugin-babel"
import eslint from "rollup-plugin-eslint"

const options = {
    entry: "index.js",
    dest: "index.c.js",
    format: "iife",
    plugins: [eslint({throwError: true}), babel()]
}

export default options
