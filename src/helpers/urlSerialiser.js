export const serializeFalsyFilters = (object) => {
  return Object.entries(object).filter((entry) => {
    return !entry[1]
  }).map((entry) => {
    return encodeURIComponent(entry[0])
  })
}

export const deserializeFalsyFilters = (queryOptions) => {
  return queryOptions.reduce((acc, option) => {
    acc[decodeURIComponent(option)] = false
    return acc
  }, {})
}
