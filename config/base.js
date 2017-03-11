const webpack = require('webpack');
const path = require('path');

module.exports = function () {
    return {
        devtool: 'source-map',
        resolve: {
            modules: ["node_modules"],
            extensions: ['.js', '.ts', '.tsx', '.styl', '.json']
        },
        output: {
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.(styl|css)$/,
                    loader: [
                        'style-loader',
                        'css-loader',
                        'stylus-loader'
                    ]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ],
        devServer: {
            port: 3000,
            hot: true,
            stats: {
                warnings: false
            },
        },
        node: {
            // workaround for webpack-dev-server issue 
            // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
            fs: 'empty',
            net: 'empty'
        }
    }
};
