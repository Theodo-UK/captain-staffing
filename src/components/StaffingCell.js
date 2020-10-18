import React from 'react'
import { Cell } from 'fixed-data-table'

const getColor = (row, week) => {
  if (row.project) {
    return null
  }
  const staffedDaysString = row.staffing[week]._total
  if (!staffedDaysString) { // unstaffed
    return '#EF5350' // red
  }
  const staffedDays = parseFloat(staffedDaysString)
  if (staffedDays === 5) { // fully staffed
    return '#81C784' // Green
  }
  if (staffedDays > 1) { // partially staffed
    return '#EF9A9A' // Light Red
  }
  if (staffedDays > 5) { // overstaffed
    return '#FF9800' // Orange
  }
  return '#EF5350' // red
}

const getValue = (row, week) => {
  if (row.project) {
    return row.staffing[week][row.project]
  }

  return row.staffing[week]._total
}

export default class StaffingCell extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    week: React.PropTypes.string,
    rowIndex: React.PropTypes.number,
    onClick: React.PropTypes.func.isRequired,
  }

  render() {
    const { rowIndex, week, data, ...props } = this.props
    const style = {
      backgroundColor: getColor(data[rowIndex], week),
    }
    return (
      <Cell
        {...props}
        onClick={this.props.onClick.bind(this, data[rowIndex])}
        style={style}
        className="clickable"
      >
        {getValue(data[rowIndex], week)}
      </Cell>
    )
  }
}
