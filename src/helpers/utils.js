export const mergeUnion = (sourceObject, overrideObject) => {
  if (!overrideObject) return sourceObject

  const overrideEntries = Object.entries(overrideObject)

  const union = overrideEntries.filter((entry) => {
    return Object.keys(sourceObject).includes(entry[0])
  })

  return { ...sourceObject, ...Object.fromEntries(new Map(union)) }
}

export const addEllipsisToLongString = (str, maxChars) => {
  return str.length > maxChars ? `${str.slice(0, maxChars)}...` : str
}
