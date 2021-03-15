import Vue from 'vue'

/* mixin to add boolean when component is mounted, which can be used alongside with vuetify */

export const mountedMixin = {
  data () {
    return {
      isComponentMounted: false
    }
  },
  mounted () {
    this.isComponentMounted = true
  }
}

Vue.mixin(mountedMixin)
