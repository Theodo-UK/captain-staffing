import DropdownTreeSelect from "react-dropdown-tree-select";
// @ts-expect-error file is not typed yet
import { getPositionForFilter } from "../../../helpers/formatter";

interface FilterRolesProps {
  positionsState: { [positionName: string]: boolean };
  positionLastClicked: string | undefined;
  positionsSelectorOnChange: () => void;
}

export const FilterRoles: React.FC<FilterRolesProps> = ({ positionsState, positionLastClicked, positionsSelectorOnChange }) => (
  <DropdownTreeSelect
    className="positionDropdown"
    data={getPositionForFilter(positionsState, positionLastClicked)}
    onChange={positionsSelectorOnChange}
  />);
