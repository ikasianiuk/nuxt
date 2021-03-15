import { LOCALES_WITH_SITEMAP } from './constants'

const getBaseRobotsTxt = (filePart = '') => {
  return `
  User-agent: *
  Disallow: /cart
  Disallow: /checkout
  Disallow: /account
  Disallow: /write-review
  Disallow: /seller
  Disallow: /*?attributes*
  Disallow: /*?order_by=*
  Disallow: /auction/*/*

  User-Agent: Baiduspider
  Disallow: /

  User-Agent: Slurp
  Disallow: /

  User-agent: YandexBot
  Disallow: /

  User-Agent: SEMrushBot
  Disallow: /
  ${filePart}
  `
}

const getSitemapFilePath = ({ host, locale, acceptedLocales = LOCALES_WITH_SITEMAP }) => {
  if (!acceptedLocales.includes(locale)) return

  return `https://${host}/sitemaps/${locale}/sitemap.xml`
}

const getRobotsTxtSitemapPart = (filePath) => {
  if (!filePath) return ''

  return `
  User-agent: *
  Allow: /

  Sitemap: ${filePath}
  `
}

const getRobotsTxt = (host, locale) => getBaseRobotsTxt(getRobotsTxtSitemapPart(getSitemapFilePath({ host, locale })))

export {
  getRobotsTxt
}
