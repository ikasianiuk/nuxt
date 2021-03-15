import { ERROR_CODES } from '@/helpers/constants'

export const CUSTOMER_SESSION_ROUTE = '/sessions'
export const PRODUCTS_SEARCH_ROUTE = '/product-listings'

export default function ({ store, app: { $sentry: sentry, $axios } }, inject) {
  const axiosInstance = $axios.create({
    timeout: 60000 // temporarily use 1 minute
  })

  const userAgent = store.getters['getUserAgent']
  process.server && axiosInstance.setHeader('user-agent', userAgent)

  axiosInstance.onRequest(async req => {
    req.headers.locale = store.getters['getLocale'].replace('-', '_').toLowerCase()
    const currentToken = store.getters['customer/getToken']
    // no need to attach token and check expiration date if user asks for token now for the first time or refreshes it
    const reqWithoutToken = req.url.includes(CUSTOMER_SESSION_ROUTE) && ['put', 'get'].includes(req.method)

    if (!currentToken || reqWithoutToken) return req

    // check if token is expired
    await store.dispatch('customer/refreshToken')
    req.headers.authorization = store.getters['customer/getToken']

    return req
  })

  axiosInstance.onResponse(res => {
    if ((res.data === null || res.data.status === 404) && res.config.url.indexOf(PRODUCTS_SEARCH_ROUTE) !== -1) {
      res.data = { status: 404, message: 'products: Not found' }
      return res.data
    }

    if (typeof res.data === 'string' && res.data.search(/\b(\w*error\w*)\b/)) {
      const { url, method } = res.config
      const { data } = res

      const errorData = {
        url,
        method,
        data
      }

      throw new Error(JSON.stringify(errorData))
    }

    if (res.data.status !== 200 && res.data.statusText) {
      throw new Error(JSON.stringify(res.data))
    }

    return res
  })

  axiosInstance.onResponseError(async err => {
    const originalRequest = err.config
    // retry original request if it fails because of invalid token error
    if (err.response.data.message.includes(ERROR_CODES.invalidToken) && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      await store.dispatch('customer/refreshToken', { forceRefresh: true })
      originalRequest.headers.authorization = store.getters['customer/getToken']
      return await axiosInstance(originalRequest)
    }
    sentry.captureException(new Error(err))
    store.commit('setError', err)
    throw err
  })

  inject('axiosInstance', axiosInstance)
}
