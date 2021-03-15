<template>
  <section>
    <v-flex
      class="pb-1 select-none flex-column"
      full-height
      @mouseleave="isElevated = true"
      @mouseover="isElevated = false"
    >
      <v-layout
        wrap
        :class="[{'elevation-0': isElevated}, {'elevation-1': !isElevated && product}]"
      >
        <component
          :is="getRouterLink"
          v-bind="getLinkAttrs"
          class="no-underline full-width pointer"
        >
          <v-flex
            xs12
            style="min-height: 100px"
            class="pos-relative"
          >
            <div
              :style="{ backgroundColor: imgBackground }"
              class="swiper-item__image"
            >
              <lazy-image
                :heights="heights"
                :img-src="imgSrc"
                :alt="'product'"
                :is-campaign-banner="!!bannerText"
              />
            </div>

            <sub-banner-title
              v-if="bannerText"
              :title="bannerText"
            />
          </v-flex>
        </component>
        <slot :is-elevated="isElevated"></slot>
      </v-layout>
    </v-flex>
  </section>
</template>

<script>
import LazyImage from '@/components/lazyImage/LazyImage'
import SpecialPriceExplanation from '@/components/products/SpecialPriceExplanation'
import SubBannerTitle from '@/components/banner/sub-banner/SubBannerTitle'

export default {
  name: 'SwiperItem',
  components: {
    SpecialPriceExplanation,
    LazyImage,
    SubBannerTitle
  },
  props: {
    routeLinkTo: {
      type: Object,
      required: true
    },
    imgSrc: String,
    bannerText: String,
    imgBackground: String,
    heights: {
      type: Object,
      required: false,
      default: () => ({ xs: 130, sm: 155, md: 180, lg: 230 })
    }
  },
  data () {
    return {
      isElevated: true
    }
  },
  computed: {
    getRouterLink () {
      return typeof this.routeLinkTo === 'string' && this.routeLinkTo.includes('http')
        ? 'a'
        : 'nuxt-link'
    },
    getLinkAttrs () {
      if (this.getRouterLink === 'a') return { href: this.routeLinkTo }
      else return { to: this.routeLinkTo }
    }
  }
}
</script>

<style lang="scss">
  @import 'media';

  .product-slider {
    min-height: 400px;
  }

  @include mobile {
    .product-slider {
      min-height: 325px;
    }
  }

</style>
