var commonConfig = require("./webpack.common.js");

commonConfig.output = {
    path: "./examples",
    filename: "bundle.js"
};

/*
 * watch a different entry
 */
commonConfig.entry = "./examples/index.ts";

module.exports = commonConfig;
