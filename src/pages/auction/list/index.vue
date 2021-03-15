<template>
  <section>
    <category-page-skeleton v-show="!isPageReady" />

    <div
      v-show="isPageReady"
      class="auction-page px-1-sm-and-down mb-3"
    >
      <v-layout class="row wrap">
        <v-flex class="pr-5-md-and-up xs12 md3">
          <span class="auction-page_title body-1 subheading-2">
            {{ localize('home.auctions') }}
          </span>
        </v-flex>
        <v-flex class="xs12 md9">
          <a
            :href="getBannerLink"
            target="_blank"
          >
            <img
              v-if="getAuctionBanner"
              class="banner-auction"
              :src="getFullMediaImgUrl(getAuctionBanner.src)"
            >
          </a>
          <product-list
            :products="getAuctionsInStock"
            :loading-status="productsLoadingStatus"
            :pagination="pagination"
            :products-per-page="productsPerPage"
          />
        </v-flex>
      </v-layout>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { ListenToMoreProductsMixin } from '@/common/mixins/listenToMoreProducts'
import schemaGeneratorMixin from '@/common/mixins/schemaGenerator'
import CategoryPageSkeleton from '@/components/skeletonPlaceholders/CategoryPageSkeleton'
import ProductList from '@/components/products/productList/ProductList'
import auctionBannerLinkList from '@/common/mock-data/auction-banner-links-list'

export default {
  name: 'AuctionListPage',
  components: {
    CategoryPageSkeleton,
    ProductList
  },
  mixins: [
    ListenToMoreProductsMixin,
    schemaGeneratorMixin(['webPage', 'productList', 'breadcrumbs'])
  ],
  data () {
    return {
      page: 1,
      isUpdating: false
    }
  },
  computed: {
    ...mapState('auction', ['auctionProductList', 'pagination']),
    ...mapGetters('auction', ['getAuctionsInStock']),
    ...mapState('products', ['productsLoadingStatus', 'productsPerPage']),
    ...mapGetters('info', ['getAuctionBanner']),
    ...mapGetters(['getLocale']),
    pageBreadcrumbs () {
      return [
        {
          title: this.localize('home.auctions'),
          plain: true
        }
      ]
    },
    getBannerLink () {
      return auctionBannerLinkList[this.getLocale]
    },
    isPageReady () {
      if (this.isFirstTimeLoaded) return true

      return this.isUpdating || !this.productsLoadingStatus
    }
  },
  async asyncData ({ store }) {
    try {
      const payload = { page: 1, limit: store.state.products.productsPerPage }

      await store.dispatch('auction/fetchAuctionProductsList', payload)
      store.commit('category/setStructuredData', {
        products: store.getters['auction/getAuctionsInStock'],
        isAuctionList: true
      })
      return {
        isFirstTimeLoaded: process.server
      }
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    ...mapActions('auction', ['fetchAuctionProductsList']),
    async onGetMoreProducts () {
      this.isUpdating = true
      try {
        await this.fetchAuctionProductsList({
          page: this.route.query.page_token || 1,
          limit: this.productsPerPage
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.isUpdating = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner-auction {
    width: 100%;
    object-fit: contain;
  }
</style>
