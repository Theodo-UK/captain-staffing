// @ts-expect-error file is not typed yet
import { subTypes as ALL_ROLES_MAPPING } from "../../helpers/formatter";

import { FilterCompanies } from "./FilterCompanies";
import { TABS } from "../../constants";
import { Button } from "@/design-system/ui/button";
import {
  ArrowDownIcon,
  BackpackIcon,
  ColumnsIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import { MultiSelect } from "@/design-system/ui/multiselect/MultiSelect";
import { IColumn } from "./FilterColumns/FilterColumns.utils";
import { FilterRoles } from "./FilterRoles/FilterRoles";

interface ToolbarProps {
  setState: (newState: unknown) => void
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
  tableColumns: IColumn[];
  toggleTableColumn: (columnName: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  setState,
  positionsState = {},
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
  <div className="flex items-center space-x-2 my-4">
    <FilterRoles
      positionsState={positionsState}
      setState={setState}
    />
    <FilterCompanies
      toggleNoneActive={toggleNoneActive}
      toggleAllActive={toggleAllActive}
      toggleCompanyFilter={toggleCompanyFilter}
      companiesState={companiesState}
    />
    <Button variant="outline" size="sm" onClick={changeStaffingList}>
      <ArrowDownIcon className="mr-2 h-4 w-4" />
      {isSortedByImportance ? "Sort by company" : "Sort by importance"}
    </Button>
    <Button variant="outline" size="sm" onClick={changeActiveTab}>
      {activeTab === TABS.STAFFING ? (
        <ProjectButtonContent />
      ) : (
        <StaffingButtonContent />
      )}
    </Button>
    <div className="flex flex-1 flex-row-reverse space-x-2">
      <MultiSelect
        toggleOption={toggleTableColumn}
        title="Columns"
        options={tableColumns.map((tc) => ({
          label: tc.name,
          value: tc.name,
          isSelected: tc.isSelected
        }))}
        showSelected={false}
        Icon={ColumnsIcon}
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
