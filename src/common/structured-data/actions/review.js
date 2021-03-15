import { generateAbsoluteURL } from '../../../helpers/generate-absolute-url'

export function generateReviewAction ({ product, host, routes }) {
  const { ean, url_key, title, sku, brand } = product

  const productAbsoluteURL = generateAbsoluteURL({
    route: {
      name: 'product-ean-name',
      params: { ean, name: url_key }
    }
  }, host, routes)

  return {
    '@context': 'http://schema.org',
    '@type': 'AddAction',
    'name': 'review',
    'object': {
      '@type': 'Product',
      '@id': productAbsoluteURL + '#product',
      'name': title,
      'url': productAbsoluteURL,
      'productID': ean,
      'sku': sku,
      'gtin13': ean,
      'brand': brand
    }
  }
}
