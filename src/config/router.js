// Config vue-router
import { routeReplacements, magentoRedirects } from '../common/route-replacements'

export default {
  middleware: ['redirects', 'check-current-page'],
  /*
  * allow redeclaring URL by providing options in route-replacements file
  */
  extendRoutes (routes) {
    magentoRedirects.forEach(magentoRedirect => routes.push(magentoRedirect))

    let extendedRoutes = routes.map(route => {
      if (route.name === 'account') route.children = [] // remove it when iframe from my account will be removed

      if (route.name in routeReplacements) {
        const matchedReplacer = routeReplacements[route.name]
        const path = route.path

        route.path = path.replace(matchedReplacer.from, matchedReplacer.to)

        if (matchedReplacer.additionalRoute) {
          route.alias = path.replace(matchedReplacer.from, matchedReplacer.additionalRoute)
        }
      }

      return route
    })

    return extendedRoutes
  },
}
