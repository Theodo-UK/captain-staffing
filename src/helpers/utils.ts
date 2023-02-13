// TODO: Not sure what the state and object types are
export const hasActiveCompanies = (companies: string[], companyFilterState) => {
  return companies.reduce((acc, company) => {
    return companyFilterState[company] || acc
  }, false)
}

export const mergeUnion = (sourceObject, overrideObject) => {
  if (!overrideObject) return sourceObject

  const overrideEntries = Object.entries(overrideObject)

  const union = overrideEntries.filter((entry) => {
    return Object.keys(sourceObject).includes(entry[0])
  })

  return { ...sourceObject, ...Object.fromEntries(new Map(union)) }
}

export const addEllipsisToLongString = (text: string, maxChars: number) => {
  return text.length > maxChars ? `${text.slice(0, maxChars)}...` : text
}
