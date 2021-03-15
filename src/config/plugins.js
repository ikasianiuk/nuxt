// Plugins config

export default [
  '~/plugins/options',
  '~/plugins/baseUrlDefine',
  '~/plugins/axiosInstance.js',
  '~/plugins/vuetify',
  { src: '~/plugins/intl', mode: 'server' },
  '~/plugins/getAPIvariables',
  '~/plugins/redirectChecker',
  '~/common/mixins/localize',
  '~/common/mixins/isMounted',
  '~/common/mixins/breadcrumbs',
  '~/common/mixins/imageUrlConstructor',
  { src: '~/plugins/localstorage.js', ssr: false },
  { src: '~/plugins/artefactActions', ssr: false }
]
