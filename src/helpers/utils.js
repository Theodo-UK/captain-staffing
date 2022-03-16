export const hasActiveCompanies = (companies, companyFilterState) => {
  return companies.reduce((acc, company) => {
    return companyFilterState[company] || acc;
  }, false);
};

export const mergeUnion = (sourceObject, overrideObject) => {
  if (!overrideObject) return sourceObject

  const overrideEntries = Object.entries(overrideObject)

  const union = overrideEntries.filter((entry) => {
    return Object.keys(sourceObject).includes(entry[0])
  })

  return { ...sourceObject, ...Object.fromEntries(new Map(union)) }
}
