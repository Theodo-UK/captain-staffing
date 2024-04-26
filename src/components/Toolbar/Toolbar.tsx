import DropdownTreeSelect from "react-dropdown-tree-select";
// @ts-expect-error file is not typed yet
import { getPositionForFilter, getColumnFilter } from "../../helpers/formatter";

import { FilterCompanies } from "./FilterCompanies";
import { TABS } from '../../constants';
import { Button } from "@/design-system/ui/button";
import { ArrowDownIcon, BackpackIcon, PersonIcon } from "@radix-ui/react-icons";

interface ToolbarProps {
  // Positions
  positionsState: { [positionName: string]: boolean };
  positionLastClicked: string | undefined;
  positionsSelectorOnChange: () => void;

  // Companies
  companiesState: { [companyName: string]: boolean };
  toggleCompanyFilter: (companyName: string) => void;
  toggleAllActive: () => void;
  toggleNoneActive: () => void;

  // Sort buttons
  changeStaffingList: () => void;
  isSortedByImportance: boolean;
  changeActiveTab: () => void;
  activeTab: keyof typeof TABS;

  // Table Columns
  tableColumns: string[];
  toggleTableColumn: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  positionsState = {},
  positionLastClicked,
  positionsSelectorOnChange,
  companiesState = {},
  toggleCompanyFilter,
  toggleAllActive,
  toggleNoneActive,
  changeStaffingList,
  isSortedByImportance,
  changeActiveTab,
  activeTab,
  tableColumns,
  toggleTableColumn
}) => (
  <div className="flex items-center space-x-2">
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
    <Button
      variant="outline"
      size="sm"
      onClick={changeStaffingList}
    >
      <ArrowDownIcon className="mr-2 h-4 w-4" />
      {isSortedByImportance
        ? "Sort by company"
        : "Sort by importance"}
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={changeActiveTab}
    >
      {activeTab === TABS.STAFFING
        ? <ProjectButtonContent />
        : <StaffingButtonContent />}
    </Button>
    <div style={{ float: "right" }}>
      <DropdownTreeSelect
        texts={{ placeholder: "Filter Columns" }}
        className="positionDropdown"
        data={getColumnFilter(tableColumns)}
        onChange={toggleTableColumn}
      />
    </div>
  </div>
);

const ProjectButtonContent = () => (
  <>
    <BackpackIcon className="mr-2 h-4 w-4" />
    View projects
  </>
);

const StaffingButtonContent = () => (
  <>
    <PersonIcon className="mr-2 h-4 w-4" />
    View staffing
  </>
);
