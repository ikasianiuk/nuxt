<template>
  <section>
    <swiper
      ref="slider"
      v-scroll="onScroll"
      :is-carousel="isCarousel"
      :swiper-options="swiperOptions"
      :slides-amount="allSlides.length"
      :loop="loop"
      :carousel-id="`${carouselId}-${sliderScreen}`"
      class="product-slider"
      @swiperReady="$emit('componentReady')"
      @progress="pauseYoutubeVideo"
    >
      <a
        class="swiper-wrapper text-xs-center mb-5 pointer"
        @click.prevent="openZoomPopup"
      >
        <image-slide
          v-for="(slide, index) in allSlides"
          ref="slides"
          :key="`product-slide-${index}`"
          :type="slide.type"
          :image-index="slide.index"
          :video-id="slide.videoId"
          :ean="ean"
          size1="r340"
          media1="(min-width: 580px) and (max-width: 780px)"
          size2="sq250"
          media2="(max-width: 580px)"
          :title="title"
        />
      </a>
      <!--use pagination if array of slides is not empty-->
      <div
        v-if="slides.length > 1"
        :class="`swiper-pagination swiper-pagination-black product-image-${sliderScreen}`"
      ></div>
    </swiper>
    <client-only>
      <component
        :is="asyncZoomPopup"
        ref="zoomPopup"
        :is-open="isZoomPopupOpen"
        :ean="ean"
        :slides="slides"
        :title="title"
        @closed="isZoomPopupOpen=!isZoomPopupOpen"
        @hook:mounted="goToZoomPopupSlide"
      />
    </client-only>
  </section>
</template>

<script>
import { wiseImport } from '@/common/async-components/async-import'
import ImageSlide from '@/components/imageSlider/ImageSlide'
import { getIdFromUrl } from 'vue-youtube'
import { getIsElementOffScreen } from '@/helpers/getIsElementOffScreen'

export default {
  name: 'ImageSlider',
  components: {
    ...wiseImport('Swiper'),
    ...wiseImport('ProductImagePopup'),
    ImageSlide
  },
  props: {
    ean: [String, Number],
    loop: {
      type: Boolean,
      default: true
    },
    videoLink: {
      type: String,
      default: ''
    },
    title: String,
    sliderScreen: {
      type: String,
      default: ''
    },
    slidesAmount: {
      type: Object,
      default () {
        return { 'main_im': 0, 'main_amazon_im': 1, 'gallery_img_count': 0 }
      }
    },
    isCarousel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      asyncZoomPopup: '',
      isZoomPopupOpen: false,
      carouselId: 'product-image',
      swiperOptions: {
        pagination: {
          el: `.product-slider .swiper-pagination.product-image-${this.sliderScreen}`,
          clickable: true
        },
        preloadImages: false,
        lazyLoading: true,
        loop: true,
        init: false
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.slider.swiper
    },
    youtubeId () {
      return getIdFromUrl(this.videoLink)
    },
    allSlides () {
      if (this.youtubeId) {
        return [...this.slides, { type: 'video', videoId: this.youtubeId }]
      }

      return this.slides
    },
    slides () {
      const allSlides = [{ type: 'a', index: 0 }]

      if (this.slidesAmount.main_im) {
        allSlides.push({ type: 'm', index: 0 })
      }

      for (let i = 0; i < this.slidesAmount.gallery_img_count; i++) {
        allSlides.push({ type: 'g', index: i + 1 })
      }

      return allSlides
    }
  },
  methods: {
    onScroll () {
      if (!this.youtubeId) return

      const isSliderOffScreen = getIsElementOffScreen(this.$refs.slider)
      isSliderOffScreen && this.pauseYoutubeVideo()
    },
    pauseYoutubeVideo () {
      if (!this.youtubeId) return

      const slidesRef = this.$refs.slides
      const lastSlideRef = slidesRef[slidesRef.length - 1]
      const player = lastSlideRef && lastSlideRef.getPlayer()

      if (player && player.hasOwnProperty('getPlayerState') && typeof player.getPlayerState === 'function') {
        const isPlayerStopped = this.checkYoutubePaused(player.getPlayerState())
        !isPlayerStopped && player.pauseVideo()
      }
    },
    // YouTube - check if it's paused
    checkYoutubePaused (state) {
      return state <= 0 || state === 2 || state === 5
    },
    openZoomPopup (e) {
      const isTargetVideo = this.getIfTargetVideo(e)
      if (isTargetVideo) return

      this.isZoomPopupOpen = !this.isZoomPopupOpen
      this.loadZoomPopup()

      if (this.slides.length <= 1 || !this.$refs.zoomPopup) return

      this.goToZoomPopupSlide()
    },
    getIfTargetVideo (event) {
      const videoClasses = ['slide-video']

      return Array.from(event.target.classList).some(v => videoClasses.includes(v))
    },
    goToZoomPopupSlide () {
      this.$refs.zoomPopup.goToSlide(this.getSwiperActiveIndex())
    },
    getSwiperActiveIndex () {
      if (this.swiper.activeIndex > this.slides.length) return 0

      if (this.swiper.activeIndex <= 0) return this.slides.length - 1

      return this.swiper.activeIndex - 1
    },
    loadZoomPopup () {
      if (this.asyncZoomPopup) return
      this.asyncZoomPopup = 'productImagePopup'
    }
  }
}
</script>

<style scoped lang="scss">
  @import 'media';

  /deep/ .swiper-pagination-bullet:not(.swiper-pagination-bullet-active) {
    background: transparent;
    border: 1px solid black;
    opacity: 0.75;
  }

  .product-slider {
    position: relative;
    z-index: 1;

    /deep/ img {
      max-width: 100%;
    }
  }

  .swiper-wrapper {
    @include mobile {
      margin-bottom: 15px !important;
    }

    /deep/ .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      height: auto;
    }

    /deep/ iframe {
      width: 100%;
      max-width: 650px;
    }
  }
</style>
