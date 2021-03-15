<template>
  <div class="offer mb-4 mt-5-md-and-up">
    <product-preview :product="product" />
    <h2 class="title bold mt-5-md-and-up mt-3-md-and-down">{{ localize('offer.sellers_title') }}</h2>
    <p class="offer__description mt-1">{{ localize('offer.sellers_text') }}</p>
    <div>
      <offer-item
        v-for="seller in sellersList"
        :key="seller.shop_id"
        :seller="seller"
        :product="product"
        class="mb-3"
      />
    </div>
  </div>
</template>

<script>
import productService from '@/common/services/product.service'
import OfferItem from '@/components/offer/OfferItem'
import ProductPreview from '@/components/products/productPreview/ProductPreview'
import schemaGeneratorMixin from '@/common/mixins/schemaGenerator'

export default {
  name: 'OffersPage',
  components: {
    OfferItem,
    ProductPreview
  },
  mixins: [
    schemaGeneratorMixin(['webPage', 'breadcrumbs'])
  ],
  computed: {
    pageBreadcrumbs () {
      // computed for breadcrumbs mixin
      return [
        {
          title: this.product.title,
          route: {
            name: 'product-ean-name',
            params: {
              ean: this.product.ean,
              name: this.product.url_key
            }
          }
        },
        {
          plain: true,
          title: this.localize('offer.offer_bread_crumb')
        }
      ]
    }
  },
  async asyncData ({ app, store, params, error }) {
    try {
      const { data } = await productService.getProductOffersByEAN(params.ean, app.$getAPIvariables())
      let { product, offers } = data

      store.commit('products/setProductItem', product) // to create correct structured data

      offers.forEach((offer) => {
        offer.seller = {
          id: offer.shop_id,
          title: offer.seller_name
        }
      })

      return {
        product,
        title: product.title,
        sellersList: offers
      }
    } catch (e) {
      error({ statusCode: 404, errorMessage: 'error.seller_not_found' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .offer {
    &__description {
      max-width: 430px;
    }
  }
</style>
