const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV;

const config = {
  entry: {
    index: './example/index',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/static',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
            presets: ['env','stage-0']
        },
      },
    ],
  },
};

module.exports = config;