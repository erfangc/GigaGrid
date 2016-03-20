module.exports = {
    resolve: {
        extensions: ['', 'webpack.js', '.web.js','.js', '.ts', '.tsx', '.styl', '.json']
    },
    module: {
        loaders: [
            {
                test: /\.json$/, loader: 'json-loader'
            },
            {
                test: /\.tsx?$/, loader: "ts-loader"
            },
            {
                test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'
            }
        ]
    },
    devtool: "source-map"
};
