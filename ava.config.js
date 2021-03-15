export default {
  files: [
    './src/tests/unit/**/*.test.js',
    './src/tests/locale/*.test.js'
  ],
  sources: [
    '**/*.{js,vue}'
  ],
  failFast: true,
  verbose: true,
  snapshotDir: './src/tests/snapshots',
  require: [
    './src/tests/helpers/setup.js',
    '@babel/register',
    '@babel/polyfill',
    'esm'
  ]
}
