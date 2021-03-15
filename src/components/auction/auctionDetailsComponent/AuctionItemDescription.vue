<template>
  <div>
    <product-heading
      :title="auctionItemData.title"
      :seller-name="auctionItemData.seller.title"
      :brand="auctionItemData.brand"
      :rating="auctionItemData.rating_summary_value || 0"
    />
    <v-flex
      v-if="!getIsDesktop"
      class="pos-relative"
    >
      <client-only>
        <product-label
          v-if="auctionItemData.title"
          :img-src="auctionItemData.url_key"
          class="pos-absolute auction-item-description__label"
        />
      </client-only>
      <image-slider
        v-if="isComponentMounted"
        :slides-amount="slidesAmount"
        :ean="auctionItemData.ean"
        :title="auctionItemData.title"
        slider-screen="desktop"
        v-on="$listeners"
      />
    </v-flex>
    <div class="auction-item-description__timer mt-4 pa-3 grey-light text-xs-center">
      <div class="body-1">
        {{ localize('auction.remaining_time') }}
      </div>
      <template v-if="auctionEnabled">
        <div class="title mt-2 font-weight-bold">
          <timer :end-time="auctionItemData.end_time" />
        </div>
        <div class="body-1 mt-2">
          {{ localize('auction.auction_end') }}
        </div>
      </template>
      <div
        v-else
        class="auction-item-description__expired"
      >
        {{ localize('auction.expired') }}
      </div>
      <small>
        ({{ expiresDate }})
      </small>
    </div>
    <product-price
      class="mt-4"
      :price="auctionItemData.price"
      :special-price="auctionItemData.price"
      :eco-tax="auctionItemData.eco_tax"
      :product-type="auctionItemData.product_type"
    />
  </div>
</template>

<script>
import { wiseImport } from '@/common/async-components/async-import'
import Timer from '@/components/timer/Timer'
import { mapState } from 'vuex'
import ProductLabel from '@/components/products/ProductLabel'
import ProductHeading from '@/components/products/ProductHeading'
import ProductPrice from '@/components/products/ProductPrice'

export default {
  name: 'AuctionItemDescription',
  components: {
    ...wiseImport('ImageSlider'),
    Timer,
    ProductLabel,
    ProductHeading,
    ProductPrice
  },
  props: {
    auctionEnabled: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState('auction', [
      'auctionItemData'
    ]),
    slidesAmount () {
      return this.auctionItemData.images_count
    },
    currentBidLabel () {
      const label = this.auctionEnabled ? 'auction.current_bid' : 'auction.highest_bid'

      return this.localize(label, { count: this.auctionItemData.bids_number })
    },
    expiresDate () {
      const date = new Date(this.auctionItemData.end_time)

      return `${this.localizeDate(date)}, ${this.localize('auction.at')} ${this.localizeDate(date, 'time')}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .auction-item-description {
    &__timer {
      border-radius: 4px;
    }

    /deep/ &__label {
      top: -28px;
      right: 0;
    }

    &__expired {
      font-size: 32px;
      letter-spacing: 1.28px;
    }
  }
</style>
