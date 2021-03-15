const fs = require('fs')
const filenames = fs.readdirSync('./src/common/locales/')
const allTranslations = getAllTranslations(filenames, '../common/locales/')

function JSONToCSVConvertor (filenames, translationData, exampleLocale) {
  const allTranslations = translationData.translations
  const labelRow = translationData.labelRow
  let csv = ''
  let errors = []

  // create the first two fields holding the KEY and DESCRIPTION label
  csv += 'KEY,DESCRIPTION,' + labelRow + '\r\n'

  // we need to start from English translation, since it's the one
  // developers add any new translations, so we don't want to miss anything added recently
  const enLocaleIndex = filenames.indexOf(exampleLocale)

  for (let key in allTranslations[enLocaleIndex]) {
    // add the first column with the flattened keys
    let row = '"' + key + '","",'

    allTranslations.forEach((currentLocales, i) => {
      let translation = currentLocales[key]
      row += '"' + translation + '",'
      // if translation is missing for this language, then add it to the errors array
      // so that it will get printed below the translations
      !translation && errors.push({
        locale: filenames[i].split('.')[0],
        key
      })
    })
    // add a line break after each row
    csv += row + '\r\n'
  }

  // add the missing translations below the normal translations
  if (errors.length) {
    csv += '\r\n\r\nMissing translations\r\n'
    errors.forEach(error => {
      csv += '"' + error.key + '","' + error.locale + '"\r\n'
    })
  }

  return csv
}

// get the content of all jsons in locales folder and
// return an object with the translations
// also construct and return the first line of the csv with the language keys
function getAllTranslations (filenames, path) {
  let translations = []
  let labelRow = ''

  for (let index in filenames) {
    const currentTranslation = require(path + filenames[index])
    // for every language, construct a flattened version of the json file
    // and add it to the translations array
    translations.push(flattenObject(currentTranslation))

    let label = filenames[index].split('.')[0]

    labelRow += '"' + label + '",'
  }

  return {
    translations: translations,
    labelRow: labelRow
  }
}

// create Output.csv with the result of the whole logic
function createCSVFile (data) {
  fs.writeFile('Output.csv', data, (err) => {
    // In case of a error throw err.
    if (err) throw err
  })
}

// create a flat object with all the nested keys
function flattenObject (ob) {
  let finalFlatObject = {}

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue

    if (typeof ob[i] === 'object') {
      let flatObject = flattenObject(ob[i])

      for (let x in flatObject) {
        flatObject.hasOwnProperty(x) && (finalFlatObject[i + '.' + x] = flatObject[x])
      }
    } else {
      finalFlatObject[i] = ob[i]
    }
  }
  return finalFlatObject
}

const csv = JSONToCSVConvertor(filenames, allTranslations, 'nl-NL.json')
createCSVFile(csv)

module.exports = {
  JSONToCSVConvertor,
  getAllTranslations,
  flattenObject
}
