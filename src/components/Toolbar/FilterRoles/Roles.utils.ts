import { ALL_ROLES_MAPPING } from "./Roles.constant";

export const isSubRole = (roleGroup: string, roleName: string) => ALL_ROLES_MAPPING[roleGroup].includes(roleName);
