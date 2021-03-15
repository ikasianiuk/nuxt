const YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000

/**
 * take an array of categories and turn it into string:
 * from:
 * [{ id: 1, title: 'One' }, { id: 2, title: 'Two' }]
 * to:
 * 'One (1) > Two (2)'
 * @param categories
 * @returns {String}
 */

export function generateCategoryString (categories) {
  return categories.reduce((acc, current, index, array) => {
    const arrow = index === array.length - 1 ? '' : ' > '

    return `${acc}${current.title} (${current.id})${arrow}`
  }, '')
}

/**
 * generates an expire date for valid price
 * @returns {String}
 */

export function generatePriceValidUntil () {
  return new Date(Date.now() + YEAR_IN_MILLISECONDS).toISOString()
}

/**
 * generates product schema from product data
 * @returns {Object}
 */

export function generateAddToCartProductData (
  {
    sku, ean, title, category, delivery_times, description, special_price, price, url_key, brand = '', material = '', color = '', model = ''
  }
) {
  return {
    id: sku,
    sku,
    ean,
    title,
    category,
    delivery_times,
    description,
    price: special_price || price,
    url_key,
    img_url: this.getImageUrl({ ean: ean, type: 'a', lang: 'en', size: 'r458', extension: '.jpg' }),
    brand,
    material,
    color,
    model
  }
}
