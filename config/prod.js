const webpackMerge = require('webpack-merge');
const commonConfig = require("./base.js");

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        externals: {
            "react": {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React'
            },
            "react-dom": {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM'
            }
        },
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
        output: {
            path: "./dist",
            libraryTarget: "umd",
            library: "GigaGrid",
            filename: "giga-grid.js"
        }
    });
}