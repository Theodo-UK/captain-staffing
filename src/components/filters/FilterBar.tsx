import DropdownTreeSelect from "react-dropdown-tree-select";
// @ts-expect-error file is not typed yet
import { getPositionForFilter } from "../../helpers/formatter";

const commonFilterStyles = {
  padding: '6px',
  marginRight: '10px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  border: '2px solid #004262',
  fontSize: '14px',
};

const customFilterStyle = {
  ...commonFilterStyles,
  backgroundColor: '#33A5FF',
  color: 'white',
  border: 'none',
};

const companySelectedFilterStyle = {
  ...commonFilterStyles,
  border: '2px solid #004262',
  backgroundColor: '#004262',
  color: 'white',
};

const companyUnselectedFilterStyle = {
  ...commonFilterStyles,
  border: '2px solid #004262',
  backgroundColor: 'white',
  color: '#004262',
  opacity: '0.8',
};


interface FilterBarProps {
  positions: { [positionName: string]: boolean}
  positionLastClicked: string | undefined;
  positionsSelectorOnChange: () => void
  companies: { [companyName: string]: boolean}
  toggleCompanyFilter: (companyName: string) => void;
  toggleAllActive: () => void;
  toggleNoneActive: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({positions, positionLastClicked, positionsSelectorOnChange, companies, toggleCompanyFilter, toggleAllActive, toggleNoneActive}) => {
  return (
    <>
      <DropdownTreeSelect
        className="positionDropdown"
        data={getPositionForFilter(positions, positionLastClicked)}
        onChange={positionsSelectorOnChange}
      />
      <div className="filter-container">
        {Object.entries(companies).map(
          ([companyName, isSelected]) => {
            return (
              <button
                key={companyName}
                style={
                  isSelected
                    ? companySelectedFilterStyle
                    : companyUnselectedFilterStyle
                }
                onClick={() => {toggleCompanyFilter(companyName);}}
              >
                {companyName}
              </button>
            );
          },
        )}
        <button
          style={customFilterStyle}
          onClick={toggleAllActive}
        >
          Toggle All
        </button>
        <button
          style={customFilterStyle}
          onClick={toggleNoneActive}
        >
          Toggle None
        </button>
      </div>
    </>
  );
};
