<template>
  <div>
    <v-expansion-panel
      v-if="auctionItemData.bids_number"
      class="bid-history my-2"
    >
      <v-expansion-panel-content v-model="isBidHistoryPresent">
        <div
          slot="header"
          class="mr-1"
        >
          {{ `${localize('auction.bid_history')} (${localize('auction.bid_number', { bid_number: auctionItemData.bids_number })})` }}
        </div>
        <div
          v-for="bid in bidsHistory"
          :key="`${bid.bidder_name}-${bid.created_time}`"
          class="bid-history__item"
        >
          <div class="bid-history__date">{{ getLocalizedDate(bid.timestamp) }}</div>
          <span class="mr-2">{{ bid.bidder_name }}</span>
          <span>{{ localize(bid.price, 'currency') }}</span>
        </div>
        <div
          v-if="isShowMoreBtnVisible"
          class="text-align-right mt-2"
        >
          <v-btn
            flat
            small
            class="vidaxl--text vidaxl-link-2 no-hover-background pointer"
            :ripple="false"
            @click="isAllBidsShown = !isAllBidsShown"
          >
            {{ isAllBidsShown ? `${localize('product.see_less')} -` : `${localize('product.see_more')} +` }}
          </v-btn>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VBtn from 'vuetify/es5/components/VBtn/VBtn'
import { VExpansionPanel, VExpansionPanelContent } from 'vuetify/es5/components/VExpansionPanel'

export default {
  name: 'AuctionBidHistory',
  components: {
    VBtn,
    VExpansionPanel,
    VExpansionPanelContent
  },
  data () {
    return {
      isBidHistoryPresent: false,
      isAllBidsShown: false
    }
  },
  computed: {
    ...mapState('auction', [
      'auctionItemData'
    ]),
    isShowMoreBtnVisible () {
      return this.auctionItemData.bids && this.auctionItemData.bids.length > 3
    },
    bidsHistory () {
      const { bids = [] } = this.auctionItemData

      return this.isAllBidsShown ? bids : bids.slice(0, 3)
    }
  },
  watch: {
    isBidHistoryPresent: async function (isPresent) {
      isPresent && await this.updateAuctionItem(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions('auction', ['updateAuctionItem']),
    getLocalizedDate (timeInMs) {
      const date = new Date(+timeInMs)
      return `${this.localizeDate(date)}, ${this.localizeDate(date, 'time')}`
    }
  }
}
</script>


<style lang="scss" scoped>
  @import 'colors';
  @import 'media';

  .v-expansion-panel {
    &__container {
      border: 1px solid $black !important;
      border-radius: 3px;
    }

    /deep/ &__header {
      align-items: center;
      justify-content: center;
      min-height: 36px;
      padding: 6px;

      & > *:not(.v-expansion-panel__header__icon) {
        flex: initial;
      }

      .v-icon {
        font-size: 22px;
        color: $black !important;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    /deep/ .v-expansion-panel__body {
      max-height: 450px;
      overflow: auto;
    }
  }

  .bid-history {
    position: relative;
    max-height: 500px;

    &__date {
      font-size: 10px;
    }

    &__item {
      padding: 10px 0;
      margin: 0 10px;
      border-bottom: 1px solid $grey-light;
    }
  }
</style>
