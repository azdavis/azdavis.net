import babel from "rollup-plugin-babel"
import eslint from "rollup-plugin-eslint"
import rootImport from "rollup-plugin-root-import"

const options = {
	entry: `${process.env.path}/index.js`,
	dest: `${process.env.path}/index.c.js`,
	format: "iife",
	plugins: [
		rootImport({root: `${__dirname}/src`, extensions: ".js"}),
		eslint({exclude: "node_modules/**", throwError: true}),
		babel({exclude: "node_modules/**"})
	]
}

export default options
