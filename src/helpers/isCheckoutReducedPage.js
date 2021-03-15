export const isCheckoutReducedPage = (route, hasGoodsInBasket = true) => {
  const PAGES = ['cart', 'checkout']
  const isCheckoutReducedPage = PAGES.includes(route.name) && hasGoodsInBasket
  const isLoginFunnel = route.name === 'login' && route.query.redirect === 'checkout' && hasGoodsInBasket
  if (isLoginFunnel) return true

  return isCheckoutReducedPage
}
