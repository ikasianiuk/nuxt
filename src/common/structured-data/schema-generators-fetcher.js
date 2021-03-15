export async function schemaGeneratorFetcher (names, app) {
  if (Array.isArray(names) && names.length) {
    let promises = []
    let schemasToFetch = []

    for (let item of names) {
      let name = item.schemaName || item

      if (!(name in app.$getGenerators())) {
        promises.push(import('./' + name))
        schemasToFetch.push(item)
      }
    }

    if (promises.length) {
      try {
        let result = await Promise.all(promises)

        result.map((generator, index) => {
          let item = schemasToFetch[index]

          app.$setGenerator({
            name: item.name || item,
            fn: generator.default,
            multiple: item.multiple
          })
        })
      } catch (e) {
      }
    }
  }
}
