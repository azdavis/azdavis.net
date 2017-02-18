const options = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "./src/index.min.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    }
}

module.exports = options
