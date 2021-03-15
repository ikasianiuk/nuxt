import { routeReplacements } from '../common/route-replacements'

export default ({ app, store }, inject) => {
  inject('checkRedirectRoute', (route) => {
    if (route.name in routeReplacements && routeReplacements[route.name].additionalRoute) {
      return route.path.includes(routeReplacements[route.name].additionalRoute + '/')
    }

    return false
  })
  app.router.beforeEach(async (to, from, next) => {
    // fix artefact actions issue
    if (process.client) {
      window.artefact = window.artefact || {}
      window.artefact.reset && window.artefact.reset()
    }

    const isLoggedIn = store.getters['customer/getLoggedIn']
    if (process.server || !isLoggedIn) return next()

    // Redirect customer to login page if customer session expired and in these page:
    // cart, checkout, account, thankyou
    const redirectLoginPages = [
      'cart',
      'checkout',
      'account'
    ]
    const redirectHomepage = ['thankyou']
    const redirectPages = redirectLoginPages.concat(redirectHomepage)

    // Redirect customer to account page if logged in customer visit these pages
    const redirectAccountPages = ['login']

    if (redirectPages.includes(to.name)) {
      // Refresh token if expire
      await store.dispatch('customer/refreshToken')
      if (!store.getters['customer/getLoggedIn']) {
        to.name === 'checkout' && store.commit('setCheckoutPageStatus', false)
        return next({ name: redirectLoginPages.includes(to.name) ? 'login' : 'index' })
      }
    } else if (redirectAccountPages.includes(to.name)) {
      return next({ name: 'account' })
    }

    next()
  })
}
