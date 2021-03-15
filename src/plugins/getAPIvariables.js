export default ({ app }, inject) => {
  inject('getAPIvariables', () => ({ ...app.store.getters['getAPIVariables'], axios: app.$axiosInstance }))
}
