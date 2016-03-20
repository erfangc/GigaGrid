module.exports = {
    resolve: {
        extensions: ['', 'webpack.js', '.web.js','.js', '.ts', '.tsx', '.styl']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/, loader: "ts-loader"
            },
            {
                test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'
            }
        ]
    }
};
