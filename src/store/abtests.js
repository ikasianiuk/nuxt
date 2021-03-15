// Need when you run ab-test globally
export const state = () => ({
  activeAbTests: []
})

export const mutations = {
  setActiveAbTest (state, testName) {
    if (!state.activeAbTests.includes(testName)) {
      state.activeAbTests.push(testName)
    }
  },
  removeDestroyedAbTest (state, testName) {
    if (state.activeAbTests.includes(testName)) {
      state.activeAbTests = state.activeAbTests.filter(item => item !== testName)
    }
  }
}

export const getters = {
  getIsNewSearchDesign: state => state.activeAbTests.includes('global_new_search_design_1'),
  getIsProductVariantOptionsAvailable: state => state.activeAbTests.includes('pdp_ab_test_variant_options_available'),
  getIsATConPLP: state => state.activeAbTests.includes('plp_atc')
}
