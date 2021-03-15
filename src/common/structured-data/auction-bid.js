import { generateAbsoluteURL } from '../../helpers/generate-absolute-url'

export function generateAuctionBidAction ({ id, url_key, title, sku, ean, routes, host, price, currency, end_time }) {
  const validTime = new Date(end_time).toISOString()
  const bidTime = new Date(Date.now()).toISOString()
  const auctionUrl = generateAbsoluteURL({
    route: {
      name: 'auction-id-name',
      params: { id, name: url_key }
    }
  }, host, routes)
  const productUrl = generateAbsoluteURL({
    route: {
      name: 'product-ean-name',
      params: { ean, name: url_key }
    }
  }, host, routes)

  return {
    '@context': 'http://schema.org',
    '@type': 'AddAction',
    name: 'bid',
    object: {
      '@type': 'Offer',
      name: 'Bid',
      businessFunction: 'http://purl.org/goodrelations/v1#Buy',
      url: auctionUrl,
      price,
      priceCurrency: currency,
      priceValidUntil: validTime,
      validThrough: validTime,
      validFrom: bidTime,
      itemOffered: {
        '@type': 'Product',
        '@id': productUrl,
        name: title,
        url: productUrl,
        productID: ean,
        sku,
        gtin13: ean
      }
    }
  }
}
