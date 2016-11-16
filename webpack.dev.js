var commonConfig = require("./webpack.common.js");

commonConfig.output = {
    filename: "bundle.js"
};

/*
 * watch a different entry
 */
commonConfig.entry = "./examples/Examples.tsx";

commonConfig.devServer = {
    contentBase: './',
    publicPath: '/',
    historyApiFallback: true,
    inline: true,
    port: 8070
};

module.exports = commonConfig;
