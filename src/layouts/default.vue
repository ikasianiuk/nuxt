<template v-cloak>
  <section
    key="app"
    class="app"
    @runabtest="onGlobalAbTestRun"
  >
    <v-app class="application theme--light">
      <div class="app-wrapper">
        <section class="app__content">
          <nuxt />
          <v-snackbar
            v-model="snackbar"
            :class="['elevation-0', 'notification', snackbarCustomClass]"
            :top="isSnackbarShowInTop"
            :bottom="!isSnackbarShowInTop"
            right
            :timeout="snackbarDuration"
            :color="snackbarColor"
            auto-height
          >
            <div>
              <span
                class="flex xs12"
                v-text="snackbarMessage"
              >
              </span>
              <nuxt-link
                v-if="snackbarRoute"
                :to="snackbarRoute.to"
                class="white--text flex xs-12 snackbar-link"
                @click.native="snackBarClick"
              >
                {{ snackbarRoute.title }}
              </nuxt-link>
              <span
                v-if="snackbarMessageAfterLink"
                class="flex xs12"
                v-text="snackbarMessageAfterLink"
              >
              </span>
            </div>
            <v-btn
              flat
              color="white"
              class="ml-2"
              @click.native="snackbar = false"
            >
              <strong>&times;</strong>
            </v-btn>
          </v-snackbar>
        </section>
      </div>
    </v-app>
  </section>
</template>

<script>
import VSnackbar from 'vuetify/es5/components/VSnackbar/VSnackbar'
import VBtn from 'vuetify/es5/components/VBtn/VBtn'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import { wiseImport } from '@/common/async-components/async-import'
import { PAGES_NAMES_WITH_SCROLLABLE_HEADER } from '@/helpers/constants'

export default {
  components: {
    VSnackbar, VBtn,
    ...wiseImport('ConfirmationPopup'),
    ...wiseImport('SmallMenu'),
    ...wiseImport('CookieBanner'),
  },
  head () {
    return {
      htmlAttrs: {
        lang: this.getLangCode,
        class: this.isSmallMenuOpen ? 'blocked-iOS-scroll' : ''
      },
      title: this.localize('general.title'),
      link: [
        { hid: 'canonical', rel: 'canonical', href: this.canonicalPath }
      ]
    }
  },
  data () {
    return {
      snackbar: false,
      snackbarMessage: '',
      snackbarMessageAfterLink: '',
      snackbarRoute: null,
      snackbarColor: '',
      snackbarDuration: 0,
      snackbarCustomClass: '',
      snackbarClickCallback: null,
      hideMainContent: false,
      isOnline: true,
      asyncSmallMenu: '',
      shouldFixPadding: false,
      hasChatScriptLoaded: false
    }
  },
  computed: {
    ...mapState(['loading', 'isSmallMenuOpen', 'isFilterPopupOpen']),
    ...mapGetters(['getIsDesktop']),
    ...mapGetters(['getLangCode']),
    ...mapState(['localizedStrings', 'country']),
    ...mapGetters('abtests', ['getIsNewSearchDesign']),
    canonicalPath () {
      return this.$route.path === '/' ? this.host : `${this.host}${this.$route.path}`
    },
  },
  async created () {
    if (process.client && !this.getCustomer.token) {
      try {
        await this.fetchAnonymousSessionToken()
      } catch (e) {
        throw e
      }
    }
  },
  mounted () {
    this.onAuthStatusChange()
    window.addEventListener('resize', this.onResizeSetWindowWidth)
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)

    this.onResizeSetWindowWidth()

    this.$nuxt.$on('notify', (message, color = 'primary', duration) => {
      this.showSnackbar(message, color, duration)
    })
    this.$nuxt.$on('snackBarClick', (callback) => {
      this.snackbarClickCallback = callback
    })
    // to add customerLoggedIn event right after user logged in
    this.$nuxt.$on('loggedIn', this.pushGoogleTagHashedEmailEvent)
    // to add customerLoggedIn event on initial load if user is logged in
    this.pushGoogleTagHashedEmailEvent()

    this.hideMainContent = true
    this.setLoading(false)
    this.setCountry(this.country)

    this.checkIfMenuIsEmpty()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeSetWindowWidth)
    this.$nuxt.$off('notify')
    this.$nuxt.$off('snackBarClick')
    this.$nuxt.$off('close-welcome-modal')
    this.$nuxt.$off('loggedIn')
  },
  methods: {
    ...mapActions('customer', ['fetchAnonymousSessionToken']),
    ...mapActions('info', ['checkIfMenuIsEmpty']),
    ...mapMutations('customer', ['setCountry']),
    ...mapMutations([
      'setLoading',
      'setWindowWidth',
      'setSmallMenuStatus'
    ]),
    ...mapMutations('abtests', ['setActiveAbTest']),
    showSnackbar (message, color, duration = 3000) {
      this.snackbarMessage = message.text || message
      this.snackbarRoute = message.route
      this.snackbarMessageAfterLink = message.textAfterLink || ''
      this.snackbarCustomClass = message.class || ''
      this.snackbarColor = color
      this.snackbar = true
      this.snackbarDuration = duration
    },
    onResizeSetWindowWidth () {
      this.setWindowWidth(window.innerWidth)
    },
    onGlobalAbTestRun (event) {
      const { name } = event.detail

      if (name) {
        this.setActiveAbTest(name)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  /* vuetify adds padding top for all toolbars and extension slots, which causes unexpected scroll behavior
  this allows to ignore adding extension slot with search */
  @import 'media';

  /* fix incorrect padding during SSR to prevent jumping */
  .v-content:not([data-booted="true"]) {
    padding-top: 104px !important;

    @include desktop {
      padding-top: 75px !important;
    }
  }

  /* sticky footer */
  .app {
    &-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    &__content {
      flex: 1 0 auto;
    }

    &__footer {
      flex-shrink: 0;
    }
  }

  .offline {
    bottom: 10px;
    left: 10px;
    z-index: 1000;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  .empty-cat-padding-fix {
    padding-top: 100px !important;
  }
</style>
