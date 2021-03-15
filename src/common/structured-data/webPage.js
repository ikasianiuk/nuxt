import { find } from 'lodash'
import { additionalTypesPerRoute } from './additional-types'

export default function generateWebPageSchema ({ url, locale, name, description, host, route, routes, additionalTypes }) {
  const pageURL = host + url
  let searchURL = find(routes, { name: 'product-search' })
  searchURL = host + searchURL.path + '?q={search_term}'

  return {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    '@id': pageURL,
    'url': pageURL,
    'additionalType': getAdditionalTypes(route.name, additionalTypes),
    'name': name,
    'description': description,
    'inLanguage': locale,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': searchURL,
      'query-input': 'required name=search_term'
    }
  }
}

function getAdditionalTypes (routeName, manuallyPassedTypes) {
  let types = additionalTypesPerRoute.all

  if (routeName in additionalTypesPerRoute) {
    types = types.concat(additionalTypesPerRoute[routeName])
  }

  manuallyPassedTypes && manuallyPassedTypes.length && (types = types.concat(manuallyPassedTypes))

  return types
}
