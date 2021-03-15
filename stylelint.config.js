module.exports = {
  processors: [
    ['@mapbox/stylelint-processor-arbitrary-tags', { fileFilterRegex: [/\.vue$/] }]
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order'
  ],
  rules: {
    'no-empty-source': null,
    'at-rule-no-unknown': null,
    'no-descending-specificity': null
  },
  ignoreFiles: ['**/*.js']
}
