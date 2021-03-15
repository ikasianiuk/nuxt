import { generateAbsoluteURL } from '../../helpers/generate-absolute-url'

/**
 * create breadcrumbs object for Google bot
 * @param breadcrumbs
 * @param host
 * @param routes
 * @returns {{"@context": string, "@type": string, itemListElement: Array}}
 */
export default function generateBreadCrumbsSchema ({ breadcrumbs, host, routes }) {
  if (!breadcrumbs) return {}

  let result = {
    '@context': 'http://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: []
  }

  const filteredBreadcrumbs = breadcrumbs.filter(e => !(e.plain || e.shouldMoveBack || e.forceMobileView))
  filteredBreadcrumbs.forEach((breadcrumb, index) => {
    result.itemListElement.push({
      '@type': 'ListItem',
      'position': index + 1,
      item: {
        '@id': generateAbsoluteURL(breadcrumb, host, routes),
        'name': breadcrumb.title || breadcrumb.name
      }
    })
  })

  return result
}
