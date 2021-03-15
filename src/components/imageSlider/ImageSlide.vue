<!--ToDo: refactor this-->
<template>
  <div
    class="swiper-slide slide"
    :class="videoId && 'slide-video'"
  >
    <picture v-if="!videoId">
      <!--size-1-->
      <source
        v-if="size1"
        :srcset="constructImgUrl(size1, '.jpg')"
        :media="media1"
      >
      <source
        v-if="size1"
        type="image/webp"
        :srcset="constructImgUrl(size1, '.webp')"
        :media="media1"
      >
      <source
        v-if="size1"
        type="image/vnd.ms-photo"
        :srcset="constructImgUrl(size1, '.jxr')"
        :media="media1"
        sizes="100vw"
      >
      <!--size-2-->
      <source
        v-if="size2"
        :srcset="constructImgUrl(size2, '.jpg')"
        :media="media2"
      >
      <source
        v-if="size2"
        type="image/webp"
        :srcset="constructImgUrl(size2, '.webp')"
        :media="media2"
      >
      <source
        v-if="size2"
        type="image/vnd.ms-photo"
        :srcset="constructImgUrl(size2, '.jxr')"
        :media="media2"
        sizes="100vw"
      >
      <!--size-3-->
      <source
        v-if="size3"
        :srcset="constructImgUrl(size3, '.jpg')"
        :media="media3"
      >
      <source
        v-if="size3"
        type="image/webp"
        :srcset="constructImgUrl(size3, '.webp')"
        :media="media3"
      >
      <source
        v-if="size3"
        type="image/vnd.ms-photo"
        :srcset="constructImgUrl(size3, '.jxr')"
        :media="media3"
        sizes="100vw"
      >
      <!--size-4-->
      <source
        v-if="size4"
        :srcset="constructImgUrl(size4, '.jpg')"
        :media="media4"
      >
      <source
        v-if="size4"
        type="image/webp"
        :srcset="constructImgUrl(size4, '.webp')"
        :media="media4"
      >
      <source
        v-if="size4"
        type="image/vnd.ms-photo"
        :srcset="constructImgUrl(size4, '.jxr')"
        :media="media4"
        sizes="100vw"
      >
      <!--size-5-->
      <source
        v-if="size5"
        :srcset="constructImgUrl(size5, '.jpg')"
        :media="media5"
      >
      <source
        v-if="size5"
        type="image/webp"
        :srcset="constructImgUrl(size5, '.webp')"
        :media="media5"
      >
      <source
        v-if="size5"
        type="image/vnd.ms-photo"
        :srcset="constructImgUrl(size5, '.jxr')"
        :media="media5"
        sizes="100vw"
      >
      <!--size-6-->
      <source
        v-if="size6"
        :srcset="constructImgUrl(size6, '.jpg')"
        :media="media6"
      >
      <source
        v-if="size6"
        type="image/webp"
        :srcset="constructImgUrl(size6, '.webp')"
        :media="media6"
      >
      <source
        v-if="size6"
        type="image/vnd.ms-photo"
        :srcset="constructImgUrl(size6, '.jxr')"
        :media="media6"
        sizes="100vw"
      >
      <!--size-7-->
      <source
        v-if="size7"
        :srcset="constructImgUrl(size7, '.jpg')"
        :media="media7"
      >
      <source
        v-if="size7"
        type="image/webp"
        :srcset="constructImgUrl(size7, '.webp')"
        :media="media7"
      >
      <source
        v-if="size7"
        type="image/vnd.ms-photo"
        :srcset="constructImgUrl(size7, '.jxr')"
        :media="media7"
        sizes="100vw"
      >
      <!--default-->
      <source
        type="image/jpg"
        :srcset="constructImgUrl(fallback, '.jpg')"
        sizes="100vw"
      >
      <source
        type="image/webp"
        :srcset="constructImgUrl(fallback, '.webp')"
      >
      <img
        :title="title"
        :alt="title"
        :src="constructImgUrl(fallback, '.jpg')"
      >
    </picture>
      <youtube
        v-else
        ref="youtube"
        :video-id="videoId"
        :fit-parent="true"
    />
  </div>
</template>

<script>

export default {
  name: 'ImageSlide',
  components: {
    Youtube: () => import(/* webpackChunkName: "vue-youtube" */ 'vue-youtube')
      .then(module => {
        const { Youtube } = module
        return Youtube
      })
  },
  props: {
    videoId: {
      type: String,
      default: ''
    },
    ean: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    imageIndex: {
      type: Number
    },
    size1: {
      type: String,
      default: ''
    },
    size2: {
      type: String,
      default: ''
    },
    size3: {
      type: String,
      default: ''
    },
    size4: {
      type: String,
      default: ''
    },
    size5: {
      type: String,
      default: ''
    },
    size6: {
      type: String,
      default: ''
    },
    size7: {
      type: String,
      default: ''
    },
    media1: {
      type: String,
      default: ''
    },
    media2: {
      type: String,
      default: ''
    },
    media3: {
      type: String,
      default: ''
    },
    media4: {
      type: String,
      default: ''
    },
    media5: {
      type: String,
      default: ''
    },
    media6: {
      type: String,
      default: ''
    },
    media7: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'm'
    },
    lang: {
      type: String,
      default: 'en'
    },
    fallback: {
      type: String,
      default: 'r458'
    }
  },
  methods: {
    constructImgUrl (size, extension) {
      let imageData = {
        ean: this.ean,
        type: this.type,
        lang: this.lang,
        size: size,
        extension: extension,
        index: this.imageIndex
      }

      return this.getImageUrl(imageData)
    },
    getPlayer () {
      return this.$refs.youtube && this.$refs.youtube.player
    }
  }
}
</script>
