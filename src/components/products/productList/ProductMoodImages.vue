<template>
  <div class="pos-relative product-thumbs">
    <div
      class="pos-relative product-thumbs__desktop"
      :class="getDesktopClassNames"
    >
      <lazy-image
        v-for="image in images"
        :key="image"
        :img-src="image"
        v-bind="$attrs"
        class="product-thumbs__img"
      />
    </div>
  </div>
</template>

<script>
import LazyImage from '@/components/lazyImage/LazyImage'

export default {
  name: 'ProductMoodImages',
  components: {
    LazyImage
  },
  inheritAttrs: false,
  props: {
    images: {
      type: Array,
      required: true
    },
    ean: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    getDesktopClassNames () {
      return {
        isSingleImage: this.images.length === 1
      }
    }
  }
}
</script>

<style scoped lang="scss">
.product-thumbs {
  $this: &;

  min-height: 160px;

  &__desktop {
    /*
      after window resize, swiper put pagination bullets into block for desktop images, which breaks image change on hover logic
    */
    /deep/ .swiper-pagination-bullet {
      display: none !important;
    }
  }

  &__img {
    opacity: 0;
    will-change: opacity;
    transition: opacity 0.2s;

    /*
      Reverse selector because of bug with swiper
    */
    &:nth-last-child(2) {
      opacity: 1;
    }

    &:nth-last-child(1) {
      position: absolute !important;
      top: 0;
      right: 0;
      left: 0;
    }

    &:not(.isSingleImage):hover {
      &:nth-last-child(2) {
        opacity: 0;
      }

      &:nth-last-child(1) {
        opacity: 1;
      }
    }
  }

  &__swiper {
    /* prevent content jumping on initialization */
    /deep/ .swiper-container:not(.swiper-container-initialized) {
      .swiper-slide:not(:first-child) {
        display: none;
      }
    }
  }

  &__pagiantion {
    bottom: -15px;

    /deep/ .swiper-pagination-bullet {
      margin: 0 4px;
    }
  }
}

</style>
