import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'vidaxlStorage',
    paths: [
      'customer', 'cart', 'adyen.paymentData',
      'checkout.parcelShopAddressList', 'checkout.parcelShopAddressLimit',
      'checkout.isUseAlternativeBillingAddress'
    ]
  })(store)
}
