<template>
  <form
    class="mt-2"
    @submit.prevent="addUserBid"
  >
    <v-text-field
      ref="userBid"
      :value="userBid"
      type="number"
      :rules="[rules.min]"
      step="any"
      class="auction-bid__input"
      @change="setUserBid"
    >
         <span slot="label">
           {{ localize('auction.place_bid') }}
           <small>
             {{ placeHolderMinValue }}
           </small>
         </span>
    </v-text-field>
    <v-layout
      row
      wrap
    >
      <v-btn
        block
        type="submit"
        class="primary elevation-2 mt-3 action-bid__btn"
        :disabled="disabled"
      >
        {{ localize('auction.confirm') }}
      </v-btn>
    </v-layout>
    <div class="italic--text mt-2">
      {{ localize('auction.hint') }}
    </div>
  </form>
</template>

<script>
import VBtn from 'vuetify/es5/components/VBtn/VBtn'
import VTextField from 'vuetify/es5/components/VTextField'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AuctionBidForm',
  components: {
    VBtn, VTextField
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rules: {
        min: (value) => {
          return value && value < this.auctionItemData.next_price
            ? this.bidAmountError
            : true
        }
      }
    }
  },
  computed: {
    ...mapState('auction', [
      'auctionItemData',
      'userBid'
    ]),
    bidAmountError () {
      const { price_interval } = this.auctionItemData

      return this.localize('auction.incorrect_value', { price_interval })
    },
    placeHolderMinValue () {
      return `(${this.localize('auction.min')} ${this.localize(this.auctionItemData.next_price, 'currency')})`
    }
  },
  beforeDestroy () {
    this.setUserBid('')
  },
  methods: {
    ...mapMutations('auction', ['setUserBid']),
    async addUserBid () {
      if (this.disabled) return
      if (this.userBid < this.auctionItemData.next_price) {
        this.$nuxt.$emit('notify', this.bidAmountError, 'error')
        return
      }

      this.$emit('submit')
    }
  }
}
</script>
