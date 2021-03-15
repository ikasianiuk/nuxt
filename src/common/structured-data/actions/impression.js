import { generateAbsoluteURL } from '../../../helpers/generate-absolute-url'

/**
 * in order to fire impression once per product during session, remember ean in session storage
 * @param ean
 */
export function markProductAsImpressed (ean) {
  const rawImpressionsData = sessionStorage.getItem('impressions')
  const impressions = rawImpressionsData ? JSON.parse(rawImpressionsData) : []

  impressions.push(ean)
  sessionStorage.setItem('impressions', JSON.stringify(impressions))
}

/**
 * check whether product page has fired impression action
 * @param ean
 * @returns {*}
 */
export function didImpressionFire (ean) {
  const rawImpressionsData = sessionStorage.getItem('impressions')
  if (!rawImpressionsData) return false

  const impressions = JSON.parse(rawImpressionsData)

  return ~impressions.indexOf(ean)
}

export function addImpression ({ ean, url_key, id, host, routes, isAuction }) {
  const productAbsoluteURL = generateAbsoluteURL({
    route: isAuction ? {
      name: 'auction-id-name',
      params: { id, name: url_key }
    } : {
      name: 'product-ean-name',
      params: { ean, name: url_key }
    }
  }, host, routes)

  return {
    '@context': 'http://schema.org',
    '@type': 'DiscoverAction',
    'name': 'impression',
    'object': {
      '@type': 'Product',
      '@id': productAbsoluteURL
    }
  }
}
