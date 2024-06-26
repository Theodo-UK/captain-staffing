import React from "react";
import { Cell } from "fixed-data-table-2";

const getProjectColor = (row, week) => {
  if (!row.name) {
    // if it's a line project
    return null;
  }

  const staffedDaysString = row.staffing[week] ? row.staffing[week]._total : 0;
  if (!staffedDaysString) {
    // unstaffed
    return "#EF9A9A"; // Light Red
  }

  const staffedDays = parseFloat(row.staffing[week]._total);
  if (staffedDays > 0) {
    // fully staffed
    return "#81C784"; // Green
  }

  return null; // white
};

const getValue = (row, week) => {
  if (!row.staffing[week]) return null;

  if (row.user) {
    return row.staffing[week][row.user];
  }

  return row.staffing[week]._total;
};

export default class StaffingCell extends React.Component {
  // static propTypes = {
  //   data: React.PropTypes.array.isRequired,
  //   week: React.PropTypes.string,
  //   rowIndex: React.PropTypes.number,
  //   onClick: React.PropTypes.func.isRequired,
  // };

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
