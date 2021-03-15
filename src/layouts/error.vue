<template>
  <div>
    <not-found
      v-if="error.statusCode === 404"
      :error="error"
    />
    <server-error v-if="error.statusCode === 500" />
    <request-timeout-exceeded-dialog />
  </div>
</template>

<script>
import NotFound from '@/components/notFound/NotFound'
import ServerError from '@/components/serverError/ServerError'
import RequestTimeoutExceededDialog from '@/components/requestTimeoutExceededDialog'

export default {
  name: 'NuxtErrorPage',
  components: {
    NotFound,
    ServerError,
    RequestTimeoutExceededDialog
  },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  computed: {
    pageBreadcrumbs () {
      return [
        {
          title: this.error.statusCode.toString(),
          plain: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>

