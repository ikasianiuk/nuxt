// Config vue-head
import prefetchedThirdPartyDomains from './prefetchedThirdPartyDomains'

export default {
  title: 'nuxt',
  meta: [
    { charset: 'utf-8' },
    // check with designer if this should be removed for better lighthouse score
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
    { hid: 'robots', name: 'robots', content: 'INDEX,FOLLOW' },
    { hid: 'site', property: 'og:site_name', content: 'vidaxl' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ...prefetchedThirdPartyDomains
  ],
  script: [
    // For Zendesk prefill user data
    {
      innerHTML: 'window.adaSettings = { metaFields: {} }'
    }
  ]
}
