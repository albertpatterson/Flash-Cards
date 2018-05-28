const path = require('path');
const merge = require("webpack-merge");
const buildResources = require("./buildResources");

module.exports = merge(buildResources.commonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    compress: true,
    port: 12003,
    stats: 'errors-only',
    open: true
  },
  plugins: [
    buildResources.createHtmlWebpackPlugin(),
  ],
  module: buildResources.createSCSSModule("style-loader")
});