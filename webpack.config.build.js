const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const merge = require('webpack-merge')
const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'production',

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          safari10: true
        }
      })
    ]
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[chunkhash].js'
  },

  plugins: [
    new CleanWebpackPlugin(['build'])
  ]
})
