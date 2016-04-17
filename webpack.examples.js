var commonConfig = require("./webpack.common.js");

commonConfig.output = {
    filename: "bundle.js"
};

/*
 * watch a different entry
 */
commonConfig.entry = "./index.tsx";

module.exports = commonConfig;
