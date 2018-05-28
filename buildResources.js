const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports.commonConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './assets/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './assets/app_[hash].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
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
        test: /\.(jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: './assets/media/',
              publicPath: '/assets/media'
            }
          }
        ]
      }
    ]
  }
};

module.exports.createHtmlWebpackPlugin = function(opts){
  const config = {
    template: 'index.html',
    favicon: 'assets/media/favicon.ico'
  };
  if(opts) Object.assign(config, opts);
  return new HtmlWebpackPlugin(config);
};


module.exports.createSCSSModule = function(cssLoader){
  return {
    rules: [
      {
        test: /\.scss$/,
        use: [
          cssLoader,
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  };
};

