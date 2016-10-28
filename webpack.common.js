module.exports = {
    resolve: {
        extensions: ['', '.js', '.ts', '.tsx', '.styl', '.json']
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
    }
};
