import React from 'react'
import { Cell } from 'fixed-data-table'

const getColor = (row, week) => {
  if (row.project) {
    // if it's a line project
    return null
  }

  const staffedDaysString = row.staffing[week] ? row.staffing[week]._total : 0
  if (!staffedDaysString) {
    // unstaffed
    return '#EF5350' // red
  }

  const staffedDays = parseFloat(row.staffing[week]._total)
  if (staffedDays === 5) {
    // fully staffed
    return '#81C784' // Green
  }
  if (staffedDays > 5) {
    // overstaffed
    return '#FF9800' // Orange
  }
  if (staffedDays > 1) {
    // partially staffed
    return '#EF9A9A' // Light Red
  }
  return '#EF5350' // red
}

const roundToOneDecimal = (num) => {
  return Math.round(num * 10) / 10
}

const getValue = (row, week) => {
  if (!row.staffing[week]) return null

  if (row.project) {
    return roundToOneDecimal(row.staffing[week][row.project])
  }

  return roundToOneDecimal(row.staffing[week]._total)
}

interface StaffingCellProps {
  data: unknown[]
  week?: string
  rowIndex?: number
  onClick(...args: unknown[]): unknown
}

export default class StaffingCell extends React.Component<StaffingCellProps> {
  render() {
    const { rowIndex, week, data, ...props } = this.props
    const backgroundColor = getColor(data[rowIndex], week)
    const style = { backgroundColor }
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
