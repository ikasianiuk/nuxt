const { getLocaleDataByHost } = require('../helpers/getLocaleDataByHost.js')
const { getRobotsTxt } = require('../helpers/getRobotsTxt.js')

export default async function (req, res) {
  const { host } = req.headers
  const { locale } = getLocaleDataByHost(host)

  const fileContent = getRobotsTxt(host, locale)

  res.setHeader('Content-Type', 'text/plain')
  res.end(fileContent)
}

