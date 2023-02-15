export const serializeTruthyFilters = (object: {}) => {
  return Object.entries(object).filter((entry) => {
    return entry[1]
  }).map((entry) => {
    return encodeURIComponent(entry[0])
  })
}

type AccumulateType = {
  [index: string]: boolean,
};

// TODO: what type is queryOptions
export const deserializeTruthyFilters = (queryOptions: string[]) => {
  return queryOptions.reduce((acc: AccumulateType, option: string) => {
    acc[decodeURIComponent(option)] = true
    return acc
  }, {})
}
