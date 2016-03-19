module.exports = {
    entry: "./src/index.ts",
    output: {
        path: "./dist",
        libraryTarget: "umd",
        library: "GigaGrid",
        filename: "giga-grid.js"
    },
    resolve: {
        extensions: ['', 'webpack.js', '.web.js', 'js', '.ts', '.tsx']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/, loader: "ts-loader"
            },
            {
                test: /\.css$/, loader: "style-loader!css-loader"
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },
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
    }
};
