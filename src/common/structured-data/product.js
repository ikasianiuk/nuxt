import Vue from 'vue'
import { generateAbsoluteURL } from '../../helpers/generate-absolute-url'
import { generateCategoryString } from './helpers/productHelpers'
const YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000

export default function generateProductSchema (product) {
  const isOffer = product.offer_type || (product.offer_data && product.offer_data.expires) // first case is when we are on main page, second - SDO page
  const productAbsoluteURL = generateAbsoluteURL({
    route: {
      name: 'product-ean-name',
      params: { ean: product.ean, name: product.url_key || product.urlName }
    }
  }, product.host, product.routes)

  const result = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    '@id': productAbsoluteURL + '#product',
    url: productAbsoluteURL,
    gtin13: product.ean,
    name: product.title,
    image: Vue.prototype.$vidaXLimageDomain + product.ean + '_s.jpg',
    offers: isOffer ? generateLimitedOffer(product) : generateOffer(product, productAbsoluteURL)
  }

  if (!isOffer && product.ean) {
    result.description = product.description
    result.review = generateReviews(product.reviews)
    result.category = generateCategoryString(product.category)
    result.sku = product.sku
    result.brand = product.brand

    // need to skip aggregateRating if a product doesn't have reviews yet
    // otherwise, Google will throw an error
    if (product.reviews.length) {
      result.aggregateRating = {
        ratingValue: product.product_rating,
        reviewCount: product.reviews.length
      }
    }
  }

  return result
}

function generateLimitedOffer (product) {
  return {
    '@type': 'Offer',
    priceCurrency: product.currency,
    priceSpecification: generatePriceSpecification(product)
  }
}

function generateOffer (product, url) {
  return {
    url,
    name: 'Purchase',
    availability: product.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
    deliveryLeadTime: product.delivery_days,
    seller: product.seller && product.seller.title,
    priceCurrency: product.currency,
    priceSpecification: generatePriceSpecification(product),
    priceValidUntil: new Date(Date.now() + YEAR_IN_MILLISECONDS).toISOString()
  }
}

/**
 * check product price and check whether to add discount or not
 * @param price
 * @param vat
 * @param offer_type
 * @param discount_price
 * @param expires
 * @param offer_price
 * @returns {{'@type': string, price: *, valueAddedTaxIncluded: boolean}}
 */
export function generatePriceSpecification ({ price, special_price, offer_price, offer_type, expires, offer_data, vat, currency }) {
  const isWeeklyOffer = (offer_data && offer_data.is_weekly) || offer_type === 'weekly' // SDO page OR main page
  const expirationTimestamp = (offer_data && offer_data.expires) || expires // SDO page OR main page
  const currentPrice = +offer_price || +special_price || +price
  const result = {
    '@type': 'CompoundPriceSpecification',
    price: currentPrice && currentPrice.toFixed(2),
    valueAddedTaxIncluded: true,
    priceCurrency: currency || ''
  }

  if (expires || offer_price || (offer_data && offer_data.expires)) {
    result.validThrough = new Date(expirationTimestamp)
    result.validFrom = isWeeklyOffer ? firstDayOfWeek(expirationTimestamp) : startOfTheDay(expirationTimestamp)
  }

  if (!vat) return result

  const targetPrice = offer_price || price || special_price
  const priceExcludingVAT = targetPrice / (1 + vat)
  const valueOfVat = targetPrice - priceExcludingVAT

  result.priceComponent = [
    {
      name: 'Price excluding VAT',
      price: priceExcludingVAT && priceExcludingVAT.toFixed(2),
      valueAddedTaxIncluded: false
    },
    {
      name: 'VAT',
      price: valueOfVat && valueOfVat.toFixed(2),
      valueAddedTaxIncluded: true
    }
  ]

  if (!offer_type && special_price < price) {
    result.priceComponent.push({
      name: 'Discount',
      price: (special_price - price).toFixed(2),
      valueAddedTaxIncluded: false
    })
  }

  return result
}

function startOfTheDay (date) {
  const dateObject = new Date(date)

  dateObject.setUTCHours(0, 0, 0, 0)

  return dateObject
}

function firstDayOfWeek (date, firstDayOfWeekIndex) {
  const dateObject = new Date(date)
  const dayOfWeek = dateObject.getDay()
  const firstDayOfWeek = new Date(dateObject)
  const diff = dayOfWeek >= firstDayOfWeekIndex ? dayOfWeek - firstDayOfWeekIndex : 6 - dayOfWeek

  firstDayOfWeek.setDate(dateObject.getDate() - diff)
  firstDayOfWeek.setUTCHours(0, 0, 0, 0)

  return firstDayOfWeek
}

/**
 * take reviews and generate array with specific fields for Google 360
 * @param reviews
 * @returns {*}
 */
function generateReviews (reviews) {
  return reviews.map((review) => {
    return {
      author: review.author.nickname,
      reviewBody: review.text,
      reviewRating: generateReviewRatings(review.ratings)
    }
  })
}

/**
 * given array of ratings per each product option generate Google 360 ratings array
 * @param ratings
 * @returns {*}
 */
function generateReviewRatings (ratings) {
  return ratings.map((rating) => {
    return {
      reviewAspect: rating.label,
      ratingValue: rating.score
    }
  })
}
