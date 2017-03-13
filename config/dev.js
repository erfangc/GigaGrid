const webpackMerge = require('webpack-merge');
const commonConfig = require("./base.js");

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        entry: './examples/Examples.tsx',
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    loader: [
                        'react-hot-loader',
                        'awesome-typescript-loader'
                    ]
                }
            ]
        }
    });
}