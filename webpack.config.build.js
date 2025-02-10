const path = require('path')

const { merge } = require('webpack-merge')
const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'production',

  output: {
    clean: true,
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, 'build')
  }
})
