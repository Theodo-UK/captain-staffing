import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import HeaderCell from './HeaderCell';
import StaffingCell from './StaffingCell';
import ProjectCell from './ProjectCell';
import moment from 'moment';
import 'fixed-data-table/dist/fixed-data-table.css';

interface StaffingTableProps {
  weeks: string[],
  peopleStaffing: any[],
  onRowClick: (e: any) => void,
  columnOrder: string[],
}

const StaffingTable: React.FC<StaffingTableProps> = ({weeks, peopleStaffing, onRowClick, columnOrder}) => {
  return (
    <Table
      width={window.innerWidth - 20}
      rowsCount={peopleStaffing ? peopleStaffing.length : 0}
      rowHeight={30}
      maxHeight={750}
      headerHeight={40}
    >
      {columnOrder.includes('User') && (
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
      {columnOrder.includes('Company') && (
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
      {columnOrder.includes('Project') && (
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
      {columnOrder.includes('Calendar') && (
        weeks.map((week, i) => {
          return (
            <Column
              key={i}
              header={<Cell>{moment(week, 'YYYY/MM/DD').format('DD/MM')}</Cell>}
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
          )
        }))}
    </Table>
  )
}

export default StaffingTable
