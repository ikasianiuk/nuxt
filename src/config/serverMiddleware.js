// Server middleware config
import bodyParser from 'body-parser'

export default [
  // we need bodyParser for adyen drop in 3D security check
  // Adyen will post data to page /adyen/dropin/process
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  { path: '/nuxt/status', handler: '~/server-routes/status.js' },
  { path: '/robots.txt', handler: '~/server-routes/robots.js' }
]

