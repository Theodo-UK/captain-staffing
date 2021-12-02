export const hasActiveCompanies = (companies, companyFilterState) => {
  return companies.reduce((acc, company) => {
    return companyFilterState[company] || acc;
  }, false);
};
