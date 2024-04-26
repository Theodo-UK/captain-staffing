import React from "react";
// @ts-expect-error file is not typed yet
import { Table, Column, Cell } from "fixed-data-table-2";
// @ts-expect-error file is not typed yet
import HeaderCell from "./HeaderCell";
// @ts-expect-error file is not typed yet
import StaffingCell from "./StaffingCell";
// @ts-expect-error file is not typed yet
import ProjectCell from "./ProjectCell";

import moment from "moment";

import "fixed-data-table-2/dist/fixed-data-table.css";
import { IColumn } from "../Toolbar/FilterColumns/FilterColumns.utils";

interface StaffingTableProps {
  weeks: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  peopleStaffing: any[];
  onRowClick?: () => void;
  tableColumns: IColumn[];
}

const StaffingTable: React.FC<StaffingTableProps> = ({ weeks, peopleStaffing, onRowClick, tableColumns }) => {

  const showColumn = (columnName: string): boolean => tableColumns.find(tc => tc.name === columnName)?.isSelected || false;

  return (
    <Table
      width={window.innerWidth - 20}
      rowsCount={peopleStaffing ? peopleStaffing.length : 0}
      rowHeight={30}
      maxHeight={750}
      headerHeight={40}
    >
      {showColumn("User") && (
        <Column
          header="User"
          cell={
            <HeaderCell
              data={peopleStaffing}
              onClick={onRowClick}
              field="name"
            />
          }
          width={200}
          fixed
        />
      )}

      {showColumn("Company") && (
        <Column
          header="Company"
          cell={
            <HeaderCell
              data={peopleStaffing}
              onClick={onRowClick}
              field="company"
            />
          }
          width={200}
          fixed
        />
      )}

      {showColumn("Project") && (
        <Column
          header="Project"
          cell={
            <ProjectCell
              data={peopleStaffing}
              onClick={onRowClick}
              field="project"
            />
          }
          width={200}
          fixed
        />
      )}
      {showColumn("Calendar") &&
        weeks.map((week, i) => (
          <Column
            key={i}
            header={<Cell>{moment(week, "YYYY/MM/DD").format("DD/MM")}</Cell>}
            headerClassName={`staffingHeaderCell staffingHeaderCell--${i}`}
            cell={
              <StaffingCell
                data={peopleStaffing}
                onClick={onRowClick}
                week={week}
              />
            }
            cellClassName={`staffingCell staffingCell--${i}`}
            width={60}
          />
        ))}
    </Table>
  );
};

export default StaffingTable;
