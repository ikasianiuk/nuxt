<template>
  <ul
    v-show="shouldShowBreadCrumbs"
    class="breadcrumb text-truncate black--text overflow-hidden pl-0"
    :class="{ 'd-block': shouldShowBreadCrumbs }"
  >
    <li
      v-for="(item, index) in generatedBreadCrumbsByScreenWidth"
      :key="getBreadCrumbKey(item, index)"
      class="breadcrumb__item black--text d-inline text-truncate body-1"
    >
      <span
        v-if="breadcrumbs.forceMobileView || isVisibleArrow(index)"
        :class="{'breadcrumb__arrow': isCheckoutPages}"
      >
        {{ breadCrumbArrow }}
      </span>
      <component
        :is="item.plain || !item.route ? 'span' : 'nuxt-link'"
        :to="item.route"
        class="breadcrumb__link text-hover-primary pointer"
        @click="checkCallback(item)"
      >
        <span
          v-if="getIsMobile && !breadcrumbs.forceMobileView"
          :class="{'breadcrumb__arrow': isCheckoutPages}"
        >
          {{ localize('product.back_to') }}
        </span>
        {{ typeof item.title == 'string' && item.title.indexOf(localize('product.back_to')) !== -1 ? localize('product.back_to') : '' }}
        <span :class="{ 'breadcrumb__category-name': item.nonItalic === false }">{{ getBreadCrumbItalic(item.title || item.name, item.nonItalic) }}</span>
      </component>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BreadCrumb',
  computed: {
    ...mapState('breadcrumbs', ['breadcrumbs']),
    isCheckoutPages () {
      return ['checkout', 'login'].includes(this.$route.name)
    },
    homeBreadCrumbItem () {
      return {
        title: this.localize('home.home'),
        route: { name: 'index' },
        level: 1
      }
    },
    shouldShowBreadCrumbs () {
      return this.breadCrumbsToDisplay.length
    },
    breadCrumbArrow () {
      return this.breadcrumbs.forceMobileView || this.getIsMobile ? '‹' : '›'
    },
    countOfLevelsBreadCrumbsToShow () {
      switch (true) {
      case (this.getIsMobile):
        return this.breadcrumbs.find(el => el.plain) ? 2 : 1 // + 1 home breadcrumb
      case this.getIsTablet:
        return 2 // + 1 home breadcrumb
      case this.getIsDesktop && this.windowWidth < 1264: // handle LG screens
        return 4 // + 1 home breadcrumb
      default:
        return 9 // + 1 home breadcrumb
      }
    },
    breadCrumbsToDisplay () {
      let rawBreadcrumbs = this.breadcrumbs.slice()

      // some breadcrumbs may be used only for google 360 and are not needed for displaying
      rawBreadcrumbs = rawBreadcrumbs.filter(e => !e.forGoogleOnly)

      if (!rawBreadcrumbs.length) return []
      // on category page there is no sense in making link to current page
      if (rawBreadcrumbs.length && (['category-id-name', 'thankyou'].includes(this.$route.name))) {
        const lastItemIndex = rawBreadcrumbs.length - 1
        rawBreadcrumbs[lastItemIndex] = Object.assign({}, rawBreadcrumbs[lastItemIndex], { plain: true })
      }

      return this.breadcrumbs.forceMobileView ? [rawBreadcrumbs[0]] : [this.homeBreadCrumbItem, ...rawBreadcrumbs]
    },
    breadCrumbStartItem () {
      const startItem = this.breadCrumbsToDisplay.length - this.countOfLevelsBreadCrumbsToShow
      return startItem >= 0 ? startItem : 0
    },
    generatedBreadCrumbsByScreenWidth () {
      return this.breadCrumbsToDisplay
        .filter((breadcrumb) => {
          if (this.getIsMobile) {
            return !breadcrumb.plain // flag 'plain' is for setting no-link tag to the bread crumbs
          }

          return true
        })
        .slice(
          this.breadCrumbStartItem,
          this.breadCrumbStartItem + this.countOfLevelsBreadCrumbsToShow
        )
    }
  },
  methods: {
    updateTitle (title) {
      return typeof title === 'string' && title.replace(this.localize('product.back_to'), '')
    },
    getBreadCrumbItalic (title, nonItalic) {
      return nonItalic && !this.isCheckoutPages ? title : this.updateTitle(title)
    },
    isVisibleArrow (index) {
      return this.getIsMobile || index > 0
    },
    getBreadCrumbKey (item, index) {
      let key = item.title || item.name
      return `${key}-${index}`
    },
    checkCallback (item) {
      if (item.isAccount && this.getIsMobile) {
        this.$router.push({ name: 'index' })
      }

      if (item.shouldMoveBack) {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'colors';
  @import 'media';

  .breadcrumb {
    font-size: 14px;
    list-style: none;

    &__item {
      margin-right: 4px;
    }

    &__link {
      text-decoration: underline !important;
    }

    &__category-name,
    &__arrow {
      font-style: italic !important;
    }
  }
</style>
