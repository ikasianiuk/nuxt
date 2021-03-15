const config = {
  // route name redirect
  // from -> to
  // 'account': 'account-details' // uncomment it when iframe from my account will be removed
}

const OLD_CUSTOMER_SERVICE_PAGE = '/customer-service-information'
const SDO_WDO_PATHS = ['/specialoffer/daily', '/specialoffer/weekly']

const getOfferPageLink = (type, offers) => {
  const offer = offers.find(offer => offer.offer_type === type)

  if (!offer) return '/404'

  return {
    name: 'product-ean-name',
    params: {
      ean: offer.ean,
      name: offer.url_key
    }
  }
}

export default function ({ route, redirect, store }) {
  // redirect for magento search result pages
  if (route.path === '/catalogsearch/result/') {
    const searchPage = { name: 'product-search' }
    const { q, query } = route.query

    if (q || query) {
      searchPage.query = {
        q: encodeURIComponent(q || query)
      }
    }

    return redirect(searchPage)
  }

  // redirect old customer service information pages to Zendesk knowledge base
  if (route.path === OLD_CUSTOMER_SERVICE_PAGE) {
    const faqLinks = require('@/common/maps/faq-links')
    const locale = store.getters.getLocale

    return redirect(faqLinks[locale])
  }

  // redirect to correct sdo page from link provided on other websites
  if (SDO_WDO_PATHS.includes(route.path)) {
    const offerType = route.path.includes('daily') ? 'daily' : 'weekly'
    const link = getOfferPageLink(offerType, store.state.info.shopInfo.special_product_offers)

    return redirect(link)
  }

  // redirect for newsletter confirm page
  // old magento confirm link is /advancednewsletter/index/activate/confirm_code/8400a000df32393adsf2a/email/test.test@vidaxl.com/
  // new path will be with hashed email /advancednewsletter/index/activate/confirm_code/8400a000df32393adsf2a/email_hash/dGVzdC50ZXN0QHZpZGF4bC5jb20=/
  // left both for backward compatibility
  if (route.path && route.path.includes('/advancednewsletter/index/activate/')) {
    const newsletterParams = route.path.split('/')
    const codeIndex = newsletterParams.indexOf('confirm_code') + 1
    const emailIndex = newsletterParams.indexOf('email') + 1
    const emailHashIndex = newsletterParams.indexOf('email_hash') + 1

    let emailQuery = ''
    if (emailHashIndex) emailQuery = `&email_hash=${newsletterParams[emailHashIndex]}`
    else if (emailIndex) emailQuery = `&email=${newsletterParams[emailIndex]}`

    return redirect(`/newsletter/subscriptionsuccessful?code=${newsletterParams[codeIndex]}${emailQuery}`)
  }

  if (!route.name && !route.fullPath.includes('/_nuxt/') && route.name !== 'cms' && route.path !== '/undefined') {
    return redirect('/404')
  }

  const { authorised, pending, received, additional } = store.getters['adyen/getPaymentStatus']
  const authResultList = [authorised, pending, received, additional]
  let authResult
  if (route.query) {
    authResult = route.query.authResult
  }
  if (route.name === 'thankyou' && authResult && !authResultList.includes(authResult.toLowerCase())) {
    const checkoutPage = '/checkout?step=2'
    return redirect(checkoutPage)
  }

  const redirectRoute = {
    from: route.name,
    to: config[route.name]
  }

  if (route.name === 'cms' && route.path === '/undefined') {
    return redirect('/')
  }

  if (redirectRoute.to) {
    return redirect({ name: redirectRoute.to })
  }
}
