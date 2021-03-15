export const ListenToMoreProductsMixin = {
  mounted () {
    this.$nuxt.$on('get-more-products', this.onGetMoreProducts)
  },
  beforeDestroy () {
    this.$nuxt.$off('get-more-products')
  }
}
