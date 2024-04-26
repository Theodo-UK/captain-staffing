import { MultiSelect } from "@/design-system/ui/multiselect/MultiSelect";

type Company = {
  name: string;
  isSelected: boolean;
};

interface FilterCompaniesProps {
  toggleNoneActive: () => void;
  toggleAllActive: () => void;
  toggleCompanyFilter: (value: string) => void;
  companiesState: { [companyName: string]: boolean };
}

export function FilterCompanies({
  toggleNoneActive,
  toggleAllActive,
  toggleCompanyFilter,
  companiesState
}: FilterCompaniesProps) {
  const companies: Company[] = Object.entries(companiesState).map(
    ([companyName, isSelected]) => ({
      name: companyName,
      isSelected
    })
  );
  const sortedCompanies = sortCompanies(companies).map((c) => ({
    label: c.name,
    value: c.name,
    isSelected: c.isSelected
  }));

  return (
    <MultiSelect
      clearFilter={toggleNoneActive}
      selectAll={toggleAllActive}
      toggleOption={toggleCompanyFilter}
      title="Company"
      options={sortedCompanies}
    />
  );
}

const sortCompanies = (companies: Company[]): Company[] => {
  let sortedCompanies = [...companies].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Put M33 and "NO BU" at the end of the list
  const END_OF_LIST_COMPANY_NAMES = ["M33", "NO BU"];
  const endOfListCompanies = sortedCompanies.filter((c) =>
    END_OF_LIST_COMPANY_NAMES.includes(c.name)
  );
  sortedCompanies = sortedCompanies
    .filter((c) => !END_OF_LIST_COMPANY_NAMES.includes(c.name))
    .concat(endOfListCompanies);

  return sortedCompanies;
};
