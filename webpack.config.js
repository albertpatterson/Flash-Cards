
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production';

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './assets/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './assets/app.bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: 'assets/media/favicon.ico'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/app.css'
      // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    compress: true,
    port: 12003,
    stats: 'errors-only',
    open: true
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test:/\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      {
        test: /\.(jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/media/',
              publicPath: './assets/media/'
            }
          }
        ]
      }
    ]
  }
};

module.exports = config;