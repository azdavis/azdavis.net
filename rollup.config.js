import babel from "rollup-plugin-babel"
import eslint from "rollup-plugin-eslint"

const options = {
	entry: `${process.env.path}/index.js`,
	dest: `${process.env.path}/index.c.js`,
	format: "iife",
	plugins: [
		eslint({exclude: "node_modules/**", throwError: true}),
		babel({exclude: "node_modules/**"})
	]
}

export default options
