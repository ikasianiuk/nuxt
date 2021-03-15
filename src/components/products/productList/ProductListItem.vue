<template>
  <section class="pos-relative mb-1 product-item">
    <v-flex class="pb-1 px-1 fill-height select-none">
      <v-card
        class="fill-height pb-2"
        :class="[
          {'elevation-0': isElevated},
          {'elevation-3': !isElevated && product},
          {'pb-3': shouldHaveBottomPadding}
        ]"
        @mouseleave="isElevated = true"
        @mouseover="isElevated = false"
      >
        <v-layout class="px-2-xs px-3 column justify-space-between fill-height">
          <nuxt-link
            :to="routeLink"
            class="no-underline fill-height full-width product-item__link"
          >
            <v-flex
              ref="productItemCard"
              class="pointer vidaxl--text black--text product-item__box"
            >
              <!-- Don't remove this. It will be used after MVP
                <product-label
                  v-if="productLabel"
                  :img-src="productLabel"
                  class="text-xs-left"
                />
               -->
              <v-layout
                ref="productItemContent"
                class="column product-item__content-box"
              >
                <div class="product-item__image my-2">
                  <product-mood-images
                    v-if="isMoodImageAvaliable"
                    :images="productMoodImagesSrcs"
                    :ean="productEan"
                    :heights="$options.IMAGE_HEIGHTS"
                    :alt="product.title"
                    :is-campaign-banner="!!bannerText"
                    :force-for-ssr="forceLazyloadForSsr"
                    :force-for-browser="forceLazyloadForBrowser"
                  />
                  <lazy-image
                    v-else
                    :img-src="productImgSrc"
                    :heights="$options.IMAGE_HEIGHTS"
                    :alt="product.title"
                    :is-campaign-banner="!!bannerText"
                    :force-for-ssr="forceLazyloadForSsr"
                    :force-for-browser="forceLazyloadForBrowser"
                  />
                  <div
                    v-if="bannerText"
                    class="pos-absolute bottom center white--text full-width text-xs-center"
                  >
                    <span>{{ bannerText }}</span>
                  </div>
                </div>
                <div class="product-item__body text-xs-left pos-relative pt-2">
                  <h3 class="product-item__title body-1 mb-1">
                    {{ productTitle }}
                  </h3>
                  <star-rating
                    v-if="productRating"
                    :rating="productRating"
                    class="star-rating"
                    :font-size="20"
                  />

                  <!-- This block help to change card height dynamically -->
                  <div
                    class="helper-block"
                    :style="{ height: helperBlockHeight }"
                  ></div>

                  <!-- color options-->
                  <v-flex
                    v-if="isProductColorVariantsAvailable"
                    :style="{ height: getIsDesktop || '35px' }"
                  >
                    <v-flex
                      v-if="isShowProductColorsBadge"
                      class="my-2"
                    >
                      <img
                        src="/color_options_icon.svg"
                        alt="color_variants"
                        class="product-color__icon--align"
                      >
                      <span v-if="!isColorOptionsNumberHidden">{{ product.color_variants.length }}</span>
                      <span> {{ localize('product.color_options') }}</span>
                    </v-flex>

                    <product-list-item-color
                      v-show="isShownProductColorsOptions"
                      :product-ean="productEan"
                      :product-item-colors="product.color_variants"
                      @change-product-color="onChangeProductColor"
                    />
                  </v-flex>

                  <!-- price-->
                  <price
                    v-if="shouldShowPrice"
                    :product="productPriceInfo"
                    price-type="pdp"
                    :color="type === 'category-product' ? 'green-medium' : 'black'"
                    class="pt-1 mt-auto text-align-right product-item__price"
                  />

                  <!-- slot for add to cart btn-->
                  <slot
                    v-if="!getIsDesktop"
                    :is-elevated="isElevated"
                  ></slot>

                  <slot name="auction-meta-data"></slot>

                </div>
              </v-layout>
            </v-flex>
          </nuxt-link>
          <slot
            v-if="getIsDesktop"
            :is-elevated="isElevated"
          ></slot>
        </v-layout>

        <slot
          name="product-remove-button"
          :is-elevated="isElevated"
        ></slot>
      </v-card>
    </v-flex>
  </section>
</template>

<script>
import VCard from 'vuetify/es5/components/VCard/VCard'
import LazyImage from '@/components/lazyImage/LazyImage'
import { debounce } from 'lodash'
import StarRating from '@/components/starRating/StarRating'
import { mapActions } from 'vuex'
import ProductListItemColor from './ProductListItemColor'
import Price from '@/components/products/Price'
import ProductMoodImages from '@/components/products/productList/ProductMoodImages.vue'

const pixelsCountToFixAlignment = 4
const ADULT_CATEGORIES = ['772', '773', '774', '775', '777']
const IMAGE_HEIGHTS = { xs: 150, sm: 165, md: 165, lg: 165 }

export default {
  IMAGE_HEIGHTS,
  name: 'ProductListItem',
  components: {
    Price,
    VCard,
    LazyImage,
    StarRating,
    ProductListItemColor,
    ProductMoodImages
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    bannerText: String,
    routeLinkTo: Object,
    type: {
      type: String,
      default: 'default'
    },
    forceLazyloadForSsr: Boolean,
    forceLazyloadForBrowser: Boolean
  },
  data () {
    return {
      isElevated: true,
      title: '',
      ean: '',
      imgSrc: '',
      url_key: '',
      special_price: 0,
      price: 0,
      helperBlockHeight: '0',
      colorOptionChanged: false,
      maxTitleLength: 70
    }
  },
  computed: {
    isProductColorVariantsAvailable () { // check if color options available for current product
      return this.product.color_variants && this.product.color_variants.length
    },
    isShowProductColorsBadge () { // This one will show the color badge (icon)
      return this.isProductColorVariantsAvailable && (!this.getIsDesktop || this.isElevated)
    },
    isShownProductColorsOptions () { // This one will show color options (option selector)
      return !this.isElevated && this.getIsDesktop && this.isProductColorVariantsAvailable
    },
    productTitle () {
      const title = this.title ? this.title : this.product.title
      return title ? title.substr(0, this.maxTitleLength) : ''
    },
    productUrlKey () {
      return this.url_key || (this.product.url_key && this.product.url_key.includes('/') ? this.product.url_key.split('/').pop() : this.product.url_key)
    },
    shouldHideAdultProductImg () {
      const isSearchPage = this.type === 'product-search'
      // don't hide adult product image if customer refines his search by going into adult category
      const isSearchMadeInAdultCategory = ADULT_CATEGORIES.includes(this.$route.query.category_path)

      return isSearchPage && !isSearchMadeInAdultCategory && this.product.adult_product
    },
    productImgSrc () {
      // show 18+ icon for adults product
      if (this.shouldHideAdultProductImg) return '/18-plus-product-image.png'
      return this.imgSrc || this.product.image_grid || this.product.img_url
    },
    productEan () {
      return this.ean ? this.ean : this.product.ean
    },
    isMoodImageAvaliable () {
      // show mood image if product has it and only on Desktop
      return this.getIsDesktop && this.product && this.product.images_count && this.product.images_count.main_im > 0
    },
    productMoodImagesSrcs () {
      const srcs = [this.productImgSrc]
      if (this.isMoodImageAvaliable) {
        const imageParams = {
          ean: this.productEan,
          type: 'm',
          lang: 'en',
          size: 'sq160',
          extension: '.jpg',
          index: 0
        }

        srcs.push(this.getImageUrl(imageParams))
      }

      return srcs
    },
    productLabel () {
      let activeLabel = Object.keys(this.product.labels).find(label => this.product.labels[label])

      return activeLabel && activeLabel.replace('png', 'svg')
    },
    routeLinkParams () {
      return {
        name: 'product-ean-name',
        params: {
          ean: this.productEan,
          name: this.productUrlKey,
          title: this.productTitle,
          eanMock: this.productEan
        }
      }
    },
    routeLink () {
      /* Force to get link params from routeLinkParams variable.
      This is need for properly link update when user update color options and for
      backward compatibility for other places where this component is used */
      return this.colorOptionChanged
        ? this.routeLinkParams
        : this.routeLinkTo || this.routeLinkParams
    },
    shouldShowPrice () {
      return this.type !== 'auction-product'
    },
    shouldHaveBottomPadding () {
      return !this.getIsDesktop || ['seller-product', 'auction-product'].includes(this.type)
    },
    productRating () {
      const { avgScores = {} } = this.product

      return avgScores.avgStars ? +avgScores.avgStars : 0
    },
    productPriceInfo () {
      return {
        price: this.special_price || this.product.special_price,
        origin_price: this.price || this.product.price,
        product_type: this.product.product_type,
        unit_type: this.product.unit_type,
        unit_quantity: +this.product.unit_quantity
      }
    },
    isColorOptionsNumberHidden () {
      return this.getIsCountrySlovenia || this.getIsCountryPoland || this.getIsCountryCzechRepublic || this.getIsCountrySlovakia
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setProductItemHeight()
    })
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    ...mapActions('products', ['getProductByEan']),
    setProductItemHeight () {
      if (!this.$refs.productItemCard) return

      const productItemCartHeight = this.$refs.productItemCard.clientHeight
      const productItemContentHeight = this.$refs.productItemContent.clientHeight

      this.helperBlockHeight = `${productItemCartHeight - productItemContentHeight - pixelsCountToFixAlignment}px`
    },
    onWindowResize: debounce(function () {
      this.setProductItemHeight()
    }, 1000),
    onChangeProductColor (colorItem) {
      this.title = colorItem.title
      this.url_key = colorItem.url_key
      this.ean = colorItem.ean
      this.special_price = colorItem.special_price
      this.price = colorItem.price
      this.imgSrc = this
        .getImageUrl({ ean: this.ean, type: 'a', lang: 'en', size: 'sq160', extension: '.jpg' })

      this.colorOptionChanged = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-item {
    &__image {
      width: 100%;
      min-height: 100px;
      max-height: 165px;
    }

    &__title {
      overflow: hidden;
    }

    /* in order not to spoil layout on IE */
    &__link {
      display: flex;
      -webkit-flex: 1;
      -moz-flex: 1;
    }

    &__content-box {
      flex-grow: 1;
    }

    &__body {
      display: flex !important;
      flex-direction: column !important;
      flex-grow: 1 !important;
    }

    &__box {
      display: flex;
    }
  }

  .star-rating {
    height: 20px;
  }

  .product-color__icon--align {
    vertical-align: text-bottom;
  }
</style>
