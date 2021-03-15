export const routeReplacements = {
  'product-ean-name': {
    from: '/product',
    to: '/e',
    additionalRoute: '/p'
  },
  'category-id-name': {
    from: '/category',
    to: '/g',
    additionalRoute: '/c'
  },
  'product-search': {
    from: '/product/search',
    to: '/catalogsearch/result'
  },
  'index': {
    from: '/',
    to: '/',
    additionalRoute: '/newsletter/subscriptionsuccessful'
  }
}

export const magentoRedirects = [
  {
    path: '/shop/index/detail/id/:id/name/:name/',
    redirect: '/seller/:id/:name'
  }
]

export function removeAttributesFromObjKeys (obj, isFilter) {
  let updatedObject = {}

  for (let key in obj) {
    const parsedKey = key.replace(/attributes\[\]=/g, '')
    isFilter && (obj[key] = obj[key].split(','))

    updatedObject[parsedKey] = obj[key]
  }

  return updatedObject
}
