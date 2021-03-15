import { SellerService } from '../common/services/seller.service'
import productService from '../common/services/product.service'

export const state = () => ({
  sellerInfo: {},
  sellerProducts: [],
  productsPerPage: 20,
  productsLoadingStatus: false,
  pagination: {}
})

export const getters = {
  getSellerTitle ({ sellerInfo }) {
    const { title = '' } = sellerInfo

    return title
  },
  getSellerPageHead (state, getters, rootState) {
    const title = getters.getSellerTitle
    const { default_meta_title = '', default_meta_description = '' } = rootState.info.shopInfo

    const meta_title = default_meta_title ? default_meta_title.replace(/%key_phrase%/gi, title) : title
    const meta_description = default_meta_description && default_meta_description.replace(/%key_phrase%/gi, title)

    return {
      title: meta_title,
      meta: [
        { hid: 'description', name: 'description', content: meta_description },
        { hid: 'og:description', property: 'og:description', content: meta_description },
        { hid: 'og:title', property: 'og:title', content: meta_title },
        { hid: 'keywords', name: 'keywords', content: meta_title },
        { hid: 'fb_title', property: 'og:title', content: meta_title },
        { hid: 'fb_type', property: 'og:type', content: 'seller' }
      ]
    }
  }
}

export const mutations = {
  setSellerInfo (state, seller) {
    state.sellerInfo = seller
  },
  setSellerProducts (state, products) {
    state.sellerProducts = products
  },
  resetSellerProducts (state) {
    state.sellerProducts = []
    state.visibilityLoadButton = true
  },
  setProductsLoadingStatus (state, status) {
    state.productsLoadingStatus = status
  },
  setPaginationMeta (state, paginationMeta) {
    state.pagination = paginationMeta
  }
}

export const actions = {
  async fetchSeller ({ commit }, sellerId) {
    try {
      let { data } = await SellerService.getSeller(sellerId, this.$getAPIvariables())

      commit('setSellerInfo', data)
    } catch (err) {
      throw err
    }
  },
  async fetchSellerProducts ({ state, commit }, { sellerId, query = {}, pageNumber, options = {} }) {
    const page_size = state.productsPerPage
    const page_token = pageNumber || query.page_token || 1

    const updatedQuery = Object.assign({}, query)
    delete updatedQuery.page_token

    const requestData = { query: updatedQuery, seller_id: sellerId, page_size, page_token }

    commit('setProductsLoadingStatus', true)

    try {
      const { data } = await productService.getProductList(requestData, this.$getAPIvariables())

      commit('setSellerProducts', data.product_list_items)
      commit('setPaginationMeta', data.metadata)
    } catch (err) {
      commit('setSellerProducts', [])
    } finally {
      commit('setProductsLoadingStatus', false)
    }
  }
}
