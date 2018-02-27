var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var package = require('./package.json');
var path = require('path');

const PATHS = {
  app: path.join(__dirname, "app"),
  build: path.join(__dirname, "build"),
};

module.exports = {
  entry: {
    app: './app/scripts/main.js',
    vendor: [
      "script-loader!jquery",
      "script-loader!bootstrap-sass",
      "script-loader!bootstrap-table",
      "script-loader!bootstrap-multiselect"
    ]
  },
  output: {
    path: path.join(__dirname, "../dist/"),
    filename: '[name].bundle.js',
    publicPath: "/"
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'app.bundle.css'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: './app/index.html',
      chunks: ['vendor', 'app'],
      path: path.join(__dirname, "../dist/"),
      filename: 'index.html' //relative to root of the application
    }),
    new CopyWebpackPlugin([{
      from: 'app/images',
      to: 'images'
    }])
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname, "../dist/"),
    port: 9090
  },
  // devtool: 'source-map',
  devtool: 'inline-source-map',
  module: {
    rules: [
      { 
        test: /\.(s*)css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }]
        })
      },
      {
        // test: /\.(png|jp(e*)g|svg)$/,
        // test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        // use: [{
        //   loader: 'file-loader',
        //   options: {
        //     name: 'fonts/[name].[ext]',
        //     outputPath: 'fonts/',    // where the fonts will go
        //     publicPath: '../'       // override the default path
        //   }
        // }]
        // Match woff2 in addition to patterns like .woff?v=1.1.1.
        // test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        // use: [{
        //   loader: "file-loader",
        //   options: {
        //     // Limit at 50k. Above that it emits separate files
        //     limit: 50000,

        //     // url-loader sets mimetype if it's passed.
        //     // Without this it derives it from the file extension
        //     mimetype: "application/font-woff",

        //     // Output below fonts directory
        //     name: "./fonts/[name].[ext]"
        //   }
        // }]
      }]
  },
  // watch: true
};