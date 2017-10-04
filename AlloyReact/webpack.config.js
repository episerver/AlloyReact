const path = require("path");

var APP_DIR = path.resolve(__dirname, "Static/react");
var BUILD_DIR = path.resolve(__dirname, "Static/js");

module.exports = {
    entry: {
        react: APP_DIR + "/index.js"
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].bundle.js",
        publicPath: BUILD_DIR,
        chunkFilename: "[id].bundle.js"
    },
    watch: true,
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        loaders: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    }
};