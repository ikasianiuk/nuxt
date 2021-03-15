const defaultEnvironment = 'prod'
process.env.CONFIG = process.env.CONFIG || process.env.npm_config_env || defaultEnvironment
// used require instead of import as import() is async
let config

try {
  config = require(`../environments/${process.env.CONFIG}`).config
} catch (e) {
  config = require(`../environments/${defaultEnvironment}`).config
}

export function applyEnvironment () {
  for (let prop in config) {
    process.env[prop] = config[prop]
  }
}
