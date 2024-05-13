// @ts-expect-error file is not typed yet
import { mergeUnion } from "./utils";

type CompanyState = { [companyName: string]: boolean }
type RoleState = { [roleName: string]: boolean }

const serializeTruthyFilters = (object: object) =>
  Object.entries(object)
    .filter((entry) => entry[1])
    .map((entry) => encodeURIComponent(entry[0]));

export const deserializeTruthyFilters = (queryOptions: string[]) =>
  queryOptions.reduce((acc, option) => {
    acc[decodeURIComponent(option)] = true;
    return acc;
  }, {} as Record<string, boolean>);

type UriQuery = {
  companies: string[];
  positions: string[];
};
const uriQuery: UriQuery = {
  companies: [],
  positions: []
};

export const LOCAL_FILTERS = {
  POSITIONS: "positionsFilterLocalStorage",
  COMPANIES: "companiesFilterLocalStorage"
} as const;

type LocalFilter = typeof LOCAL_FILTERS[keyof typeof LOCAL_FILTERS]

export const setupFilters = (filterList: string[], urlQuery: Record<string, boolean>, localStorage: CompanyState | RoleState) => {
  if (urlQuery) {
    return filterList.reduce((acc, option) => {
      acc[option] = Object.keys(urlQuery).includes(option);
      return acc;
    }, {} as Record<string, boolean>);
  }

  return mergeUnion(
    filterList.reduce((acc, company) => {
      acc[company] = true;
      return acc;
    }, {} as Record<string, boolean>),
    localStorage
  );
};

export const updateFilterStorage = (key: LocalFilter, object: CompanyState | RoleState) => {
  const newurl = `${window.location.origin}${window.location.pathname}`;

  // eslint-disable-next-line default-case
  switch (key) {
    case LOCAL_FILTERS.COMPANIES: {
      uriQuery.companies = serializeTruthyFilters(object);
      break;
    }

    case LOCAL_FILTERS.POSITIONS: {
      uriQuery.positions = serializeTruthyFilters(object);
      break;
    }
  }

  window.history.pushState(
    { path: newurl },
    "",
    `${newurl}?companies=${uriQuery.companies}&positions=${uriQuery.positions}`
  );

  window.localStorage.setItem(key, JSON.stringify(object));
};
