import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VGrid,
  transitions
} from 'vuetify'
import { Ripple, Scroll, ClickOutside } from 'vuetify/es5/directives'
import 'intersection-observer'

Vue.use(Vuetify, {
  components: {
    VApp,
    VGrid,
    transitions
  },
  directives: {
    Ripple, Scroll, ClickOutside
  },
  theme: {
    primary: '#93117e',
    accent: '#eb690b',
    secondary: '#76787b', // check with designer if this color should be changed for better lighthouse score
    info: '#96c03a',
    warning: '#eb690b',
    success: '#96c03a',
    error: '#DD3333',
    grey: '#e0e0e0'
  },
  options: {
    minifyTheme (css) {
      return css.replace(/[\s|\r\n|\r|\n]/g, '')
    }
  }
})
