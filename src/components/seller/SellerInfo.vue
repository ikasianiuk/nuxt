<template>
  <div class="seller-meta">
    <h1 class="title vidaxl--text mb-2">{{ sellerInfo.title }}</h1>
    <div class="bold body-2">{{ joinedSince }}</div>
    <toggle-more
      class="mt-3 flex xs12 md6"
      max-height="60"
      :text="sellerInfo.description"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ToggleMore from '@/components/toggleMore/ToggleMore'

export default {
  name: 'SellerInfo',
  components: {
    ToggleMore
  },
  computed: {
    ...mapState('seller', ['sellerInfo']),
    joinedSince () {
      return `${this.localize('seller.joined_since')}: ${this.sellerInfo.joined_since.split('T')[0].replace(/-/g, ' ')}`
    }
  }
}
</script>
