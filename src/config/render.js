import { pagesCacheTTLs } from '@/common/maps/pages-cache-ttls'

// Customize runtime options for rendering pages

export default {
  resourceHints: true,
  // Set up max age for assets in /static/ folder
  // https://nuxtjs.org/api/configuration-render#static
  static: {
    maxAge: 1000 * pagesCacheTTLs.STATIC
  },
  bundleRenderer: {
    runInNewContext: false,
    shouldPreload: (file, type) => {
      // type is inferred based on the file extension.
      // https://fetch.spec.whatwg.org/#concept-request-destination
      // if browser understands rel="preload", it supports woff2
      if (type === 'font') return /.woff2/.test(file)
      return ['script', 'style'].includes(type)
    }
  }
}
