const merge = require("webpack-merge");
const buildResources = require("./buildResources");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(buildResources.commonConfig, {
  mode: "production",
  plugins: [
    new MinifyPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/app_[hash].css'
    }),
    new OptimizeCSSAssetsPlugin({}),
    buildResources.createHtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
      }
    }),
  ],
  module: buildResources.createSCSSModule(MiniCssExtractPlugin.loader)
});