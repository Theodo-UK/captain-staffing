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
    onRowClick: React.PropTypes.func,
    type: React.PropTypes.string,
  }

  render() {
    return (
      <Table
        width={window.innerWidth - 20}
        rowsCount={this.props.peopleStaffing ? this.props.peopleStaffing.length : 0}
        rowHeight={35}
        maxHeight={1300}
        headerHeight={40}
      >
        <Column
          cell={
            <HeaderCell
              data={this.props.peopleStaffing}
              onClick={this.props.onRowClick}
              type={this.props.type}
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
              onClick={this.props.onRowClick}
              field="project"
            />
          }
          width={120}
          fixed
        />
        {this.props.weeks.map((week, i) => {
          return (
            <Column
              key={i}
              header={<Cell>{moment(week, 'DD/MM/YYYY').format('DD/MM')}</Cell>}
              headerClassName={`staffingHeaderCell staffingHeaderCell--${i}`}
              cell={
                <StaffingCell
                  data={this.props.peopleStaffing}
                  onClick={this.props.onRowClick}
                  week={moment(week, 'DD/MM/YYYY').format('DD/MM')}
                  projectView={this.props.type === 'projects'}
                />
              }
              cellClassName={`staffingCell staffingCell--${i}`}
              width={60}
            />
          )
        })}
      </Table>
    )
  }
}
