<template>
  <div class="swiper-wrap pos-relative d-block text-xs-left full-width">
    <div
      v-show="isNavShown"
      ref="btnPrev"
      class="swiper-button-prev swiper-button-black recently-viewed"
      :class="plainControls && 'swiper-button-plain'"
    >
      <!--IE11 isn't rendering default swiper arrows, so we need to style them ourselves-->
      <span class="arrow-left"></span>
    </div>
    <div
      ref="swiperContainer"
      class="swiper-container py-2 overflow-x-hidden"
    >
      <slot></slot>
    </div>
    <div
      v-show="isNavShown"
      ref="btnNext"
      class="swiper-button-next swiper-button-black recently-viewed"
      :class="plainControls && 'swiper-button-plain'"
    >
      <span class="arrow-right"></span>
    </div>
  </div>
</template>

<script>
import 'swiper/css/swiper.min.css'
import { Swiper, Navigation, Pagination, Controller } from 'swiper/js/swiper.esm.js'
Swiper.use([Navigation, Pagination, Controller])

export default {
  name: 'Swiper',
  props: {
    swiperOptions: Object,
    loop: {
      type: Boolean,
      default: false
    },
    slidesAmount: Number,
    listenToEvents: {
      type: Boolean,
      default: false
    },
    isCarousel: {
      type: Boolean,
      default: false
    },
    carouselId: {
      type: String,
      default: Date.now().toString()
    },
    // if true will add some plain styles for prev/next arrows
    plainControls: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      swiper: null
    }
  },
  computed: {
    isOneSlide () {
      return this.slidesAmount === 0
    },
    isNavShown () {
      return this.isCarousel
    }
  },
  mounted () {
    this.swiper = new Swiper(this.$refs.swiperContainer, {
      ...this.swiperOptions,
      init: false,
      navigation: {
        nextEl: this.$refs.btnNext,
        prevEl: this.$refs.btnPrev
      },
      observer: true,
      observeParents: true,
      loop: this.loop && !this.isOneSlide
    })

    this.swiper.on('init', () => {
      this.$emit('swiperReady')
    })

    this.swiper.on('observerUpdate', () => {
      this.$emit('observerUpdate')
    })

    this.swiper.on('slideChange', () => {
      this.$emit('progress', this.swiper.progress)
    })

    this.$nuxt.$on('update-slides', this.updateSlides)

    this.listenToEvents && this.$nuxt.$on('showNextSlide', this.showNextSlide)

    this.swiper.init()
  },
  beforeDestroy () {
    this.$nuxt.$off('showNextSlide', this.showNextSlide)
    this.$nuxt.$off('update-slides', this.updateSlides)
  },
  methods: {
    showNextSlide () {
      this.swiper.slideNext()
    },
    updateSlides (slides) {
      if (this.swiperOptions.swipeHandler !== 'product-swiper') return

      this.swiper.removeAllSlides()

      slides.forEach((slide, index) => {
        this.swiper.addSlide(index, slide)
      })

      this.swiper.slideTo(1)
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../assets/styles/app/partials/swiper';
  @import 'media';

  /deep/ .swiper-container {
    max-width: 100%;
  }

  /deep/ .swiper-pagination {
    bottom: 0;
  }

  /deep/ .swiper-button-prev,
  /deep/ .swiper-button-next {
    z-index: 7;
    padding: 22px;
    margin-top: -30px !important;
    background-color: #fff;
    border-radius: 50% !important;
    outline: none;
    box-shadow: 1px 3px 7px rgba(0, 0, 0, 0.1);

    &::before,
    &::after {
      display: none;
    }
  }

  .swiper-button-plain {
    height: 35px;
    padding-top: 0;
    margin-top: 0 !important;
    background-color: transparent;
    box-shadow: none;
    transform: translateY(-50%);

    .arrow-right,
    .arrow-left {
      width: 8px;
      height: 8px;
      border-width: 2px;
    }
  }

  .arrow-right,
  .arrow-left {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 10px;
    height: 10px;
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }

  .arrow-right {
    margin-left: -2px;
    transform: translate(-50%, -50%) rotate(135deg);
  }

  .arrow-left {
    margin-left: 2px;
    transform: translate(-50%, -50%) rotate(-45deg);
  }
</style>
