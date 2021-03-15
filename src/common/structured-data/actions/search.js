export function generateSearchAction ({ query, result }) {
  return {
    '@context': 'http://schema.org',
    '@type': 'SearchAction',
    'name': 'search',
    'query': query,
    'result': result
  }
}
