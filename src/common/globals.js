// this file was used to make server side request. Since nuxt server middlewares were removed - it isn't needed anymore
// kept it just in case of some errors with new logic and in case will need to maintain end-to-end tests again
const axios = require('axios')
const get = require('lodash/get')
const checkImageOrIterate = require('../helpers/checkImageOrIterate')

export default {
  makeRequest: async (res, options) => {
    options.timeout = 60000 // temporarily use 1 minute
    try {
      let { data } = await axios(options)

      process.env.CONFIG === 'test' && checkImageOrIterate(data)

      res.end(JSON.stringify(data))
    } catch (error) {
      if (process.env.CONFIG === 'dev') {
        console.log('Dev Environment Error: \n')
        error.response && console.log(error.response.data)
      }
      const status = get(error, 'response.status')
      const statusText = get(error, 'response.statusText')
      const errorData = get(error, 'response.data')
      const message = errorData && errorData.message
      if (errorData && errorData.success) {
        return res.end(JSON.stringify(errorData))
      }

      if (status && statusText) {
        res.statusCode = status
        if (errorData && errorData.message) {
          return res.end(JSON.stringify({ status, message }))
        } else {
          return res.end(JSON.stringify({ status, statusText }))
        }
      }

      if (error.code === 'ECONNREFUSED') res.statusCode = 500
      if (error.code === 'ECONNABORTED') res.statusCode = 408 // Request Timeout Code
      res.end(JSON.stringify(error.toString()))
    }
  }
}
