<template>
  <div>
    <v-card class="pa-4-md-and-up pa-3-md-and-down elevation-2">
      <v-layout
        align-center
        wrap
      >
        <v-flex class="width-10 width-desktop-5">
          <div class="subheading font-weight-bold">{{ seller.seller_name }}</div>
          <div
            v-if="seller.seller_name !== 'vidaXL'"
            class="mt-1"
          >
            <nuxt-link
              :to="{ name: 'seller-id-name', params: { id: seller.shop_id, name: seller.seller_url_key } }"
              class="mt-1"
            >
              {{ localize('offer.contact') }}
            </nuxt-link>
          </div>
        </v-flex>
        <v-flex class="pr-5 pr-0-md-and-down text-xs-right width-10 width-desktop-4">
          <div class="subheading bold">{{ localize(seller.special_price || seller.price, 'currency') }}</div>
          <div class="caption grey--text line-height__small"> {{ localize('product.incl_vat') }}</div>
        </v-flex>
        <v-flex class="px-4 px-0-md-and-down full-width width-desktop-7">
          <product-details
            :product-data="productDetailsData"
            :usp-type="seller.seller_name === 'vidaXL' ? 'default' : 'seller'"
          />
        </v-flex>
        <v-flex class="full-width width-desktop-4 mx-auto seller-item__action">
          <v-btn
            block
            class="primary elevation-2 my-0"
            :disabled="!seller.in_stock"
            @click="addToCartHandler(seller, product)"
          >
            {{ localize('product.add_to_cart') }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import VCard from 'vuetify/es5/components/VCard/VCard'
import VBtn from 'vuetify/es5/components/VBtn/VBtn'
import { addToCartMixin } from '@/common/mixins/addToCart'
import ProductDetails from '@/components/products/ProductDetails'

export default {
  name: 'OfferItem',
  components: {
    VCard,
    VBtn,
    ProductDetails
  },
  mixins: [
    addToCartMixin
  ],
  props: {
    seller: {
      type: Object,
      required: true
    },
    product: Object
  },
  computed: {
    productDetailsData () {
      const { in_stock, delivery, seller_name } = this.seller

      return {
        in_stock,
        sellerName: seller_name,
        delivery_times: {
          days: delivery.working_days
        }
      }
    }
  },
  methods: {
    addToCartHandler ({ sku, special_price, price, seller }, { ean, title }) {
      const cartData = {
        sku: sku.toString(),
        ean,
        price: special_price || price,
        name: title,
        seller
      }
      this.addToCart(cartData)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'media';

  .seller-item {
    &__action {
      max-width: 300px;
    }
  }

  .product-details {
    /deep/ li {
      display: flex;
    }

    /deep/ .icon {
      font-size: 16px;
      font-weight: 600;
      line-height: 21px;
    }

    /deep/ .delivery-hint {
      margin-top: 2px;
      margin-left: 4px;
    }
  }
</style>
