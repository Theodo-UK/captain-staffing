import { ALL_ROLES_MAPPING } from "./Roles.constant";

export const isSubRole = (roleGroup: string, roleName: string): boolean => {
  if (roleName in ALL_ROLES_MAPPING) {
    return ALL_ROLES_MAPPING[roleName] === roleGroup;
  }
  return false;
};
