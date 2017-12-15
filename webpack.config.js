const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
  entry: './apollo-client.js',
  output: {
    library: 'Apollo',
    libraryTarget: 'var',
    path: path.resolve(__dirname+'/build'),
    filename: 'apollo-client.js'
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
            presets: ["env"]
          }
        }
      }
    ]
  }
};
