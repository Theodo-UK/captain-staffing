import React from "react";
import { Table, Column, Cell } from "fixed-data-table-2";
import HeaderCell from "./HeaderCell";
import StaffingCell from "./StaffingCell";
import ProjectCell from "./ProjectCell";

import moment from "moment";

import "fixed-data-table-2/dist/fixed-data-table.css";

export default class StaffingTable extends React.Component {
  // static propTypes = {
  //   weeks: React.PropTypes.array.isRequired,
  //   peopleStaffing: React.PropTypes.array.isRequired,
  //   onRowClick: React.PropTypes.func,
  //   columnOrder: React.PropTypes.array,
  // };

  render() {
    return (
      <Table
        width={window.innerWidth - 20}
        rowsCount={
          this.props.peopleStaffing ? this.props.peopleStaffing.length : 0
        }
        rowHeight={30}
        maxHeight={750}
        headerHeight={40}
      >
        {this.props.columnOrder.includes("User") && (
          <Column
            header="User"
            cell={
              <HeaderCell
                data={this.props.peopleStaffing}
                onClick={this.props.onRowClick}
                field="name"
              />
            }
            width={200}
            fixed
          />
        )}

        {this.props.columnOrder.includes("Company") && (
          <Column
            header="Company"
            cell={
              <HeaderCell
                data={this.props.peopleStaffing}
                onClick={this.props.onRowClick}
                field="company"
              />
            }
            width={200}
            fixed
          />
        )}

        {this.props.columnOrder.includes("Project") && (
          <Column
            header="Project"
            cell={
              <ProjectCell
                data={this.props.peopleStaffing}
                onClick={this.props.onRowClick}
                field="project"
              />
            }
            width={200}
            fixed
          />
        )}
        {this.props.columnOrder.includes("Calendar") &&
          this.props.weeks.map((week, i) => {
            return (
              <Column
                key={i}
                header={
                  <Cell>{moment(week, "YYYY/MM/DD").format("DD/MM")}</Cell>
                }
                headerClassName={`staffingHeaderCell staffingHeaderCell--${i}`}
                cell={
                  <StaffingCell
                    data={this.props.peopleStaffing}
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