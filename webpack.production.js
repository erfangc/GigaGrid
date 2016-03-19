var commonConfig = require("./webpack.common.js");

commonConfig.externals = {
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
};

commonConfig.output = {
    path: "./dist",
    libraryTarget: "umd",
    library: "GigaGrid",
    filename: "giga-grid.js"
};

commonConfig.entry = "./src/index.js";

module.exports = commonConfig;
