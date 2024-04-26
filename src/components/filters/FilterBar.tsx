import DropdownTreeSelect from "react-dropdown-tree-select";
// @ts-expect-error file is not typed yet
import { getPositionForFilter } from "../../helpers/formatter";
import { FilterCompanies } from "./FilterCompanies";

interface FilterBarProps {
  positionsState: { [positionName: string]: boolean };
  positionLastClicked: string | undefined;
  positionsSelectorOnChange: () => void;
  companiesState: { [companyName: string]: boolean };
  toggleCompanyFilter: (companyName: string) => void;
  toggleAllActive: () => void;
  toggleNoneActive: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  positionsState = {},
  positionLastClicked,
  positionsSelectorOnChange,
  companiesState = {},
  toggleCompanyFilter,
  toggleAllActive,
  toggleNoneActive
}) => (
  <div className="flex items-center space-x-4">
    <DropdownTreeSelect
      className="positionDropdown"
      data={getPositionForFilter(positionsState, positionLastClicked)}
      onChange={positionsSelectorOnChange}
    />
    <FilterCompanies
      toggleNoneActive={toggleNoneActive}
      toggleAllActive={toggleAllActive}
      toggleCompanyFilter={toggleCompanyFilter}
      companiesState={companiesState}
    />
  </div>
);
