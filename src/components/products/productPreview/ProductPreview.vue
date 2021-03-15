<template>
  <v-layout mt-4>
    <figure class="product-preview__img d-flex align-center">
      <img
        :src="imgPath"
        :alt="product.title"
        class="display-block full-width"
      >
    </figure>
    <v-flex
      class="product-preview__description ml-4-md-and-up ml-2-md-and-down"
    >
      <h2 class="product-preview__title font-weight-regular">{{ product.title }}</h2>
      <div
        v-if="productBrand"
        class="mt-2"
      >
        {{ localize('product.brand') }}: {{ productBrand }}
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'ProductPreview',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    imgPath () {
      let imageData = {
        ean: this.product.ean || this.product.product_data.ean,
        type: 'm',
        lang: 'en',
        size: 'sq300',
        extension: '.jpg'
      }

      return this.getImageUrl(imageData)
    },
    productBrand () {
      return this.product.brand || this.product.product_brand
    },
  }
}
</script>

<style lang="scss" scoped>
  @import 'media';

  .product-preview {
    &__description {
      max-width: 345px;
    }

    &__img {
      min-width: 85px;
      max-width: 150px;
    }

    &__title {
      font-size: 20px;
      line-height: 1.33 !important;

      @include mobile {
        font-size: 14px;
        word-break: break-all;
      }
    }
  }
</style>
