export default ({ store, req }) => {
  if (req && req.headers['user-agent']) {
    store.commit('setUserAgent', req.headers['user-agent'])
  }

  if (req && req.headers['host']) {
    const httpHostNames = ['localhost']
    const protocol = httpHostNames.some(hostname => req.headers['host'].includes(hostname)) ? 'http://' : 'https://'

    store.commit('setHost', protocol + req.headers['host'])
  }
}
