<template>
  <div class="mt-3">
    <v-tabs
      v-model="active"
      grow
    >
      <v-tabs-slider color="primary" />
      <!--Seller products-->
      <v-tab
        key="products"
        class="bold body-2"
        href="#products"
      >
        {{ localize('seller.products') }}
      </v-tab>
      <v-tab-item
        id="products"
        class="py-3 px-1"
      >
        <seller-page-skeleton v-if="productsLoadingStatus" />
        <template v-if="sellerProducts.length">
          <product-sorting
            class="ml-auto"
            emit-sorting-event
            @sorting-changed="onSortingChanged"
          />
          <product-list
            :products="sellerProducts"
            :products-per-page="productsPerPage"
            :loading-status="isButtonClicked"
            :pagination="pagination"
            type="seller-product"
          />
        </template>
        <div v-else>{{ localize("seller.no_products") }}</div>
      </v-tab-item>

      <!--Seller terms & conditions-->
      <template v-if="sellerInfo.terms_and_conditions_link">
        <v-tab
          key="terms_and_conditions"
          class="bold body-2"
          href="#terms_and_conditions"
        >
          {{ localize('seller.terms_and_conditions') }}
        </v-tab>
        <v-tab-item
          id="terms_and_conditions"
          class="pt-3"
        >
          <a
            class="vidaxl-link-2"
            :href="sellerInfo.terms_and_conditions_link"
            :title="documentTitle"
          >
            {{ documentTitle }}
          </a>
        </v-tab-item>
      </template>

      <!--Seller return policy-->
      <template v-if="sellerInfo.return_policy">
        <v-tab
          key="return_policy"
          class="bold body-2"
          href="#return_policy"
        >
          {{ localize('seller.returns') }}
        </v-tab>
        <v-tab-item
          id="return_policy"
          class="pt-3"
        >
          <div
            class="body-1"
            v-text="sellerInfo.return_policy"
          ></div>
        </v-tab-item>
      </template>
    </v-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { VTabs, VTabItem, VTab, VTabsSlider } from 'vuetify/es5/components/VTabs'
import ProductList from '@/components/products/productList/ProductList'
import ProductSorting from '@/components/products/ProductSorting'
import SellerPageSkeleton from '@/components/skeletonPlaceholders/SellerPageSkeleton'
import { ListenToMoreProductsMixin } from '@/common/mixins/listenToMoreProducts'

export default {
  name: 'SellerTabs',
  components: {
    ProductSorting,
    ProductList,
    SellerPageSkeleton,
    VTabItem, VTab, VTabs, VTabsSlider
  },
  mixins: [
    ListenToMoreProductsMixin
  ],
  data () {
    return {
      active: null,
      isButtonClicked: false,
      isSellerPopupShown: false
    }
  },
  computed: {
    ...mapState('seller', [
      'sellerInfo',
      'sellerProducts',
      'productsPerPage',
      'productsLoadingStatus',
      'pagination'
    ]),
    documentTitle () {
      return this.sellerInfo.terms_and_conditions_link.split('/').pop()
    },
    productSortingValue () {
      const { order_by = '' } = this.$route.query

      return order_by
    }
  },
  mounted () {
    const { tab } = this.$route.query

    tab && (this.active = tab)
  },
  methods: {
    ...mapActions('seller', ['fetchSellerProducts']),
    async onGetMoreProducts () {
      this.isButtonClicked = true

      await this.fetchSellerProducts({
        sellerId: this.sellerInfo.id,
        query: this.route.query
      })

      this.isButtonClicked = false

      window && window.scrollTo(0, 0)
    },

    onSortingChanged (order_by) {
      const { path } = this.route
      const query = {
        order_by
      }

      this.$router.push({ path, query })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "colors";
  @import "media";

  /deep/ .v-tabs__item {
    text-transform: none;

    &--active {
      color: $purple;
    }
  }

  /* custom styling for applying list view for tabs on mobile */

  @include mobile {
    /deep/ .v-tabs__div {
      display: block;

      .v-tabs__item {
        display: block;
        padding-left: 0;
        text-align: left;
      }
    }

    /deep/ .v-tabs__slider-wrapper {
      display: none;
    }

    /deep/ .v-tabs__container {
      display: block;
      height: initial;
    }
  }
</style>
