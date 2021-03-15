import { generateCategoryString, generatePriceValidUntil } from './helpers/productHelpers'
import { generateAbsoluteURL } from '../../helpers/generate-absolute-url'

export function generateRemoveFromCartSchema ({ ean, name, quantity, price, url_key, vat, currency, routes, host }) {
  const priceExcludingVAT = price / (1 + vat)
  const productAbsoluteURL = generateAbsoluteURL({
    route: {
      name: 'product-ean-name',
      params: { ean: ean, name: url_key }
    }
  }, host, routes)

  return {
    '@context': 'http://schema.org',
    '@type': 'DeleteAction',
    'name': 'remove_from_cart',
    'object': {
      '@type': 'Product',
      '@id': `${productAbsoluteURL}#product`,
      'name': name,
      'url': productAbsoluteURL,
      'offers': {
        '@type': 'Offer',
        'includesObject': {
          '@type': 'TypeAndQuantityNode',
          'amountOfThisGood': quantity
        }
      },
      'priceSpecification': {
        '@type': 'CompoundPriceSpecification',
        'name': 'Price',
        'price': price,
        'priceCurrency': currency,
        'valueAddedTaxIncluded': true,
        'priceComponent': [
          {
            'name': 'Price excluding VAT',
            'price': priceExcludingVAT,
            'valueAddedTaxIncluded': false
          },
          {
            'name': 'VAT',
            'price': priceExcludingVAT * vat,
            'valueAddedTaxIncluded': true
          }
        ]
      }
    }
  }
}

export function generateAddToCartSchema (
  {
    url_key, ean, sku, host, routes, title, description, product_brand = '',
    category, delivery_times, currency, price, special_price, vat
  }
) {
  if (!url_key || !ean) return

  const productAbsoluteURL = generateAbsoluteURL({
    route: {
      name: 'product-ean-name',
      params: { ean: ean, name: url_key }
    }
  }, host, routes)

  return {
    '@context': 'http://schema.org',
    '@type': 'AddAction',
    'name': 'add_to_cart',
    'object': {
      '@type': 'Product',
      '@id': `${productAbsoluteURL}#product`,
      'name': title,
      'description': description,
      'url': productAbsoluteURL,
      'image': this.getImageUrl({ ean, type: 'a', lang: 'en', size: 'r458', extension: '.jpg' }),
      'productID': sku,
      'sku': sku,
      'gtin13': ean,
      'brand': product_brand,
      ...category && { 'category': generateCategoryString(category) },
      'offers': {
        'name': 'Purchase',
        'url': productAbsoluteURL,
        'availability': 'http://schema.org/InStock',
        ...delivery_times && { 'deliveryLeadTime': delivery_times.days },
        'priceCurrency': currency,
        'priceValidUntil': generatePriceValidUntil(),
        'includesObject': {
          'amountOfThisGood': 1
        },
        'priceSpecification': generatePriceSpecification({
          price: special_price || price,
          vat
        })
      }
    }
  }
}

export function generateCartSchema (cart) {
  const cartItem = cart.items.map(cartItem => {
    const { id, ean, quantity, price, category } = cartItem
    return {
      '@type': 'Product',
      'productID': id,
      'sku': id,
      'gtin13': ean,
      'category': category,
      'offers': {
        '@type': 'Offer',
        'includesObject': {
          '@type': 'TypeAndQuantityNode',
          'amountOfThisGood': quantity
        },
        'priceSpecification': {
          '@type': 'CompoundPriceSpecification',
          'name': 'Price',
          'price': price,
          'priceCurrency': cart.currency,
          'valueAddedTaxIncluded': true
        }
      }
    }
  })
  return {
    '@context': 'http://schema.org',
    '@type': 'Order',
    'name': 'cart',
    'orderTotal': cart.total,
    'discount': cart.discount,
    'shipmentCost': cart.shippingCosts,
    'orderedItem': cartItem
  }
}

/**
 * check product price and calculate VAT
 * @param price
 * @param vat
 * @returns {{'@type': string, price: *, valueAddedTaxIncluded: boolean}}
 */

function generatePriceSpecification ({ price, vat }) {
  const priceExcludingVAT = price / (1 + vat)
  const valueOfVat = priceExcludingVAT * vat

  return {
    '@type': 'CompoundPriceSpecification',
    name: 'Price',
    price: price,
    valueAddedTaxIncluded: true,
    priceComponent: [
      {
        name: 'Price excluding VAT',
        price: priceExcludingVAT,
        valueAddedTaxIncluded: false
      },
      {
        name: 'VAT',
        price: valueOfVat,
        valueAddedTaxIncluded: true
      }
    ]
  }
}
