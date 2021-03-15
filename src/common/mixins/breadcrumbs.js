/* mixin for simplifying process of setting breadcrumbs on each page */
import Vue from 'vue'
import { mapMutations } from 'vuex'

Vue.mixin({
  created () {
    if (process.server) return

    let isPage = this.$options.name && this.$options.name.toLowerCase().endsWith('page')

    if (isPage) {
      let breadcrumbs = this.pageBreadcrumbs && this.pageBreadcrumbs.length ? this.pageBreadcrumbs : []

      this.setBreadcrumbs(breadcrumbs)
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['setBreadcrumbs'])
  }
})
