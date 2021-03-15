export const LOCALES_WITH_SITEMAP = ['et-EE']

export const LOCALES_WITH_CHAT_BOT = [
  'en-IE',
  'bg-BG',
  'et-EE',
  'el-GR',
  'hr-HR',
  'lv-LV',
  'pt-PT',
  'da-DK',
  'lt-LT',
  'it-IT',
  'fi-FI',
  'en-AU',
  'sl-SI',
  'en-US',
  'hu-HU',
  'nb-NO',
  'sk-SK',
  'cs-CZ',
  'es-ES',
  'ro-RO',
  'en-GB',
  'sv-SE',
  'pl-PL',
  'de-CH',
  'fr-CH',
  'fr-BE',
  'nl-BE',
  'de-AT',
  'fr-FR',
  'nl-NL',
  'de-DE'
]

export const PAGES_NAMES_WITH_SCROLLABLE_HEADER = ['checkout']

export const FUNNEL_PAGE_WITH_SCROLLABLE_HEADER = ['login', 'cart']

export const DELIVERY_TYPES = {
  home: 'home-delivery',
  parcel: 'parcel-shop-delivery'
}

export const ERROR_CODES = {
  timeout: 'ECONNABORTED',
  forbidden: 403,
  badRequest: 400,
  invalidToken: 'TokenInvalidError',
  resetPassTokenExist: 'active_reset_password_token_exists'
}

export const EXECUTED_POST_CODES = [ '2899', '6798', '6799', '7151' ]

export const CHECKOUT_EVENT = {
  login: {
    label: 'Login',
    eventIndex: 0,
    eventData: {
      event: 'login',
      message: 'Customer complete login and land on checkout'
    }
  },
  shipping: {
    label: 'Shipping',
    eventIndex: 1,
    eventData: {
      event: 'shipping',
      message: 'Customer choose shipping method'
    }
  },
  payment: {
    label: 'Payment',
    eventIndex: 2,
    eventData: {
      event: 'payment',
      message: 'Customer choose payment method'
    }
  },
  review: {
    label: 'Review',
    eventIndex: 3,
    eventData: {
      event: 'review',
      message: 'Customer reviewing the order details'
    }
  },
  adyen: {
    label: 'Adyen',
    eventIndex: 4,
    eventData: {
      event: 'adyen',
      message: 'Go to payment'
    }
  }
}

export const ADYEN_CALLBACK_NONEMPTY_FIELD = [
  'billingAddress.city',
  'billingAddress.country',
  'billingAddress.postalCode',
  'billingAddress.street',
  'deliveryAddress.city',
  'deliveryAddress.country',
  'deliveryAddress.postalCode',
  'deliveryAddress.street'
]

export const ERROR_SHOULD_HAS_7_CHARCTERS = 2
export const ERROR_SHOULD_HAS_7_CHARCTERS_LETTER_NUMBER = 3
export const ERROR_SHOULD_HAS_7_CHARCTERS_LETTER_NUMBER_256_MAX = 3
export const MAX_PASSWORD_LENGTH = 256

export const CHECKOUT_METHODS = {
  customer: 'customer',
  guest: 'guest'
}

export const AUTH_TYPES = ['login', 'register']

export const MAX_COUNT_CROSS_SELL_PRODUCTS = 20

export const CATEGORIES_WITH_ICONS = [6392, 999999, 988, 922, 888, 772, 696, 6792, 6362, 6356, 6347, 6346, 632, 594, 537, 536, 5181, 500000, 469, 457, 443, 436, 2002, 166, 141, 1239, 111, 107, 1]

export const PRINT_ORDER_IFRAME_ID = 'print-order'

export const CASH_ON_DELIVERY_METHOD_NAME = 'COD'

export const GA_CHECKOUT_TYPES = {
  PayPal: 'PayPal',
  Normal: 'Normal',
  Guest: 'Guest',
  NotSet: 'not set'
}

export const LS_PAYMENT_METHOD_KEY = 'checkedPaymentMethod'

export const CMS_BLOCKS_IDS = {
  orderDelay: 'order_delay_block'
}
