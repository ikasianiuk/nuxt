import Vue from 'vue'
import { removeHTMLtags } from '../../helpers/removeHTMLtags'
import { generateAbsoluteURL } from '../../helpers/generate-absolute-url'

export default function generateAuctionSchema (auction) {
  const auctionAbsoluteURL = generateAbsoluteURL({
    route: {
      name: 'auction-id-name',
      params: { id: auction.id, name: auction.url_key }
    }
  }, auction.host, auction.routes)

  const result = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    '@id': auctionAbsoluteURL,
    url: auctionAbsoluteURL,
    gtin13: auction.ean,
    name: auction.title,
    image: Vue.prototype.$vidaXLimageDomain + auction.ean + '_s.jpg',
    offers: generateOffer(auction, auctionAbsoluteURL)
  }

  if (auction.ean) {
    result.description = removeHTMLtags(auction.description)
    result.review = generateReviews(auction.reviews)
    result.sku = auction.sku
    result.brand = auction.seller && auction.seller.title

    // need to skip aggregateRating if a product doesn't have reviews yet
    // otherwise, Google will throw an error
    if (auction.reviews.length) {
      result.aggregateRating = {
        ratingValue: auction.product_rating,
        reviewCount: auction.reviews.length
      }
    }
  }

  return result
}

function generateOffer (auction, url) {
  return {
    url,
    name: 'Auction',
    availability: auction.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
    deliveryLeadTime: auction.delivery_times && auction.delivery_times.days,
    seller: auction.seller && auction.seller.title,
    priceCurrency: auction.currency,
    priceSpecification: generatePriceSpecification(auction),
    priceValidUntil: new Date(auction.end_time).toISOString()
  }
}

/**
 * check auction price and check whether to add discount or not
 * @param price
 * @param vat
 * @param offer_type
 * @param discount_price
 * @param expires
 * @param offer_price
 * @returns {{'@type': string, price: *, valueAddedTaxIncluded: boolean}}
 */
export function generatePriceSpecification ({ price, special_price, vat, end_time }) {
  const result = {
    '@type': 'CompoundPriceSpecification',
    price: special_price || price,
    valueAddedTaxIncluded: true
  }

  if (end_time) {
    result.validThrough = new Date(end_time).toISOString()
    result.validFrom = new Date(end_time).toISOString()
  }

  if (!vat) return result

  const targetPrice = price || special_price
  const priceExcludingVAT = targetPrice / (1 + vat)
  const valueOfVat = targetPrice - priceExcludingVAT

  result.priceComponent = [
    {
      name: 'Price excluding VAT',
      price: priceExcludingVAT.toFixed(2),
      valueAddedTaxIncluded: false
    },
    {
      name: 'VAT',
      price: valueOfVat.toFixed(2),
      valueAddedTaxIncluded: true
    }
  ]

  if (special_price < price) {
    result.priceComponent.push({
      name: 'Discount',
      price: (special_price - price).toFixed(2),
      valueAddedTaxIncluded: false
    })
  }

  return result
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
 * given array of ratings per each auction option generate Google 360 ratings array
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
