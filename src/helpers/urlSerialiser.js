export const serializeTruthyFilters = (object) => {
  return Object.entries(object).filter((entry) => {
    return entry[1]
  }).map((entry) => {
    return encodeURIComponent(entry[0])
  })
}

export const deserializeTruthyFilters = (queryOptions) => {
  return queryOptions.reduce((acc, option) => {
    acc[decodeURIComponent(option)] = true
    return acc
  }, {})
}
