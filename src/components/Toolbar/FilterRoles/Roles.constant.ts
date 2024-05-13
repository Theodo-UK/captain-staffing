interface RoleMapping {
  [RoleGroup: string]: string[]
}

export const ALL_ROLES_MAPPING: RoleMapping = {
  Devs: ["Dev"],
  Lead: [
    "Architecte",
    "Archi volant",
    "Engineering Manager",
    "Senior architect",
    "VP Tech"
  ],
  BizDev: [
    "CA / PO",
    "Operations (Finance) ",
    "DP / PM / AM",
    "Marketing",
    "Growth Team",
    "Sales",
    "Data Product Manager",
    "DP",
    "PM",
    "QARA"
  ],
  Designers: ["Lead Designer", "Designer Confirmé", "Designer Junior"],
  DevOps: ["LeadDevOps", "DevOps", "DevOps [FREE]", "SecOps", "LeadSecOps"],
  Data: ["Lead Data Scientist", "Lead Data Engineer", "Ingénieur IA"],
  Other: ["Externe", "Head of Tribe", "R&D", "Evangelist", "Dirigeant"]
} as const;
