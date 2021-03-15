const path = require('path')
const fs = require('fs')
const beautify = require('js-beautify')
const axios = require('axios')

const format = 'tsv' // Format you'd like to parse. `tsv` or `csv`
const id = '1aa7X8ccxVFqWn97-_71kJ5wL1cOkZpeXRTJdi4mAjJg' // The Google Sheet ID found in the URL of your Google Sheet.
const sheetId = 41405187 // The Page ID of the Sheet you'd like to export. Found as `gid` in the URL.

axios.get(`https://docs.google.com/spreadsheets/d/${id}/export?format=${format}&id=${id}&gid=${sheetId}`)
  .then(resp => {
    let rows = resp.data.split(/\r\n/i)

    // we need one row array, in order to start the loop through the countries
    const first_row = rows[0].split(/\t/i)
    // we start from the 4th cell since the first three are the key | description | en content
    for (let column_id = 3; column_id < first_row.length; column_id++) {
      // start constructing the json
      let locale = {}
      // loop through the cells top to bottom (but not the first, since it's the label of the column)
      for (let row_index = 1; row_index < rows.length; row_index++) {
        const cells = rows[row_index].split(/\t/i)
        locale[cells[0]] = cells[column_id]
      }
      // create the file
      createJSON(first_row[column_id], JSON.stringify(unflatten(locale)))
    }

    console.log('Translations update is complete.')
  })

function unflatten (data) {
  let result = {}
  for (let i in data) {
    let keys = i.split('.')
    keys.reduce(function (r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? data[i] : {}) : [])
    }, result)
  }
  return result
}

function createJSON (name, data) {
  fs.writeFileSync(path.resolve(__dirname, '../common/locales/' + name + '.json'), beautify(data, { indent_size: 2 }))
}
