import React from 'react';
import { Cell } from 'fixed-data-table';

type StaffingCellProps = {
  data: Array<any>,
  week: string,
  rowIndex?: number,
  onClick: (arg: any) => void,
};

const getProjectColor = (row: any, week: string): string | null => {
  if (!row.name) { // if it's a line project
    return null;
  }

  const staffedDaysString = row.staffing[week]?._total ?? 0;
  if (!staffedDaysString) { // Unstaffed
    return '#EF9A9A';  // Light Red
  }

  const staffedDays = parseFloat(staffedDaysString);
  if (staffedDays > 0) { // fully staffed
    return '#81C784'; // Green
  }

  return null; // White
};

const getValue = (row: any, week: string): number | null => {
  if (!row.staffing[week]) {
    return null;
  }

  if (row.user) {
    return row.staffing[week][row.user];
  }

  return row.staffing[week]._total;
};

export default class StaffingCell extends React.Component<StaffingCellProps> {
  render() {
    const { rowIndex, week, data, ...props } = this.props;
    const backgroundColor = getProjectColor(data[rowIndex], week);
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
