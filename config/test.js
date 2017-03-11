const webpackMerge = require('webpack-merge');
const commonConfig = require("./base.js");

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    loader: [
                        'awesome-typescript-loader'
                    ]
                }
            ]
        }
    });
}