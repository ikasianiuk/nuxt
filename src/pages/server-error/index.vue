<template>
  <keep-alive>
    <div class="page-wrapper">
      <h1>Server error</h1>
      <h2>{{ serverError }}</h2>
    </div>
  </keep-alive>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ServerErrorPage',
  layout: 'empty',
  computed: {
    ...mapState(['serverError'])
  }
}
</script>

<style lang="scss" scoped>
  .page-wrapper {
    font-family: 'Courier New', Courier, monospace;
    text-align: center;
  }
</style>
