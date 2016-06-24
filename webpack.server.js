const path = require('path');
const webpack = require('webpack');


module.exports = {
  debug: true,
  devtool: 'cheap-module-inline-source-map',

  entry: {
    main: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/dev-server',
      './src/js/index.js',
    ],
  },

  output: {
    path: path.join(__dirname, 'build/hackathon-internal/'),
    publicPath: 'static/hackathon-internal/',
    filename: '[name].js',
    chunkFilename: '[name].js',
  },

  module: {
    preLoaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint' },
    ],
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, exclude: /node_modules/, loader: 'json' },
    ],
  },

  resolve: {
    root: path.join(__dirname, 'src/js'),
    extensions: ['', '.js', '.jsx', '.json'],
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  eslint: {
    configFile: path.join(__dirname, '.eslintrc'),
  },
};
