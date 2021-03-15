import { makeServiceRequest, queryGenerator } from './common-service-functionality'

export default {
  getProductByEAN (ean, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/pages/products/${ean}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: ProductService.getProductByEAN(),' +
      ' REQUEST: GET - /stores/{locale}/pages/products/{ean}'
    )
  },

  getProductCrossSelling (ean, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      baseURL: process.server ? process.env.CROSS_SELLING_API_URL : '/cross-sell',
      url: `/product-catalog/products/${ean}/linked-products/cross_sell/${locale}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: ProductService.getProductCrossSelling(),' +
      ' REQUEST: GET - {CROSS_SELLING_API}/v1/product-catalog/products/{ean}/linked-products/cross_sell/{locale}'
    )
  },

  getProductBySKU (sku, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/pages/products:search?sku=${sku}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: ProductService.getProductBySKU(),' +
      ' REQUEST: GET - /stores/{locale}/pages/products:search?sku={sku}'
    )
  },

  getProductReviewsBySKU ({ sku, limit }, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/products/${sku}/reviews/trustpilot?page=1&page_size=${limit}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: ProductService.getProductReviewsBySKU(),' +
      ' REQUEST: GET - /stores/{locale}/products/{ean}/reviews'
    )
  },

  getProductOffersByEAN (ean, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/products/${ean}/offers`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: ProductService.getProductOffersByEAN(),' +
      ' REQUEST: GET - /stores/{locale}/products/{ean}/offers'
    )
  },

  fetchProducts ({ query, ...params }, { locale, axios }) {
    const IN_STOCK = 'true,false' // currently always show in stock products
    const queryData = {
      search_text: query.q || '*',
      page_token: params.page_token,
      page_size: params.page_size
    }

    queryData.in_stock = IN_STOCK
    query.order_by && (queryData.order_by = query.order_by)

    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/pages/product-listings`,
      params: queryData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: ProductService.getProductBySearch(),' +
      ' REQUEST: GET - /stores/{locale}/product-listings?{...query_params}'
    )
  },

  getProductList (query, { locale, axios }) {
    const finalQuery = queryGenerator(query)

    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/pages/product-listings?${finalQuery}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: ProductService.getProductList(),' +
      ' REQUEST: GET - /stores/{locale}/pages/product-listings?{query}'
    )
  },

  fetchReviewList ({ ean, page_number = 0, page_size = 6 }, { locale, axios }) {
    const query = `page_token=${page_number}&page_size=${page_size}`

    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/products/${ean}/reviews?${query}`,
      headers: { 'Content-Type': 'application/json' }
    },
    'METHOD: ProductService.fetchReviewList(),' +
      ' REQUEST: GET - /stores/{locale}/products/{ean}/reviews?{...query_params}'
    )
  },

  createReview (body, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'post',
      url: `/stores/${locale}/products/${body.ean}/reviews`,
      data: body,
      headers: { 'Content-Type': 'application/json' }
    },
    'METHOD: ProductService.createReview(),' +
      ' REQUEST: POST - /stores/{locale}/products/{ean}/reviews'
    )
  },

  likeOrReportReview (product_id, review_id, body, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'put',
      url: `/stores/${locale}/products/${product_id}/reviews/${review_id}`,
      data: body,
      headers: { 'Content-Type': 'application/json' }
    },
    'METHOD: ProductService.likeOrReportReview(),' +
      ' REQUEST: PUT - /stores/{locale}/products/{product_id}/reviews/{review_id}'
    )
  },

  fetchProductsAutoComplete ({ query }, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'GET',
      url: `/stores/${locale}/suggestions?query=${query}`,
      headers: { 'Content-Type': 'application/json' }
    },
    'METHOD: ProductService.fetchProductsAutoComplete(),' +
      ' REQUEST: GET - /stores/{locale}/suggestions?query={query}',
    { showProgressBar: false })
  }
}
