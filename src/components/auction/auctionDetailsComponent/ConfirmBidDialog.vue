<template>
  <v-card class="pa-4">
    <div class="text-align-right">
      <v-btn
        flat
        icon
        small
        pointer
        class="ma-0 pointer"
        @click="$emit('close')"
      >
        <i
          aria-hidden="true"
          class="icon material-icons vidaxl--text left pointer"
        >
          close
        </i>
      </v-btn>
    </div>
    <div class="text-xs-center font-weight-bold subheading mb-2">
      {{ localize('auction.confirm_bid') }}
    </div>
    <div class="mt-3">
      {{ localize('auction.confirm_bid_label') }}
    </div>
    <div class="my-3 bold">
      {{ localize(userBid, 'currency') }}
    </div>
    <p>
      {{ localize('auction.confirm_bid_description', { price_interval: priceInterval }) }}
    </p>
    <nuxt-link
      :to="{ name: 'landing_cms_id', params: { landing_cms_id: 'auction-help' }}"
      class="text-xs-center mt-3 mb-4 display-block"
    >
      {{ localize('auction.more_information') }}
    </nuxt-link>
    <v-btn
      class="choose-nickname__btn"
      color="primary full-width ma-0"
      @click="$emit('submit')"
    >
      {{ localize('auction.confirm') }}
    </v-btn>
  </v-card>
</template>

<script>
import VCard from 'vuetify/es5/components/VCard/VCard'
import VBtn from 'vuetify/es5/components/VBtn/VBtn'
import { mapState } from 'vuex'

export default {
  name: 'ConfirmBidDialog',
  components: {
    VBtn, VCard
  },
  computed: {
    ...mapState('auction', [
      'userBid'
    ]),
    ...mapState('auction', {
      priceInterval: state => state.auctionItemData.price_interval
    })
  }
}
</script>
