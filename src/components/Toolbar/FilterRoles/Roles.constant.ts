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
  "Tech Specialist": "Lead",

  "CA / PO": "BizDev",
  "Operations (Finance) ": "BizDev",
  "Marketing": "BizDev",
  "Growth Team": "BizDev",
  "Sales": "BizDev",
  "Sales / AM": "BizDev",
  "Data Product Manager": "BizDev",
  "DP": "BizDev",
  "PM": "BizDev",
  "QARA": "BizDev",
  "Qara Principal": "BizDev",
  "KAM": "BizDev",
  "LPM": "BizDev",
  "PO/APM": "BizDev",

  "Lead Designer": "Designers",
  "Designer Confirmé": "Designers",
  "Designer Junior": "Designers",
  "Design Manager": "Designers",

  "LeadDevOps": "DevOps",
  "DevOps": "DevOps",
  "SecOps": "DevOps",
  "LeadSecOps": "DevOps",

  "Lead Data Scientist": "Data",
  "Lead Data Engineer": "Data",
  "Ingénieur IA": "Data",

  "Head of Tribe": "Other",
  "R&D": "Other",
  "Dirigeant": "Other"
};

/* 

Idea: 
- Business Unit: Tech | Bizdev | UX
- Lead: boolean

*/
