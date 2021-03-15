<template>
  <!--we need any kind of html element to check if it is in viewport-->
  <!--class ma-2 needed for e2e test to scroll to the visible content-->
  <span class="ma-2"></span>
</template>

<script>
export default {
  name: 'Intersector',
  mounted () {
    if (window.IntersectionObserver) {
      this.observer = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
          this.$emit('intersected')
          observer.unobserve(this.$el)
          this.$destroy()
          this.$el.parentNode.removeChild(this.$el)
        }
      }, {
        threshold: 0
      })

      this.$nextTick(() => {
        this.observer.observe(this.$el)
      })
    } else {
      // in case if client browser does not support IO and its polyfill just fire event
      this.$emit('intersected')
    }
  },
  destroyed () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}
</script>
