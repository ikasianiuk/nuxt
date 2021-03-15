import { pagesCacheTTLs } from '@/common/maps/pages-cache-ttls'

const cacheHeader = 'Cache-Control'
const cacheType = 'public'
const deviceTypeHeader = 'CF-Device-Type'

const getDeviceTypeString = device => {
  let type = 'desktop'

  if (device.isMobile) {
    type = 'mobile'
  } else if (device.isTablet) {
    type = 'tablet'
  }
  return type
}

export const setPageCache = (res, type = '', device = null) => {
  if (!(process.server && res)) return false

  const maxAge = pagesCacheTTLs[type.toUpperCase()]

  if (!maxAge) return false

  const values = [
    cacheType,
    `max-age=${maxAge}`
  ]

  res.setHeader(cacheHeader, values.join(', '))

  if (device) {
    res.setHeader(deviceTypeHeader, getDeviceTypeString(device))
  }

  return true
}
