export interface IColumn { name: string; isSelected: boolean }

export const INITIAL_COLUMN_STATE: IColumn[] = [
  {
    name: "User",
    isSelected: true
  },
  {
    name: "Company",
    isSelected: true
  },
  {
    name: "Project",
    isSelected: true
  },
  {
    name: "Calendar",
    isSelected: true
  }
];
