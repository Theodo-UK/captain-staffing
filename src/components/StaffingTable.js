import React from 'react'
import { Table, Column, Cell } from 'fixed-data-table'
import HeaderCell from './HeaderCell'
import StaffingCell from './StaffingCell'
import ProjectCell from './ProjectCell'

import moment from 'moment'

import 'fixed-data-table/dist/fixed-data-table.css'

export default class StaffingTable extends React.Component {

  static propTypes = {
    weeks: React.PropTypes.array.isRequired,
    peopleStaffing: React.PropTypes.array.isRequired,
    onHeaderClick: React.PropTypes.func,
  }

  render() {
    return (
      <Table
        width={window.innerWidth - 20}
        rowsCount={this.props.peopleStaffing.length}
        rowHeight={35}
        maxHeight={1300}
        headerHeight={40}
      >
        <Column
          cell={
            <HeaderCell
              data={this.props.peopleStaffing}
              onClick={this.props.onHeaderClick}
              field="name"
            />
          }
          width={120}
          fixed
        />
        <Column
          cell={
            <ProjectCell
              data={this.props.peopleStaffing}
              field="project"
            />
          }
          width={120}
          fixed
        />
        {
          this.props.weeks.map((week, i) => {
            return (
              <Column
                key={i}
                header={
                  <Cell>{ moment(week, 'DD/MM/YYYY').format('DD/MM') }</Cell>
                }
                cell={
                  <StaffingCell
                    data={this.props.peopleStaffing}
                    week={moment(week, 'DD/MM/YYYY').format('DD/MM')}
                  />
                }
                width={60}
              />
            )
          })
        }
      </Table>
    )
  }
}
