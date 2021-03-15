import auctionService from '@/common/services/auction.service'

export const state = () => ({
  auctionItemData: {},
  auctionProductList: [],
  auctionItemWinner: {},
  allBidsForAuctionItem: {},
  isAuctionItemWatched: '',
  userBid: '',
  structuredDataState: {},
  auctionsLoadingStatus: false,
  pagination: {}
})

export const getters = {
  getAuctionsInStock: (state) => {
    return state.auctionProductList.filter(auction => auction.in_stock)
  }
}

export const mutations = {
  setAuctionItem (state, data) {
    state.auctionItemData = data
  },
  setAuctionItemWinner (state, data) {
    state.auctionItemWinner = data
  },
  setUserBid (state, data) {
    state.userBid = data
  },
  setAuctionProductList (state, data) {
    state.auctionProductList = data
  },
  setIsAuctionItemWatched (state, data) {
    state.isAuctionItemWatched = data
  },
  updateBid (state, { bids_number, next_price, price, bids }) {
    state.auctionItemData.bids_number = bids_number
    state.auctionItemData.next_price = next_price
    state.auctionItemData.price = price
    state.auctionItemData.bids = bids
  },
  setStructuredData (state, data) {
    state.structuredDataState = data
  },
  setAuctionsLoadingStatus (state, status) {
    state.auctionsLoadingStatus = status
  },
  setPaginationMeta (state, paginationMeta) {
    state.pagination = paginationMeta
  }
}

export const actions = {
  async fetchAuctionProductsList ({ dispatch, commit, rootState }, { page, limit }) {
    if (rootState.products.productsLoadingStatus) return

    commit('setAuctionsLoadingStatus', true)

    try {
      const { data } = await auctionService.getAuctionProductsList({ page, limit }, this.$getAPIvariables())

      commit('setAuctionProductList', data.records)
      commit('setPaginationMeta', data.metadata)
    } catch (error) {
      commit('setAuctionProductList', [])
    } finally {
      commit('setAuctionsLoadingStatus', false)
    }
  },
  async fetchAuctionItemWinner ({ commit }, content) {
    try {
      const { data } = await auctionService.getAuctionItemWinner(content, this.$getAPIvariables())

      commit('setAuctionItemWinner', data)
    } catch (error) {
      throw error
    }
  },
  async fetchAuctionItem ({ commit }, id) {
    try {
      const { data } = await auctionService.getAuctionItemById(id, this.$getAPIvariables())

      commit('setAuctionItem', data)
    } catch (error) {
      throw error
    }
  },
  async updateAuctionItem ({ commit }, id) {
    try {
      const { data } = await auctionService.refreshAuctionItemById(id, this.$getAPIvariables())

      commit('updateBid', data)

      return data
    } catch (error) {
      throw error
    }
  },
  async placeAuctionBid ({ commit }, content) {
    try {
      const { data } = await auctionService.placeAuctionBid(content, this.$getAPIvariables())

      return data
    } catch (error) {
      throw error
    }
  },
  async fetchIsAuctionItemWatched ({ commit }, content) {
    try {
      const { data } = await auctionService.isAuctionItemWatched(content, this.$getAPIvariables())

      commit('setIsAuctionItemWatched', data.success)
    } catch (error) {
      throw error
    }
  },
  async toggleIsAuctionItemWatched ({ commit }, auctionId) {
    try {
      const { data } = await auctionService.toggleIsAuctionItemWatched(auctionId, this.$getAPIvariables())

      commit('setIsAuctionItemWatched', data.success)
    } catch (error) {
      throw error
    }
  }
}
