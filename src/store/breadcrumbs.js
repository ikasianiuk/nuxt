const state = () => ({
  breadcrumbs: []
})

const mutations = {
  setBreadcrumbs (state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs
  }
}

export default {
  state,
  mutations
}
