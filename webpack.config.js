const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const CnameWebpackPlugin = require('cname-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirNode = 'node_modules'

module.exports = {
  entry: {
    vendor: [
      '@babel/polyfill'
    ],

    bundle: path.join(dirApp, 'index')
  },

  resolve: {
    modules: [
      dirApp,
      dirAssets,
      dirNode
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),

    new webpack.ProvidePlugin({

    }),

    new CnameWebpackPlugin({
      domain: 'lhbzr.com'
    }),

    new CopyWebpackPlugin([
      {
        from: './app/assets/shared',
        to: ''
      }
    ]),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.pug')
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, '404.pug')
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },

      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env'
              ]
            ]
          }
        }
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              module: true,
              sourceMap: IS_DEVELOPMENT
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_DEVELOPMENT
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: IS_DEVELOPMENT
            }
          }
        ]
      },

      {
        test: /\.(jpe?g|png|gif|svg|woff2?)$/,
        loader: 'file-loader',
        options: {
          name (file) {
            if (IS_DEVELOPMENT) {
              return '[path][name].[ext]'
            }

            return '[hash].[ext]'
          }
        }
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
}
