const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  entry: {
    'apollo-client': path.resolve(__dirname, 'apollo-client.js'),
    'apollo-client-subscription': path.resolve(__dirname, 'apollo-client-subscription.js'),
    'apollo-client-subscription-file-upload': path.resolve(__dirname, 'apollo-client-subscription-file-upload.js')
  },
  output: {
    library: 'Apollo',
    libraryTarget: 'var',
    path: path.resolve(__dirname+'/build'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: "'production'" }
    }),
    new BabiliPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};
