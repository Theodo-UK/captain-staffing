import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import HeaderCell from './HeaderCell';
import StaffingCell from './StaffingCell';

import moment from 'moment';

import 'fixed-data-table/dist/fixed-data-table.css';

export default class StaffingTable extends React.Component {

  static propTypes = {
    weeks: React.PropTypes.array.isRequired,
    peopleStaffing: React.PropTypes.array.isRequired
  };

  render() {
    return (
      <Table
        width={window.innerWidth - 20}
        rowsCount={this.props.peopleStaffing.length}
        rowHeight={35}
        maxHeight={1300}
        headerHeight={40} >
        <Column
          cell={
            <HeaderCell
              data={this.props.peopleStaffing}
              field="name"
            />
          }
          width={120}
          fixed={true}
        />
        {
          this.props.weeks.map((week, i) => {
            return (
              <Column
                key={ i }
                header={
                  <Cell>{ moment(week, 'DD/MM/YYYY').format('DD/MM') }</Cell>
                }
                cell={
                  <StaffingCell
                    data={ this.props.peopleStaffing }
                    week={ moment(week, 'DD/MM/YYYY').format('DD/MM') }
                  />
                }
                width={60}
              />
            );
          })
        }
      </Table>
    );
  }
}