import DropdownTreeSelect from "react-dropdown-tree-select";
// @ts-expect-error file is not typed yet
import { getPositionForFilter } from "../../helpers/formatter";

const commonFilterStyles = {
  padding: "6px",
  marginRight: "10px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "4px",
  border: "2px solid #004262",
  fontSize: "14px",
};

const customFilterStyle = {
  ...commonFilterStyles,
  backgroundColor: "#33A5FF",
  color: "white",
  border: "none",
};

const companySelectedFilterStyle = {
  ...commonFilterStyles,
  border: "2px solid #004262",
  backgroundColor: "#004262",
  color: "white",
};

const companyUnselectedFilterStyle = {
  ...commonFilterStyles,
  border: "2px solid #004262",
  backgroundColor: "white",
  color: "#004262",
  opacity: "0.8",
};

interface FilterBarProps {
  positionsState: { [positionName: string]: boolean };
  positionLastClicked: string | undefined;
  positionsSelectorOnChange: () => void;
  companiesState: { [companyName: string]: boolean };
  toggleCompanyFilter: (companyName: string) => void;
  toggleAllActive: () => void;
  toggleNoneActive: () => void;
}

type Company = {
  name: string;
  isSelected: boolean;
};

export const FilterBar: React.FC<FilterBarProps> = ({
  positionsState,
  positionLastClicked,
  positionsSelectorOnChange,
  companiesState,
  toggleCompanyFilter,
  toggleAllActive,
  toggleNoneActive,
}) => {
  const companies: Company[] = Object.entries(companiesState).map(
    ([companyName, isSelected]) => ({ name: companyName, isSelected })
  );

  return (
    <>
      <DropdownTreeSelect
        className="positionDropdown"
        data={getPositionForFilter(positionsState, positionLastClicked)}
        onChange={positionsSelectorOnChange}
      />
      <div className="filter-container">
        {companies.map(({ name, isSelected }) => (
          <button
            key={name}
            style={
              isSelected
                ? companySelectedFilterStyle
                : companyUnselectedFilterStyle
            }
            onClick={() => {
              toggleCompanyFilter(name);
            }}
          >
            {name}
          </button>
        ))}
        <button style={customFilterStyle} onClick={toggleAllActive}>
          Toggle All
        </button>
        <button style={customFilterStyle} onClick={toggleNoneActive}>
          Toggle None
        </button>
      </div>
    </>
  );
};
