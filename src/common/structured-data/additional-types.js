/**
 * purpose of this file is to store all additional types per route for WebPage schema in one place
 */
export const additionalTypesPerRoute = {
  // these types should be present on any page
  all: [
    'https://vidaxl.nl/#/PageType/Newsletter' // we can subscribe to newsletter on any page
  ],
  'product-ean-name': [
    'https://vidaxl.nl/#/PageType/Product'
  ],
  'category-id-name': [
    'https://vidaxl.nl/#/PageType/ProductList'
  ],
  'auction-list': [
    'https://vidaxl.nl/#/PageType/AuctionList'
  ],
  'index': [
    'https://vidaxl.nl/#/PageType/TimeLimitedOffer',
    'https://vidaxl.nl/#/PageType/ProductList',
    'https://vidaxl.nl/#/PageType/Inspiration',
    'https://vidaxl.nl/#/PageType/Home',
    'https://vidaxl.nl/#/PageType/AuctionList'
  ],
  'login': [
    'https://vidaxl.nl/#/PageType/Login',
    'https://vidaxl.nl/#/PageType/Registration'
  ],
  'cart': [
    'https://vidaxl.nl/#/PageType/Cart'
  ],
  'customer-service-information': [
    'https://vidaxl.nl/#/PageType/FAQ'
  ],
  'checkout': [
    'https://vidaxl.nl/#/PageType/Checkout'
  ],
  'product-search': [
    'https://vidaxl.nl/#/PageType/Search',
    'https://vidaxl.nl/#/PageType/ProductList'
  ],
  'campaign-year-month-day-name': [
    'https://vidaxl.nl/#/PageType/ProductList'
  ],
  'landing_cms_id': [
    'https://vidaxl.nl/#/PageType/ProductList'
  ],
  'thankyou': [
    'https://vidaxl.nl/#/PageType/Order'
  ]
}
