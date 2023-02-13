import React from 'react';
import { Cell } from 'fixed-data-table';

// TODO: needs fixing row typing

interface StaffingRow {
  staffing: object,
  project: string,
}

const getColor = (row: StaffingRow, week: string): string | null => {
  if (row.project) {
    // if it's a line project
    return null
  }

  const staffedDaysString = row.staffing[week] ? row.staffing[week]._total : 0;
  if (!staffedDaysString) {
    // unstaffed
    return '#EF5350' // red
  }

  const staffedDays = parseFloat(row.staffing[week]._total);
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
};

const roundToOneDecimal = (num: number): number => {
  return Math.round(num * 10) / 10;
};

const getValue = (row: StaffingRow, week: string): number | null => {
  if (!row.staffing[week]) return null;

  if (row.project) {
    return roundToOneDecimal(row.staffing[week][row.project]);
  }

  return roundToOneDecimal(row.staffing[week]._total);
};

interface Props {
  data: StaffingRow[],
  week?: string,
  rowIndex?: number,
  onClick: (row: StaffingRow) => void,
}

export default class StaffingCell extends React.Component<Props> {
  render() {
    const { rowIndex, week, data, ...props } = this.props;
    const backgroundColor = getColor(data[rowIndex], week);
    const style = { backgroundColor };
    return (
      <Cell
        {...props}
        onClick={this.props.onClick.bind(this, data[rowIndex])}
        style={style}
        className="clickable"
      >
        {getValue(data[rowIndex], week)}
      </Cell>
    );
  }
}
