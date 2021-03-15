module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          ie: '11'
        }
      }
    ]
  ]
  const plugins = [
    'add-module-exports',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import'
  ]

  return {
    presets,
    plugins
  }
}
