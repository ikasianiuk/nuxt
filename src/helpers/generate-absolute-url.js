import { find } from 'lodash'

/**
 * take map with all routes, find route by name, take its path and replace dynamic parameters with values
 * (if it has such)
 * example: "/seller/:id?/:name?" -> "/seller/123/bosch"
 * and add this to base site URL
 * @param breadcrumb
 * @param routes
 * @param host
 * @returns {string}
 */
export function generateAbsoluteURL (breadcrumb, host, routes) {
  if (routes && breadcrumb.route && breadcrumb.route.name) {
    const matchingRoute = find(routes, { name: breadcrumb.route.name })
    let { path } = matchingRoute
    const { params } = breadcrumb.route

    if (params) {
      for (let parameter in params) {
        path = path.replace(`:${parameter}?`, params[parameter])
      }
    }

    return host + path
  }
}
