export const orderStartActionData = {
  '@context': 'http://schema.org',
  '@type': 'Action',
  'name': 'order_start'
}

export function genarateOrderCheckpointAction (index, type) {
  return {
    '@context': 'http://schema.org',
    '@type': 'Action',
    'name': `order_checkpoint_${index}`,
    'funnel': type
  }
}

export function genarateOrderFinishedAction (order, type) {
  const orderedItems = order.items.map(orderedItem => {
    const { sku, ean, quantity, price, special_price, category, name } = orderedItem
    const priceExcludingVAT = price / (1 + order.vat)
    const valueOfVat = priceExcludingVAT * order.vat

    const priceComponent = [
      {
        'name': 'Price excluding VAT',
        'price': priceExcludingVAT.toFixed(2),
        'valueAddedTaxIncluded': false
      },
      {
        'name': 'VAT',
        'price': valueOfVat.toFixed(2),
        'valueAddedTaxIncluded': true
      }
    ]

    if (special_price < price) {
      priceComponent.push({
        name: 'Discount',
        price: (special_price - price).toFixed(2),
        valueAddedTaxIncluded: false
      })
    }

    return {
      '@type': 'Product',
      'productID': sku,
      'sku': sku,
      'category': category,
      'gtin13': ean,
      'productName': name,
      'offers': {
        'includesObject': {
          'amountOfThisGood': quantity
        },
        'priceSpecification': {
          '@type': 'CompoundPriceSpecification',
          'name': 'Price',
          'price': special_price || price,
          'priceCurrency': order.currency,
          'valueAddedTaxIncluded': true,
          'priceComponent': priceComponent
        }
      }
    }
  })

  return {
    '@context': 'http://schema.org',
    '@type': 'Action',
    'name': 'order_finished',
    'funnel': type,
    'object': {
      '@type': 'Order',
      'orderNumber': order.order_id.toString(),
      'orderTotal': order.total,
      'paymentMethod': `http://purl.org/goodrelations/v1#${order.payment_method}`,
      'orderedItem': orderedItems
    }
  }
}

export function genarateOrderStartAction (type) {
  return {
    ...orderStartActionData,
    'funnel': type
  }
}
