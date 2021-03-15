<template>
  <v-layout class="product-list wrap">
    <product-list-item
      v-for="(categoryProduct, idx) in products"
      :id="categoryProduct.ean"
      :key="`${categoryProduct.ean}-${categoryProduct.shoppingId}-${idx}`"
      :product="categoryProduct"
      :type="type"
      class="product-list-item flex xs6 sm4 md4 lg3 xl3"
      :class="'product-' + categoryProduct.ean"
      :route-link-to="routeLink(categoryProduct)"
      :force-lazyload-for-ssr="idx < initialNumberOfImagesToLoad.ssr"
      :force-lazyload-for-browser="idx < initialNumberOfImagesToLoad.browser"
      @hook:mounted="onListItemReady(categoryProduct)"
    />
    <v-flex class="xs12 text-xs-center">
      <template v-if="isPaginationVisible">
        <div
          v-show="!loadingStatus"
          class="mt-3 mb-2"
          v-html="paginationTitle"
        >
        </div>
        <v-pagination
          v-show="!loadingStatus"
          class="product-list__pagination"
          :value="selectedPage"
          :length="totalNumberOfPages"
          :total-visible="numberOfVisiblePages"
          prev-icon="keyboard_arrow_left"
          next-icon="keyboard_arrow_right"
          @input="updatePagination"
        />
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
import VPagination from 'vuetify/es5/components/VPagination/VPagination'
import ProductListItem from './ProductListItem'
import { addImpression, didImpressionFire, markProductAsImpressed } from '@/common/structured-data/actions/impression'
import { mapGetters } from 'vuex'

const productsPerPageDefault = 48

export default {
  name: 'ProductList',
  components: { ProductListItem, VPagination },
  props: {
    loadingStatus: Boolean,
    products: {
      type: Array,
      required: true
    },
    pagination: {
      type: Object
    },
    productsPerPage: {
      type: Number,
      default: productsPerPageDefault
    },
    initialNumberOfImagesToLoad: {
      type: Object,
      default () {
        return { browser: 0, ssr: 0 }
      }
    },
    type: String
  },
  computed: {
    ...mapGetters('abtests', ['getIsATConPLP']),
    doesShowMoreBtnExist () {
      return this.visibilityLoadButton
    },
    observer () {
      return process.browser ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const { ean, id, url_key } = entry.target.__product__
          if (entry.isIntersecting && !didImpressionFire(ean)) {
            this.$pushArtefactAction(addImpression({ ean, id, url_key, host: this.host, routes: this.routes, isAuction: this.isAuction }))
            markProductAsImpressed(ean)
            this.observer.unobserve && this.observer.unobserve(entry.target) // after single impression no need to check it more and waste CPU
          }
        })
      }) : null
    },
    isAuction () {
      return this.route.name === 'auction-list'
    },
    isPaginationVisible () {
      return this.pagination && this.pagination.page_count > 1
    },
    numberOfVisiblePages () {
      let max = this.getIsMobile ? 5 : 9
      return Math.min(max, this.totalNumberOfPages)
    },
    totalNumberOfPages () {
      return this.pagination && this.pagination.page_count
    },
    selectedPage () {
      return this.pagination && this.pagination.page_token
    },
    paginationTitle () {
      if (!this.pagination) return ''

      const rangeStart = this.pagination.page_size * (this.pagination.page_token - 1)
      const rangeEnd = rangeStart + this.products.length

      return this.localize('product.pagination_title', {
        total: this.pagination.total_size,
        current: `${rangeStart + 1}-${rangeEnd}`
      })
    },
    isAtcAvailable () {
      return this.getIsATConPLP && !this.isAuction
    }
  },
  methods: {
    onListItemReady (product) {
      let target = document.getElementById(`${product.ean}`)

      if (target) {
        target.__product__ = product

        this.observer && this.observer.observe(target)
      }
    },
    routeLink ({ id, ean, url_key: name }) {
      const productCardLink = this.isAuction ? 'auction-id-name' : 'product-ean-name'

      return { name: productCardLink, params: { id, ean, name } }
    },
    updatePagination (newPage) {
      const { name: routeName, query: routeQuery } = this.$route

      const query = { ...routeQuery, page_token: newPage }

      if (newPage === 1) {
        delete query.page_token
      }

      this.$router.push({ routeName, query }, () => {
        this.$nuxt.$emit('get-more-products')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'colors';

  .product-list__pagination {
    /deep/ button {
      box-shadow: none;
    }

    /deep/ .v-pagination__navigation i {
      cursor: pointer;
    }

    /deep/ .v-pagination__item {
      background: $grey-light-2;
    }
  }
</style>
