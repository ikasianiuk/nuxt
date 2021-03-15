// Load configuration modules
import headConfig from './src/config/head'
import cssConfig from './src/config/css'
import buildConfig from './src/config/build'
import pluginsConfig from './src/config/plugins'
import routerConfig from './src/config/router'
import serverMiddlewareConfig from './src/config/serverMiddleware'
import modulesConfig from './src/config/modules'
import manifestConfig from './src/config/manifest'
import renderConfig from './src/config/render'
import workboxConfig from './src/config/workbox'
import { applyEnvironment } from './src/config/env'

// need to do it before running nuxt build process
applyEnvironment()

export default {
  srcDir: 'src/',
  head: headConfig,
  css: cssConfig,
  build: buildConfig,
  plugins: pluginsConfig,
  router: routerConfig,
  serverMiddleware: serverMiddlewareConfig,
  modules: modulesConfig,
  manifest: manifestConfig,
  render: renderConfig,
  loading: false,
  workbox: workboxConfig,
  env: {
    NODE_ENV: process.env.ENV_NAME
  },
  axios: {
    prefix: process.env.baseURL,
    browserBaseURL: '/api/v1',
    proxy: true,
    // https://axios.nuxtjs.org/options.html#proxyheaders
    proxyHeaders: false
  },
  proxy: {
    '/api/v1': {
      target: process.env.API_URL,
      pathRewrite: { '^/api/v1': '' },
      changeOrigin: true
    }
  }
}
