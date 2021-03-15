export const utils = {
  numberOfRequests: 0,
  store: null,
  setLoadingStatus (status) {
    this.store && this.store.commit('setLoading', status)
  }
}

if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    utils.store = $store
  })
}

/**
 * function to make requests from services and handle all cases in single place
 * @param axios - axios instance
 * @param config - options for axios to make request with
 * @param methodName - string to help in debugging process if smth goes wrong
 * @param options - object with options:
 *        - showProgressBar - show/hide progress bar while request is being made
 * @returns {Promise<*>}
 */
export async function makeServiceRequest (axios, config, methodName, options = { showProgressBar: true }) {
  try {
    if (options.showProgressBar) {
      utils.numberOfRequests++
      utils.setLoadingStatus(true)
    }

    const result = await axios(config)

    options.showProgressBar && utils.numberOfRequests--

    if (utils.numberOfRequests <= 0) {
      utils.setLoadingStatus(false)
      utils.numberOfRequests = 0
    }

    return result
  } catch (error) {
    methodName && console.log(methodName, error)
    utils.numberOfRequests = 0
    utils.setLoadingStatus(false)

    // Create payload based on axios response - https://github.com/axios/axios#handling-errors
    const { response: errorResponse } = error

    let statusCode
    let errorMessage

    // set 404 status only when it's really 404
    if (errorResponse && errorResponse.status === 404) {
      statusCode = 404
      errorMessage = 'NotFound'
    } else { // otherwise use always 500
      statusCode = 500
      errorMessage = 'InternalError'
    }

    // this payload can be used for nuxt error helper
    // https://nuxtjs.org/api/context/#error
    error.$nuxtPayload = { statusCode, errorMessage }

    throw error
  }
}

export function queryGenerator ({ query: urlQuery, page_size, category_id, seller_id, page_token, url_key }) {
  let filterQuery = ''
  const IN_STOCK = 'true,false' // for now we always show in stock products on a page
  const parsedQuery = parseQueryKey(urlQuery)
  const {
    selected_min_price,
    selected_max_price,
    in_stock,
    out_of_stock,
    order_by,
    cat,
    stock,
    sku,
    ean,
    query,
    tab,
    sls,
    no_redirect,
    ...selectedAttributes
  } = parsedQuery

  const searchQuery = parsedQuery.q ? encodeURIComponent(parsedQuery.q) : '*'

  if (selectedAttributes) {
    Object.keys(selectedAttributes).forEach(key => {
      if (key === 'category_path' || key === 'q' || key === 'sku') return

      const selectedAttributeValuesList = typeof selectedAttributes[key] === 'string'
        ? selectedAttributes[key].split(',')
        : selectedAttributes[key]

      selectedAttributeValuesList.forEach(selectedAttributeValue => {
        selectedAttributeValue && (filterQuery += `&attributes[${key}]=${selectedAttributeValue}`)
      })
    })
  }

  filterQuery += `&in_stock=${IN_STOCK}`
  // API will return both in stock and out of stock products in case if we send in_stock=true,false

  if (selected_min_price && selected_max_price) {
    filterQuery += '&selected_min_price=' + selected_min_price
    filterQuery += '&selected_max_price=' + selected_max_price
  }

  if (order_by) {
    filterQuery += '&order_by=' + order_by
  }

  let finalQuery = `search_text=${searchQuery}`
  if (seller_id) finalQuery += `&seller_id=${seller_id}`

  if (cat) finalQuery += `&cat=${cat}`

  if (stock) finalQuery += `&stock=${stock}`

  if (sku) finalQuery += `&sku=${sku}`

  if (ean) finalQuery += `&ean=${ean}`

  if (category_id) finalQuery += `&category_path=${category_id}`

  if (page_token) finalQuery += `&page_token=${page_token}`

  if (page_size) finalQuery += `&page_size=${page_size}`

  if (filterQuery) finalQuery += filterQuery

  if (sls) finalQuery += `&sls=${sls}`

  if (no_redirect) finalQuery += `&no_redirect=${no_redirect}`

  return finalQuery
}

function parseQueryKey (query) {
  let parsedQuery = {}
  // Parameters not related to product query should be ignore
  const blockParams = ['login']

  for (let key in query) {
    if (!blockParams.includes(key)) {
      const parsed = key.replace(/attributes\[\]=/g, '')
      parsedQuery[parsed] = query[key]
    }
  }

  return parsedQuery
}
