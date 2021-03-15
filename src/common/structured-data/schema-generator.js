const schemaGenerator = (generatorName, params) => {
  const generator = require('./' + generatorName)

  return generator.default(params)
}

export default schemaGenerator
