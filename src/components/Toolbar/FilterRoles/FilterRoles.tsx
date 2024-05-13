import { LOCAL_FILTERS, updateFilterStorage } from "@/helpers/urlSerialiser";
import { MultiSelect } from "@/design-system/ui/multiselect/MultiSelect";
import { ALL_ROLE_GROUPS } from "./Roles.constant";
import { isSubRole } from "./Roles.utils";

interface FilterRolesProps {
  positionsState: { [positionName: string]: boolean };
  setState: (newState: unknown) => void
}

interface Role {
  name: string;
  isSelected: boolean;
}

export const FilterRoles: React.FC<FilterRolesProps> = ({ positionsState, setState }) => {

  const selectedRoles: Role[] = Object.entries(positionsState).filter(([roleName]) => Boolean(roleName)).map(
    ([roleName, isSelected]) => ({
      name: roleName,
      isSelected
    })
  ).sort((a, b) => a.name.localeCompare(b.name));

  const selectedRoleGroups = ALL_ROLE_GROUPS.map(roleGroup => {
    const subRoles = selectedRoles.filter(r => isSubRole(roleGroup, r.name));

    return ({
      name: roleGroup,
      isSelected: subRoles.every(r => r.isSelected),
      indeterminate: subRoles.some(r => r.isSelected)
    });
  });

  const toggleRoleGroup = (roleGroup: string) => {
    const newFlag = !selectedRoleGroups.find(r => r.name === roleGroup)?.isSelected;

    const newPositions = selectedRoles.reduce((acc, role) => {
      if (isSubRole(roleGroup, role.name)) {
        acc[role.name] = newFlag;
      }
      return acc;
    }, { ...positionsState });

    setState({ positions: newPositions });

    updateFilterStorage(LOCAL_FILTERS.POSITIONS, newPositions);
  };

  const toggleRole = (roleName: string) => {
    const newPositions = { ...positionsState, [roleName]: !positionsState[roleName] };
    setState({ positions: newPositions });

    updateFilterStorage(LOCAL_FILTERS.POSITIONS, newPositions);
  };


  return (
    <>
      <MultiSelect
        toggleOption={toggleRole}
        title="Roles"
        options={selectedRoles.map((r) => ({
          label: r.name,
          value: r.name,
          isSelected: r.isSelected
        }))}
      />
      <MultiSelect
        toggleOption={toggleRoleGroup}
        title="Role groups"
        options={selectedRoleGroups.map((r) => ({
          label: r.name,
          value: r.name,
          isSelected: r.isSelected,
          indeterminate: r.indeterminate
        }))}
      />
    </>
  );
};
