export function getParsedCampaignQueryWithAttr (query, id) {
  for (let key in query) {
    if (key.includes('attributes')) {
      if (typeof query[key] === 'object') {
        Object.assign(query, query[key])
      } else {
        const splitQueryValue = query[key].split('|')
        query[splitQueryValue[0]] = splitQueryValue[1]
      }
      delete query[key]
    }
  }

  id && (query.cat = id)

  return query
}
