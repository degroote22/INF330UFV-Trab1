const path = require("path");
const webpack = require("webpack"); //to access built-in plugins

module.exports = {
  entry: "./web/src/index.ts",
  // devtool: "cheap-module-eval-source-map",
  output: {
    // path: './build/',
    path: path.resolve(__dirname, "../web/build"),
    filename: "index.js"
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts", ".tsx"]
  },
  module: {
    loaders: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};
