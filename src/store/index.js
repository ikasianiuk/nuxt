import {
  AUSTRALIA, AUSTRIA, BELGIUM, BULGARIA, CROATIA, CZECH_REPUBLIC, DENMARK, ESTONIA, FINLAND, FRANCE, GERMANY,
  GREECE, HUNGARY, IRELAND, ITALY, LATVIA, LITHUANIA, NETHERLANDS, NORWAY, POLAND, PORTUGAL, ROMANIA, SLOVAKIA,
  SLOVENIA, SPAIN, SWEDEN, SWITZERLAND, UNITED_KINGDOM, USA
} from '@/common/maps/countries'
import { get } from 'lodash'
import { isCheckoutReducedPage } from '@/helpers/isCheckoutReducedPage'
import { ERROR_CODES } from '@/helpers/constants'

export const state = () => ({
  vat: null, // Value added tax rate
  host: null,
  locales: [],
  locale: null,
  localizedStrings: null,
  loading: true,
  windowWidth: 0,
  isSmallMenuOpen: false,
  isFilterPopupOpen: false,
  serverError: '',
  userAgent: '', // user agent for appending to API requests
  breakPoints: {
    'xl': 1900,
    'lg': 1260,
    'md': 960,
    'sm': 600,
    'xs': 420
  },
  hasMultipleLanguages: false,
  countryLanguageList: null,
  country: '',
  deviceTypeSSR: null,
  countryList: null,
  errors: []
})

export const getters = {
  getAPIVariables (state, getters) {
    return {
      locale: getters['getLocale'].replace('-', '_').toLowerCase(),
      host: getters['getHost'],
      userAgent: getters['getUserAgent']
    }
  },
  getLangCode: state => state.locale.split('-')[0],
  getCountryShortName: state => state.locale.split('-')[1].toUpperCase(),
  getIsDesktop: state => {
    // Use service side device type while windowWidth === 0
    // Otherwise will generate wrong layout during SSR
    if (state.windowWidth === 0) {
      return state.deviceTypeSSR && state.deviceTypeSSR.isDesktop
    }

    return state.windowWidth >= 960
  },
  getIsTablet: state => {
    if (state.windowWidth === 0) {
      return state.deviceTypeSSR && state.deviceTypeSSR.isTablet
    }

    return state.windowWidth >= 600 && state.windowWidth < 960
  },
  getIsMobile: state => {
    if (state.windowWidth === 0) {
      return state.deviceTypeSSR && state.deviceTypeSSR.isMobile
    }

    return state.windowWidth < 600
  },
  getAuctionsPresence (state, getters) {
    // add countries when need to hide auctions for some of them
    return ![].includes(getters.getCountryShortName)
  },
  getFreeReturnsPresence (state, getters) {
    return ![AUSTRALIA, NORWAY].includes(getters.getCountryShortName)
  },
  getIsStateListDisplay (state, getters) {
    return ['US', 'AU', 'IE'].includes(getters.getCountryShortName)
  },
  getIsRequestTimeoutError ({ errors }) {
    if (!errors.length) return false

    const timeoutError = errors.find(error => error.code === ERROR_CODES.timeout)

    if (!timeoutError) return false

    return true
  }
}

export const mutations = {
  setIsCheckoutLayoutReduced (state, isReduced = false) {
    state.isCheckoutLayoutReduced = isReduced
  },
  setHost (state, host) {
    state.host = host
  },
  setUserAgent (state, userAgent) {
    state.userAgent = userAgent
  },
  setLanguage (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      // change locale only if it is present in all locales array, otherwise leave default
      state.locale = locale
    }
  },
  setVAT (state, vat) {
    state.vat = vat
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setLocalizedStrings (state, localeData) {
    state.localizedStrings = localeData
  },
  setLocalesList (state, locales) {
    state.locales = locales
  },
  setWindowWidth (state, width) {
    state.windowWidth = width
  },
  setSmallMenuStatus (state, isOpen) {
    state.isSmallMenuOpen = isOpen
  },
  setFilterPopupStatus (state, isOpen) {
    state.isFilterPopupOpen = isOpen
  },
  setServerError (state, error) {
    state.serverError = error
  },
  setLanguageData (state, { countryLanguageList, hasMultipleLanguages }) {
    state.hasMultipleLanguages = hasMultipleLanguages
    state.countryLanguageList = countryLanguageList
  },
  setPageStatus (state, { page, status }) {
    state[`is${page}Page`] = status
  },
  setCountry (state, country) {
    state.country = country
  },
  setDeviceTypeSSR (state, deviceTypeSSR) {
    state.deviceTypeSSR = deviceTypeSSR
  },
  setRefreshingPromise (state, refreshingPromise) {
    state.refreshingPromise = refreshingPromise
  },
  setRefreshingState (state, isRefreshing) {
    state.isRefreshing = isRefreshing
  },
  setCountryList (state, payload) {
    state.countryList = payload
  },
  setError (state, error) {
    state.errors = [...state.errors, error]
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch, commit, req }, { redirect, route }) {
    // prefetching all required data before rendering page
    try {
      // Set device identifed on server side by Nuxt to store
      // More details about implementation here: https://github.com/nuxt-community/device-module
      commit('setDeviceTypeSSR', this.$device)
      commit('setIsCheckoutLayoutReduced', isCheckoutReducedPage(route))

      await dispatch('info/fetchShopInfo')
    } catch (err) {
      // redirect to temporary page in empty layout due to nuxt bug
      console.error(err)
      commit('setServerError', err.message)
      redirect('/server-error')
    }
  },
  async fetchLocalizedStrings ({ commit }, data) {
    commit('setLocalizedStrings', data)
  },
  async detectLocale ({ commit }, data) {
    const { countryLanguageList, hasMultipleLanguages, vat, locales, locale, country, countryList } = data
    commit('setVAT', vat)
    commit('setLocalesList', locales)
    commit('setLanguage', locale)
    commit('setCountry', country)
    commit('customer/setCountry', country)
    commit('setLanguageData', { countryLanguageList, hasMultipleLanguages })
    commit('setCountryList', countryList)
  }
}
