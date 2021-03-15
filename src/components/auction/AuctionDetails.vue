<template>
  <v-card class="auction-item-content elevation-5">
    <div class="pa-2 vidaxl yellow text-xs-center font-weight-bold title">
      {{ localize('auction.title') }}
    </div>
    <div class="pa-3">
      <auction-item-description
        :auction-enabled="isAuctionEnabled"
        @componentReady="$emit('componentReady')"
      />

      <auction-bid-form
        v-if="isAuctionEnabled"
        :disabled="isBidButtonDisabled"
        @submit="isBidConfirmDialogOpen = true"
      />

      <template v-else>
        <div class="subheading mt-3 mb-4">{{ localize('auction.offer_anyway') }}</div>
        <v-btn
          :to="{ name: 'product-ean-name', params: { ean: auctionItemData.ean }}"
          class="primary elevation-2 mt-3 text-none"
          block
        >
          {{ localize('auction.go_to_product_page') }}
        </v-btn>
      </template>

      <product-details :product-data="auctionItemData" />

      <auction-bid-history />
    </div>

    <v-dialog
      v-model="isBidConfirmDialogOpen"
      max-width="370"
    >
      <confirm-bid-dialog
        class="confirm-bid__dialog"
        @close="isBidConfirmDialogOpen = false"
        @submit="confirmBid"
      />
    </v-dialog>

    <v-dialog
      v-model="isNickNameDialogOpen"
      max-width="370"
    >
      <nickname-dialog
        class="nickname-bid__dialog"
        @close="isNickNameDialogOpen = false"
        @submit="addCustomerNickName"
      />
    </v-dialog>

  </v-card>
</template>

<script>
import VCard from 'vuetify/es5/components/VCard/VCard'
import VDialog from 'vuetify/es5/components/VDialog/VDialog'
import VBtn from 'vuetify/es5/components/VBtn/VBtn'
import { mapActions, mapState, mapMutations } from 'vuex'
import ConfirmBidDialog from '@/components/auction/auctionDetailsComponent/ConfirmBidDialog'
import AuctionItemDescription from '@/components/auction/auctionDetailsComponent/AuctionItemDescription'
import NicknameDialog from '@/components/auction/auctionDetailsComponent/NicknameDialog'
import AuctionBidForm from '@/components/auction/auctionDetailsComponent/AuctionBidForm'
import ProductDetails from '@/components/products/ProductDetails'
import AuctionBidHistory from '@/components/auction/auctionDetailsComponent/AuctionBidHistory'
import { generateAuctionBidAction } from '../../common/structured-data/auction-bid'

const messageRegExp = /(?:\\{7}"message\\{7}":\\{7}")(.*?)(?:\\{7}")/

export default {
  name: 'AuctionBidContent',
  components: {
    VDialog, VCard, VBtn,
    AuctionItemDescription,
    ProductDetails,
    ConfirmBidDialog,
    NicknameDialog,
    AuctionBidForm,
    AuctionBidHistory
  },
  data () {
    return {
      isNickNameDialogOpen: false,
      isBidConfirmDialogOpen: false,
      isBidButtonDisabled: false
    }
  },
  computed: {
    ...mapState('auction', [
      'auctionItemData',
      'userBid'
    ]),
    ...mapState('customer', [
      'customer'
    ]),
    diffBetweenUserBidAndServerPrice () {
      const diff = this.auctionItemData.price - this.userBid

      return diff <= 0
        ? this.localize('auction.overbid')
        : this.localize('auction.overbid_by', {
          bid_amount: this.localize(this.auctionItemData.price - this.userBid, 'currency')
        })
    },
    errorTypes () {
      return {
        'need-higher-bid': this.diffBetweenUserBidAndServerPrice,
        'nickname-missing': this.localize('auction.nickname_missing'),
        'user-already-highest-bidder': this.localize('auction.user_already_highest_bidder'),
        'need-login': this.localize('auction.need_login'),
        'same-sku-already-won': this.localize('auction.same_sku_already_won')
      }
    },
    isAuctionEnabled () {
      return this.auctionItemData.end_time > new Date()
    }
  },
  methods: {
    ...mapActions('auction', ['placeAuctionBid', 'updateAuctionItem']),
    ...mapActions('customer', ['addNickname']),
    ...mapMutations('auction', ['setUserBid', 'updateBid']),
    async refreshAuctionItem () {
      return await this.updateAuctionItem(this.$route.params.id)
    },
    confirmBid () {
      this.checkIfUserLogin()
      this.isBidConfirmDialogOpen = false
    },
    checkIfUserLogin () {
      this.loggedIn
        ? this.checkIfUserHasNickname()
        : this.$router.push({ name: 'login' })
    },
    checkIfUserHasNickname () {
      this.customer.bidder_name
        ? this.submitAuctionBid()
        : this.openNickNamePopup()
    },
    openNickNamePopup () {
      this.isNickNameDialogOpen = true
    },
    async addCustomerNickName (nickName) {
      try {
        await this.addNickname(nickName)
        await this.submitAuctionBid()
        this.isNickNameDialogOpen = false
      } catch (error) {
        const { message } = error.response.data
        const regExpMatchedData = message.match(messageRegExp)
        const parsedErrorMessage = regExpMatchedData && regExpMatchedData[1]
        const errorMessage = message.includes(409) && parsedErrorMessage ? parsedErrorMessage : this.localize('error.500_general')

        this.$nuxt.$emit('notify', errorMessage, 'error')
      }
    },
    getUserErrorMessageByErrorType (errorType) {
      return this.errorTypes[errorType]
    },
    async submitAuctionBid () {
      this.isNickNameDialogOpen = false

      try {
        const bidData = {
          id: this.$route.params.id,
          bid_amount: this.userBid,
          bid_customer_id: this.customer.id
        }

        const data = await this.placeAuctionBid(bidData)

        if (!data.success) {
          await this.refreshAuctionItem()
          return this.$nuxt.$emit('notify', this.getUserErrorMessageByErrorType(data.message), 'error')
        }

        if (data.message === 'user-already-highest-bidder') {
          this.setUserBid('')
          return this.$nuxt.$emit('notify', this.getUserErrorMessageByErrorType(data.message), 'warning')
        }

        const currentBidsNumber = this.auctionItemData.bids_number

        const { bidder_name } = await this.refreshAuctionItem()

        const { bids_number, next_price, price, bids } = this.auctionItemData

        this.updateBid({
          bids_number,
          next_price,
          price,
          bids
        })

        // bidder_name is name of current highest bidder
        const isOverbidden = bids_number - currentBidsNumber > 1 && bidder_name !== this.customer.bidder_name
        isOverbidden
          ? this.$nuxt.$emit('notify', this.diffBetweenUserBidAndServerPrice, 'warning')
          : this.$nuxt.$emit('notify', this.localize('auction.confirm'), 'success')

        this.sendAuctionBidAction()

        this.setUserBid('')
      } catch (error) {
        if (error.code === 500) this.$nuxt.$emit('notify', this.localize('error.500_general'), 'error')
        if (error.code === 404) this.$nuxt.$emit('notify', this.localize('error.auction_not_found'), 'error')
      }
    },
    sendAuctionBidAction () {
      const { id, url_key, ean, sku, title, end_time } = this.auctionItemData
      const bidActionData = generateAuctionBidAction({
        id,
        url_key,
        ean,
        sku,
        title,
        currency: this.currency,
        routes: this.routes,
        host: this.host,
        price: this.userBid,
        end_time
      })

      this.$pushArtefactAction(bidActionData)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'media';

  /deep/ .v-messages__message {
    line-height: 1.2;
  }

  .auction-item-content {
    @include mobile {
      box-shadow: none !important;
    }
  }
</style>
