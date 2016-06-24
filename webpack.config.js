const path = require('path');
const webpack = require('webpack');
const { version } = require('./package.json');


module.exports = {
  devtool: 'source-map',

  entry: {
    main: './src/js/index.js',
  },

  output: {
    path: path.join(__dirname, 'build/hackathon-internal/'),
    publicPath: `static/${version}/hackathon-internal/`,
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],

  eslint: {
    configFile: path.join(__dirname, '.eslintrc'),
  },
};