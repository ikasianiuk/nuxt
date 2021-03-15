<template>
  <div class="mx-2-sm-and-down">
    <seller-info />
    <seller-tabs v-if="isComponentMounted" />
  </div>
</template>

<script>
import SellerInfo from '@/components/seller/SellerInfo'
import { mapState, mapActions, mapMutations } from 'vuex'
import { wiseImport } from '@/common/async-components/async-import'
import schemaGeneratorMixin from '@/common/mixins/schemaGenerator'

export default {
  name: 'SellerPage',
  components: {
    SellerInfo,
    ...wiseImport('SellerTabs')
  },
  mixins: [
    schemaGeneratorMixin(['webPage', 'breadcrumbs'])
  ],
  computed: {
    ...mapState('seller', ['sellerInfo']),
    // computed for breadcrumbs mixin
    pageBreadcrumbs () {
      return [
        {
          title: this.sellerInfo.title,
          route: {
            name: 'seller-id-name',
            params: {
              name: this.sellerInfo.title,
              id: this.sellerInfo.id
            }
          }
        }
      ]
    }
  },
  watch: {
    route: function () {
      this.resetSellerProducts()
      this.fetchSellerProducts({ sellerId: this.sellerInfo.id, query: this.route.query })
    }
  },
  async asyncData ({ app, params: { id }, store, error, query }) {
    try {
      store.commit('seller/resetSellerProducts')

      await Promise.all([
        store.dispatch('seller/fetchSeller', id),
        store.dispatch('seller/fetchSellerProducts', { sellerId: id, query })
      ])
    } catch (e) {
      error(e.$nuxtPayload || { statusCode: 500, errorMessage: 'InternalError' })
    }
  },
  methods: {
    ...mapActions('seller', ['fetchSellerProducts']),
    ...mapMutations('seller', ['resetSellerProducts'])
  }
}
</script>

<style scoped>
</style>
