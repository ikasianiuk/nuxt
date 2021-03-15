const fs = require('fs-extra')
const path = require('path')

const eventBusSchema = {}

/**
 * check if given file is of certain file extension
 * @param filePath
 * @param extension - e.g. '.js', '.json'
 * @returns {boolean}
 */
function isFileExtension (filePath, extension) {
  return filePath.endsWith(extension)
}

/**
 * check whether file is an event emitter or listener and add its path to specific array
 * @param participantType - can be "emitter" or "listener"
 * @param filePath
 */
function isFileAnEventParticipantAs (participantType, filePath) {
  const regularExpressionForDetectingParticipant = participantType === 'emitter'
    ? /\$nuxt\.\$emit\((.+)/gm
    : /\$nuxt\.\$on\((.+)/gm

  const regularExpressionForExtractingEventName = participantType === 'emitter'
    ? /\$nuxt\.\$emit\('(.*?)',?/
    : /\$nuxt\.\$on\('(.*?)',?/

  const getRegularExpressionForDetectingUnsubscription = eventName => {
    return new RegExp(`\\$nuxt\\.\\$off\\(\\'(${eventName})\\',?`)
  }

  const getRegularExpressionForDetectingUnsubscriptionCommented = eventName => {
    return new RegExp(`\\/{2}\\s*\\S*\\$nuxt\\.\\$off\\(\\'(${eventName})\\',?`)
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const matches = fileContent.match(regularExpressionForDetectingParticipant)

  if (matches && matches.length) {
    matches.forEach((matchCase) => {
      if (matchCase && matchCase.match(regularExpressionForExtractingEventName)) {
        const eventName = matchCase.match(regularExpressionForExtractingEventName)[1]

        if (!eventBusSchema[eventName]) {
          eventBusSchema[eventName] = {
            emitters: [],
            listeners: []
          }
        }

        const prettyFilePath = filePath.replace(/\\/g, '/')

        if (!eventBusSchema[eventName][participantType + 's'].includes(prettyFilePath)) {
          eventBusSchema[eventName][participantType + 's'].push(prettyFilePath)

          const matchesUnsub = fileContent.match(getRegularExpressionForDetectingUnsubscription(eventName))
          const matchesUnsubCommented = fileContent.match(getRegularExpressionForDetectingUnsubscriptionCommented(eventName))

          if (
            participantType === 'listener' &&
            (
              (!matchesUnsub || !matchesUnsub.length) ||
              (matchesUnsubCommented && matchesUnsubCommented.length)
            )
          ) {
            throw new Error(`Unsubscribe from ${eventName} event in ${filePath}`)
          }
        }
      }
    })
  }
}

/**
 * function for making recursive event inspecting of all files in all directories starting from root directory
 * @param directory
 * @param filelist
 * @returns eventBusSchema
 */
function checkEventsInDirectoriesSync (directory, filelist = []) {
  let files = fs.readdirSync(directory)

  files.forEach(file => {
    // ignore static folder
    if (file === 'static') return

    if (fs.statSync(path.join(directory, file)).isDirectory()) {
      filelist = checkEventsInDirectoriesSync(path.join(directory, file), filelist)
    } else {
      let filePath = path.join(directory, file)

      if (isFileExtension(filePath, '.vue')) { // check only Vue files
        isFileAnEventParticipantAs('emitter', filePath)
        isFileAnEventParticipantAs('listener', filePath)
      }
    }
  })

  return eventBusSchema
}

module.exports = {
  generateEventBusSchema () {
    let generatedSchema = checkEventsInDirectoriesSync('./src')

    fs.writeFileSync('./src/helpers/eventBusSchema.json', JSON.stringify(generatedSchema, null, 2))
  }
}
