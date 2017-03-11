const webpackMerge = require('webpack-merge');
const commonConfig = require("./base.js");

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        vendor: [
            'react',
            'react-dom'
        ],
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    loader: [
                        'awesome-typescript-loader'
                    ]
                },
            ]
        },
        entry: './src/index.ts',
        output = {
            path: "./dist",
            libraryTarget: "umd",
            library: "GigaGrid",
            filename: "giga-grid.js"
        }
    });
}