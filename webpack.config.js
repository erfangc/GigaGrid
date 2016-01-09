// todo use a different entry point that targets the browser and make global exports available
module.exports = {
    entry: "./src/components/GigaGrid.js",
    output: {
        path: "./dist",
        filename: "giga-grid.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"}
        ]
    }
};