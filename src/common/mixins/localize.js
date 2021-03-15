import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import IntlMessageFormat from 'intl-messageformat'
import { get } from 'lodash'

export const localizeMixin = {
  computed: {
    ...mapState(['localizedStrings', 'locale']),
    ...mapGetters(['getCountryShortName', 'getIsCountryAustralia'])
  },
  methods: {
    localize (value, options) {
      if (!value && value !== 0) return

      if (options && options === 'currency') {
        typeof value === 'string' && (value = +value)

        const currencyValue = countDecimals(value) ? value.toFixed(2) : value

        let preResult = [this.currencySymbol, currencyValue]

        if (this.currencyPosition === 'after') {
          preResult.reverse()
        }

        if (!this.skipCurrencySpace) {
          preResult.splice(1, 0, ' ') // adding space between currency symbol and price
        }

        return preResult.join('')
      }

      if (!get(this.localizedStrings, value, '') && process.env.NODE_ENV === 'production') {
        const errorMessage = `Missing translation in ${this.locale} locale, key: ${value}`
        this.$sentry.captureException(new Error(errorMessage))
      }

      if (options) {
        return new IntlMessageFormat(
          get(this.localizedStrings, value, value),
          this.locale
        ).format(options)
      }

      return new IntlMessageFormat(
        get(this.localizedStrings, value, value),
        this.locale
      ).format()
    },
    localizeDate (date, type) {
      const isTime = type === 'time'
      const options = isTime ? { hour: '2-digit', minute: '2-digit' } : { year: 'numeric', month: 'long', day: 'numeric' }
      const methodName = isTime ? 'toLocaleTimeString' : 'toLocaleDateString'

      return date[methodName](this.locale, options)
    }
  }
}

function countDecimals (value) {
  const decimals = value.toString().split('.')[1]

  return decimals ? decimals.length : 0
}

Vue.mixin(localizeMixin)
