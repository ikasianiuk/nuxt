<template>
  <div>
    <div v-show="isPageReady">
      <v-layout
        row
        wrap
        class="pos-relative"
      >
        <v-flex
          md7
          class="auction-description"
        >
          <div v-if="getIsDesktop">
            <image-slider
              :slides-amount="slidesAmount"
              :ean="auctionItemData.ean"
              :title="auctionItemData.title"
              slider-screen="desktop"
              @componentReady="isAppImageSliderReady = true"
            />
          </div>

          <product-additional-info
            :description="auctionItemData.description"
            :specifications="auctionItemData.specifications"
            :additional-properties="{ ean: auctionItemData.ean, sku: auctionItemData.sku, brand: auctionItemData.seller.title }"
          />

        </v-flex>
        <v-flex
          md4
          offset-md1
        >
          <auction-details
            :auction-item-data="auctionItemData"
            @componentReady="isAppImageSliderReady = true"
          />
        </v-flex>
      </v-layout>
    </div>
    <product-page-skeleton
      v-show="!isPageReady"
      key="product-page-skeleton"
    />
  </div>
</template>

<script>
import AuctionDetails from '@/components/auction/AuctionDetails'
import ProductPageSkeleton from '@/components/skeletonPlaceholders/ProductPageSkeleton'
import { mapState } from 'vuex'
import { wiseImport } from '@/common/async-components/async-import'
import ProductAdditionalInfo from '@/components/products/ProductAdditionalInfo'
import schemaGeneratorMixin from '@/common/mixins/schemaGenerator'

export default {
  name: 'AuctionPage',
  components: {
    ProductPageSkeleton,
    ...wiseImport('ImageSlider'),
    ...wiseImport('ReviewContainer'),
    AuctionDetails,
    ProductAdditionalInfo
  },
  mixins: [
    schemaGeneratorMixin(['webPage', 'auction', 'breadcrumbs'])
  ],
  data () {
    return {
      isAppImageSliderReady: false,
      productBreadcrumbs: []
    }
  },
  computed: {
    ...mapState('info', [
      'shopInfo'
    ]),
    ...mapState('auction', [
      'auctionItemData'
    ]),
    isPageReady () {
      return this.isAppImageSliderReady
    },
    pageBreadcrumbs () {
      const auctionBreadCrumbItem = {
        title: this.auctionItemData.title,
        plain: true
      }

      return [
        {
          title: this.localize('home.auctions'),
          route: { name: 'auction-list' }
        },
        auctionBreadCrumbItem
      ]
    }
  },
  async asyncData ({ store, route, error }) {
    try {
      const auctionId = route.params.id

      await store.dispatch('auction/fetchAuctionItem', auctionId)

      const auctionItem = store.state.auction.auctionItemData
      const auctionStructuredData = { ...auctionItem, id: auctionId, reviews: [] }

      store.commit('auction/setStructuredData', auctionStructuredData)

      return {
        slidesAmount: auctionItem.images_count,
        auctionItem
      }
    } catch (e) {
      error(e.$nuxtPayload || { statusCode: 500, errorMessage: 'InternalError' })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'media';

  .auction-description {
    @include mobile {
      order: 1;
    }
  }

  /deep/ .swiper-slide img {
    max-width: 70%;
  }

  /deep/ .v-select__selections {
    padding-left: 10px !important;
  }
</style>

