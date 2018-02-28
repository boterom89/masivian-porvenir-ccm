const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require("purifycss-webpack");

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    }
  }
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type
});

exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    // `allChunks` is needed with CommonsChunkPlugin to extract
    // from extracted chunks as well.
    allChunks: true,
    filename: "styles/[name].css"
  });

  return {
    module: {
      rules: [{
        test: /\.(s*)css$/,
        include,
        exclude,
        use: plugin.extract({
          fallback: 'style-loader',
          use
        })
      }]
    },
    plugins: [plugin]
  };
};

exports.autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    plugins: () => [require("autoprefixer")()],
    sourceMap: true
  }
});

exports.purifyCSS = ({ paths, minimize }) => ({
  plugins: [
    new PurifyCSSPlugin({
      paths,
      minimize
    })
  ]
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [{
      test: /\.(png|jp(e*)g|svg)$/,
      include,
      exclude,
      use: {
        loader: "file-loader",
        options
      }
    }]
  }
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [{
      // Capture eot, ttf, woff, and woff2
      // Match woff2 in addition to patterns like .woff?v=1.1.1.
      test: /\.(svg|eot|otf|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      include,
      exclude,
      use: {
        loader: "file-loader",
        options
      }
    }]
  }
});