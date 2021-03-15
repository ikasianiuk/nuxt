<template>
  <div
    class="pos-relative full-width image__wrapper"
    :style="blockStyle"
    :class="{ 'skeleton-placeholder': !src }"
  >
    <img
      v-show="src"
      class="pos-absolute"
      :src="src"
      :alt="alt"
      :class="{ 'border-radius-2': isCampaignBanner }"
    >
  </div>
</template>

<script>
import imageNotFound from '@/static/imageNotFound.svg'

export default {
  name: 'LazyImage',
  inheritAttrs: false,
  props: {
    imgSrc: String,
    heights: Object,
    isCampaignBanner: Boolean,
    // Parameters below add ability to force loading of image
    forceForSsr: Boolean,
    forceForBrowser: Boolean
  },
  data () {
    return {
      originalImageSource: '',
      loadFailed: false
    }
  },
  computed: {
    blockStyle () {
      return { height: `${this.height}px` }
    },
    src () {
      if (!this.originalImageSource && !this.loadFailed) {
        return false
      }

      if (this.originalImageSource && !this.loadFailed) {
        return this.originalImageSource
      }

      return imageNotFound
    },
    alt () {
      return this.$attrs.alt || 'product-item'
    },
    height () {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return this.heights.xs
      case 'sm':
        return this.heights.sm || this.heights.xs
      case 'md':
        return this.heights.md || this.heights.sm || this.heights.xs
      case 'lg':
        return this.heights.lg || this.heights.md || this.heights.sm || this.heights.xs
      case 'xl':
        return this.heights.xl || this.heights.lg || this.heights.md || this.heights.sm || this.heights.xs
      default:
        return this.heights.xs
      }
    }
  },
  watch: {
    imgSrc: {
      handler: 'observeImg',
      immediate: true
    }
  },
  methods: {
    handleIntersect (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImg()
          if (observer) {
            observer.unobserve(this.$el)
            observer = null
          }
        }
      })
    },
    observeImg () {
      // skip it on server side
      if (process.server) return this.loadImgSsr()
      // check browser compatibility and simply load image if it does not support neither intersection observer
      // nor its polyfill
      // shouldn't be used for mobile devices, as images are displayed slowly while scrolling
      if (window['IntersectionObserver'] && !this.forceForBrowser) {
        this.$nextTick(() => {
          const observer = new IntersectionObserver(this.handleIntersect, {
            root: null,
            threshold: 0,
            rootMargin: `0px 0px ${this.height}px 0px`
          })

          observer.observe(this.$el)
        })
      } else {
        this.loadImg()
      }
    },
    loadImg () {
      const originalImageToFetch = new Image()
      originalImageToFetch.src = this.imgSrc

      originalImageToFetch.onload = () => {
        this.originalImageSource = this.imgSrc
      }
      originalImageToFetch.onerror = () => {
        this.loadFailed = true
      }
    },
    loadImgSsr () {
      if (this.forceForSsr) {
        this.originalImageSource = this.imgSrc
      }
    }
  }
}
</script>

<style scoped lang="scss">
  div {
    transition: all 0.3s linear;
  }

  img {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }
</style>
