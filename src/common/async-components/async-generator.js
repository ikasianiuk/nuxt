/* file which generates appropriately formatted and ready-to-use module with all async components */
import componentsList from './components'
import fs from 'fs-extra'

export function genAsyncComponents (fileName) {
  let file = `/* autogenerated ${new Date()} by nuxt.js and webpack, do not modify manually */\n`
  file += `export default {\n`
  componentsList.forEach(({ path, chunkName }, index) => {
    let componentName = path.split('/').pop()
    file += `\t${componentName}: () => import(/* webpackChunkName: '${chunkName || componentName}' */ '${path}')`
    if (index !== componentsList.length - 1) {
      file += `,\n`
    }
  })
  file += `\n}\n`
  fs.writeFileSync('./src/common/async-components/' + fileName + '.js', file)
}