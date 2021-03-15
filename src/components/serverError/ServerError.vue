<template>
  <div class="wrapper pt-1 px-2-sm-and-down mb-4">
    <v-layout
      row
      wrap
      justify-space-between
    >

      <v-flex
        xs12
        sm6
        class="special-font"
      >
        <h2 class="title bold">{{ localize('error.500_header') }}</h2>

        <p class="mt-3 body-1">{{ localize('error.500_message_short') }}</p>
        <p class="body-1">{{ localize('error.500_message_long') }}</p>
        <p class="mb-4 body-1">{{ localize('error.500_proposition') }}</p>
      </v-flex>

      <img
        :src="getServerErrorImage"
        :alt="localize('error.500_header')"
        class="error-image mt-3-xs"
      >

    </v-layout>
  </div>
</template>

<script>
import ServerErrorImage from '@/static/server-error.svg'

export default {
  name: 'ServerError',
  computed: {
    getServerErrorImage () {
      return ServerErrorImage
    }
  },
  head () {
    return {
      title: '500',
      meta: [
        { hid: 'description', name: 'description', content: '500' },
        { hid: 'robots', name: 'robots', content: 'NOINDEX,FOLLOW' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "media";

  .error-image {
    width: 400px;

    @include minMobileXXS {
      width: 45vw;
      max-width: 400px;
    }

    @include maxMobileXXS {
      max-width: 100%;
      margin: 0 auto;
    }
  }
</style>


