const path = require('path');
const glob = require("glob");
const merge = require("webpack-merge");
const parts = require("./webpack.parts");

const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, "app"),
  build: path.join(__dirname, "build"),
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
      vendor: [
        "script-loader!jquery",
        "script-loader!bootstrap-sass",
        "script-loader!bootstrap-table",
        "script-loader!bootstrap-multiselect"
      ]
    },
    output: {
      path: PATHS.build,
      filename: 'scripts/[name].js',
      publicPath: "/"
    },
    plugins: [
      new HtmlWebpackPlugin({
        // hash: true,
        template: './app/index.html',
        chunks: ['vendor', 'app'],
        path: path.join(__dirname, "build"),
        filename: 'index.html' //relative to root of the application
      })
    ],
    resolve: {
      extensions: ['.ts', '.js']
    }
  },
  parts.extractCSS({
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      parts.autoprefix(),
      {
        loader: 'resolve-url-loader',
        options: {
          sourceMap: true
        }
      },
      {
        loader: 'sass-loader',
        options: {
          precision: 8,
          sourceMap: true
        }
      }
    ]
  }),
  parts.loadImages({
    exclude: [/fonts/],
    options: {
      name: "./images/[name].[ext]"
    }
  }),
  parts.loadFonts({
    exclude: [/images/],
    options: {
      name: "./fonts/[name].[ext]"
    }
  })
]);

const productionConfig = merge([
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.html`, { nodir: true }),
    minimize: true
  }),
  parts.generateSourceMaps({
    type: 'source-map'
  })
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.generateSourceMaps({
    type: 'inline-source-map'
  })
]);

module.exports = env => {
  if (env === "production") {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};