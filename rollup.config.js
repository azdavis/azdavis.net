import babel from "rollup-plugin-babel"
import eslint from "rollup-plugin-eslint"
import rootImport from "rollup-plugin-root-import"

const {entry, dest} = process.env
const format = "iife"
const plugins = [
	rootImport({root: __dirname, extensions: ".js"}),
	eslint({exclude: "node_modules/**", throwError: true}),
	babel({exclude: "node_modules/**"})
]
const options = {entry, dest, format, plugins}

export default options
