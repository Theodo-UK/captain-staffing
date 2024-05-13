// @ts-expect-error file is not typed yet
import { subTypes as ALL_ROLES_MAPPING } from "../../../helpers/formatter";
import { MultiSelect } from "@/design-system/ui/multiselect/MultiSelect";

interface FilterRolesProps {
  positionsState: { [positionName: string]: boolean };
  setState: (newState: unknown) => void
}

interface Role {
  name: string;
  isSelected: boolean;
}

export const FilterRoles: React.FC<FilterRolesProps> = ({ positionsState, setState }) => {

  const selectedRolesLvl2: Role[] = Object.entries(positionsState).filter(([roleName]) => Boolean(roleName)).map(
    ([roleName, isSelected]) => ({
      name: roleName,
      isSelected
    })
  ).sort((a, b) => a.name.localeCompare(b.name));

  const ALL_ROLES_LVL_1: string[] = Object.keys(ALL_ROLES_MAPPING);
  const selectedRolesLvl1 = ALL_ROLES_LVL_1.map(roleName => {
    const subRoles = selectedRolesLvl2.filter(r => ALL_ROLES_MAPPING[roleName].includes(r.name));

    return ({
      name: roleName,
      isSelected: subRoles.every(r => r.isSelected)
    });
  });

  const toggleRoleLvl1 = (roleName: string) => {
    const newFlag = !selectedRolesLvl1.find(r => r.name === roleName)?.isSelected;

    const newPositions = selectedRolesLvl2.reduce((acc, role) => {
      const isSubRole = ALL_ROLES_MAPPING[roleName].includes(role.name);
      if (isSubRole) {
        acc[role.name] = newFlag;
      }
      return acc;
    }, { ...positionsState });

    setState({ positions: newPositions });
  };

  const toggleRoleLvl2 = (roleName: string) => {
    const newPositions = { ...positionsState, [roleName]: !positionsState[roleName] };
    setState({ positions: newPositions });
  };


  return (
    <>
      <MultiSelect
        toggleOption={toggleRoleLvl2}
        title="Roles"
        options={selectedRolesLvl2.map((r) => ({
          label: r.name,
          value: r.name,
          isSelected: r.isSelected
        }))}
      />
      <MultiSelect
        toggleOption={toggleRoleLvl1}
        title="Roles"
        options={selectedRolesLvl1.map((r) => ({
          label: r.name,
          value: r.name,
          isSelected: r.isSelected
        }))}
      />
    </>
  );
};
