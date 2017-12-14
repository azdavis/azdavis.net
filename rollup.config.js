import babel from "rollup-plugin-babel"
import eslint from "rollup-plugin-eslint"
import rootImport from "rollup-plugin-root-import"

const {input, outputFile} = process.env
const output = {
	file: outputFile,
	format: "iife"
}
const plugins = [
	rootImport({root: __dirname, extensions: ".js"}),
	eslint({exclude: "node_modules/**", throwError: true}),
	babel({exclude: "node_modules/**"})
]
const options = {input, output, plugins}

export default options
