import React from "react";
import { Table, Column, Cell } from "fixed-data-table-2";
import HeaderCell from "./HeaderCell";
import StaffingCell from "./StaffingCell";
import UserCell from "./UserCell";

import moment from "moment";

import "fixed-data-table-2/dist/fixed-data-table.css";

export default class ProjectTable extends React.Component {
  // static propTypes = {
  //   weeks: React.PropTypes.array.isRequired,
  //   projectStaffing: React.PropTypes.array.isRequired,
  //   onRowClick: React.PropTypes.func,
  // };

  render() {
    return (
      <Table
        width={window.innerWidth - 20}
        rowsCount={
          this.props.projectStaffing ? this.props.projectStaffing.length : 0
        }
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
        {this.props.weeks.map((week, i) => {
          return (
            <Column
              key={i}
              header={<Cell>{moment(week, "YYYY/MM/DD").format("DD/MM")}</Cell>}
              headerClassName={`staffingHeaderCell staffingHeaderCell--${i}`}
              cell={
                <StaffingCell
                  data={this.props.projectStaffing}
                  onClick={this.props.onRowClick}
                  week={week}
                />
              }
              cellClassName={`staffingCell staffingCell--${i}`}
              width={60}
            />
          );
        })}
      </Table>
    );
  }
}
