import babel from "rollup-plugin-babel"
import eslint from "rollup-plugin-eslint"

const options = {
    entry: `${process.env.path}/index.js`,
    dest: `${process.env.path}/index.c.js`,
    format: "iife",
    plugins: [eslint({throwError: true}), babel()]
}

export default options
