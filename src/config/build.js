// Customize the webpack configuration
import { genAsyncComponents } from '../common/async-components/async-generator'
import { generateEventBusSchema } from '../helpers/eventBusSchemaGenerator'
import HashOutput from 'webpack-plugin-hash-output'

const path = require('path')
/* eslint-disable no-template-curly-in-string */

export default {
  transpile: [ /^vuetify/, 'swiper', 'dom7' ],
  babel: {
    configFile: path.resolve(__dirname, '..', '..', 'babel.config.js'),
    plugins: [
      ['transform-imports', {
        'vuetify': {
          'transform': 'vuetify/es5/components/${member}',
          'preventFullImport': true
        },
        'lodash': {
          'transform': 'lodash/${member}',
          'preventFullImport': true
        }
      }]
    ]
  },
  extractCSS: true,
  cssSourceMap: false,
  filenames: {
    chunk: ({ isDev }) => isDev ? '[name].js' : '[id].[chunkhash].js',
    css: ({ isDev }) => isDev ? '[name].css' : '[id].[contenthash].css'
  },
  extend (config, { isDev, isClient }) {
    config.resolve.alias['colors'] = path.resolve(__dirname, '..', 'assets/styles/app/partials/colors.scss')
    config.resolve.alias['media'] = path.resolve(__dirname, '..', 'assets/styles/app/partials/media.scss')

    genAsyncComponents('async-components-list')
    generateEventBusSchema()
    // fix Cycling error
    for (let plugin of config.plugins) {
      if (plugin.constructor.name === 'HtmlWebpackPlugin') {
        plugin.options = Object.assign(plugin.options, { chunksSortMode: 'none' })
      }
    }
    if (isDev && isClient) {
      const StyleLintPlugin = require('stylelint-webpack-plugin')

      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })

      config.plugins.push(new StyleLintPlugin({
        files: '**/*.{vue,scss}',
        configFile: 'stylelint.config.js',
        syntax: 'scss',
        context: 'src'
      }))
    }
    // use this plugin to create chunkhash, because default chunkhash and contenthash change from build to build
    if (!isDev) {
      config.plugins.unshift(new HashOutput())
    }
  }
}
