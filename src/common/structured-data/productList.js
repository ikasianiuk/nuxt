// functionality for generating G360 product list schema
import { generateAbsoluteURL } from '../../helpers/generate-absolute-url'
import { generatePriceSpecification } from './product'

export default function generateProductListSchema ({ categoryTitle, categoryData, products, currency, routes, host, vat, isAuctionList }) {
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    itemListElement: []
  }

  const parentURL = categoryData && generateAbsoluteURL({
    route: isAuctionList ? { name: 'auction-list' } : {
      name: 'category-id-name',
      params: {
        id: categoryData.id,
        name: categoryData.url_key
      }
    }
  }, host, routes)

  parentURL && (schema.url = parentURL)
  categoryTitle && (schema.name = categoryTitle)

  products.map((product, index) => {
    const generatedURL = generateAbsoluteURL({
      route: isAuctionList ? {
        name: 'auction-id-name',
        params: {
          id: product.id,
          name: product.url_key
        }
      } : {
        name: 'product-ean-name',
        params: {
          ean: product.ean,
          name: product.url_key
        }
      }
    }, host, routes)

    const item = generateListItem({
      isAuctionList,
      index,
      product,
      currency,
      parentURL,
      generatedURL,
      vat
    })

    schema.itemListElement.push(item)
  })

  return schema
}

function generateListItem ({ index, product, currency, generatedURL, vat, isAuctionList }) {
  const { title, img_url, in_stock, special_price, price, sku, ean } = product

  const generatedItem = {
    '@type': 'ListItem',
    'position': index + 1,
    'item': {
      '@type': 'Product',
      'name': title,
      '@id': `${generatedURL}#product`,
      'url': generatedURL,
      sku,
      'image': img_url,
      'gtin13': ean,
      'offers': {
        'name': isAuctionList ? 'Auction' : 'Purchase',
        'url': generatedURL,
        'availability': isAuctionList ? 'http://schema.org/LimitedAvailability' : in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
        'priceCurrency': currency,
        'priceSpecification': generatePriceSpecification({ price, special_price, vat, currency })
      }
    }
  }

  if (isAuctionList) {
    generatedItem.item.offers.priceValidUntil = new Date(Date.now() + 1000).toISOString()
    generatedItem.item.offers.validTrough = product.end_time && new Date(product.end_time).toISOString()
  }

  return generatedItem
}
