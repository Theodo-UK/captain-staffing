
import * as React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import HeaderCell from './HeaderCell.js';
import StaffingCell from './StaffingCell.js';
import UserCell from './UserCell.js';
import moment from 'moment';
import 'fixed-data-table/dist/fixed-data-table.css';

interface ProjectTableProps {
  weeks: Array<string>;
  projectStaffing: Array<any>;
  onRowClick: React.MouseEventHandler<Cell>;
}

export default class ProjectTable extends React.Component<ProjectTableProps> {
  render() {
    return (
      <Table
        width={window.innerWidth - 20}
        rowsCount={this.props.projectStaffing ? this.props.projectStaffing.length : 0}
        rowHeight={30}
        maxHeight={750}
        headerHeight={40}
      >
        <Column
          header="Project"
          cell={
            <HeaderCell
              data={this.props.projectStaffing}
              onClick={this.props.onRowClick}
              field="name"
            />
          }
          width={250}
          fixed
        />
        <Column
          header="Company"
          cell={
            <HeaderCell
              data={this.props.projectStaffing}
              onClick={this.props.onRowClick}
              field="company"
            />
          }
          width={120}
          fixed
        />
        <Column
          header="Position"
          cell={
            <HeaderCell
              data={this.props.projectStaffing}
              onClick={this.props.onRowClick}
              field="position"
            />
          }
          width={120}
          fixed
        />
        <Column
          header="User"
          cell={
            <UserCell
              data={this.props.projectStaffing}
              onClick={this.props.onRowClick}
              field="user"
            />
          }
          width={120}
          fixed
        />
        {this.props.weeks.map((week: string, i: number) => {
          return (
            <Column
              key={i}
              header={<Cell key={i}>{moment(week, 'YYYY/MM/DD').format('DD/MM')}</Cell>}
              columnKey={`staffingHeaderCell staffingHeaderCell--${i}`}
              cell={
                <StaffingCell
                  data={this.props.projectStaffing}
                  onClick={this.props.onRowClick}
                  week={week}
                />
              }
              // cellClassName={`staffingCell staffingCell--${i}`}   deprecated in Typescript transition
              width={60}
            />
          )
        })}
      </Table>
    )
  }
}

// TODO: fix headerClassName
