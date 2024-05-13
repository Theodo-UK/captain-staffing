export const ALL_ROLE_GROUPS = [
  'Devs', 'Lead', 'BizDev', 'Designers', 'DevOps', 'Data', 'Other'
] as const;

type RoleGroup = (typeof ALL_ROLE_GROUPS)[number]
type RoleMapping = { [roleName: string]: RoleGroup }

export const ALL_ROLES_MAPPING: RoleMapping = {
  "Dev": "Devs",

  "Architecte": "Lead",
  "Archi volant": "Lead",
  "Engineering Manager": "Lead",
  "Senior architect": "Lead",
  "VP Tech": "Lead",

  "CA / PO": "BizDev",
  "Operations (Finance) ": "BizDev",
  "DP / PM / AM": "BizDev",
  "Marketing": "BizDev",
  "Growth Team": "BizDev",
  "Sales": "BizDev",
  "Data Product Manager": "BizDev",
  "DP": "BizDev",
  "PM": "BizDev",
  "QARA": "BizDev",

  "Lead Designer": "Designers",
  "Designer Confirmé": "Designers",
  "Designer Junior": "Designers",

  "LeadDevOps": "DevOps",
  "DevOps": "DevOps",
  "DevOps [FREE]": "DevOps",
  "SecOps": "DevOps",
  "LeadSecOps": "DevOps",

  "Lead Data Scientist": "Data",
  "Lead Data Engineer": "Data",
  "Ingénieur IA": "Data",

  "Externe": "Other",
  "Head of Tribe": "Other",
  "R&D": "Other",
  "Evangelist": "Other",
  "Dirigeant": "Other"
};
